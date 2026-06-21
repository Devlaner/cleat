package dev.cleat.githubclient.service;

import dev.cleat.githubclient.dto.GitHubTokenResponse;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Duration;
import java.util.Base64;
import java.util.Date;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class TokenManager {

    private final RedisTemplate<String, String> redisTemplate;
    private final WebClient webClient;

    public TokenManager(RedisTemplate<String, String> redisTemplate, WebClient webClient) {
        this.redisTemplate = redisTemplate;
        this.webClient = webClient;
    }

    public String getInstallationToken(String installationId) {
        String cachedToken = redisTemplate.opsForValue().get("token:" + installationId);

        if (cachedToken != null) {
            return cachedToken;
        }

        return mintNewToken(installationId);
    }

    private String mintNewToken(String installationId) {
        String jwt = generateJwt();

        GitHubTokenResponse response = webClient
                .post()
                .uri("/app/installations/" + installationId + "/access_tokens")
                .header("Authorization", "Bearer " + jwt)
                .retrieve()
                .bodyToMono(GitHubTokenResponse.class)
                .block();

        if (response == null || response.getToken() == null) {
            throw new RuntimeException("GitHub-dan token almaq mümkün olmadı");
        }

        String newToken = response.getToken();

        redisTemplate.opsForValue().set("token:" + installationId, newToken, Duration.ofSeconds(3600));

        return newToken;
    }

    private String generateJwt() {
        try {
            String key = new String(Files.readAllBytes(Paths.get(
                    getClass().getClassLoader().getResource("private-key.pem").toURI())));
            String privateKeyPEM = key.replace("-----BEGIN PRIVATE KEY-----", "")
                    .replaceAll(System.lineSeparator(), "")
                    .replace("-----END PRIVATE KEY-----", "");

            byte[] encoded = Base64.getDecoder().decode(privateKeyPEM);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PrivateKey privateKey = keyFactory.generatePrivate(new PKCS8EncodedKeySpec(encoded));

            return Jwts.builder()
                    .setIssuer("YOUR_GITHUB_APP_ID") // Bura öz App ID-ni yaz
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 600000)) // 10 dəqiqəlik etibarlılıq
                    .signWith(privateKey, SignatureAlgorithm.RS256)
                    .compact();
        } catch (Exception e) {
            throw new RuntimeException("JWT yaradılması zamanı xəta baş verdi", e);
        }
    }
}
