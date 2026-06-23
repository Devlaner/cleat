package dev.cleat.githubclient.service;

import dev.cleat.githubclient.dto.GitHubTokenResponse;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class TokenManager {

    private final RedisTemplate<String, String> redisTemplate;
    private final WebClient webClient;

    public TokenManager(RedisTemplate<String, String> redisTemplate, WebClient gitHubWebClient) {
        this.redisTemplate = redisTemplate;
        this.webClient = gitHubWebClient;
    }

    @Value("${github.app-id}")
    private String appId;

    @Value("${github.private-key-path}")
    private String privateKeyPath;

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

        if (response == null || response.getToken() == null || response.getExpiresAt() == null) {
            throw new RuntimeException("Failed to retrieve a valid token from GitHub");
        }

        String newToken = response.getToken();

        Instant expiresAt = Instant.parse(response.getExpiresAt());
        long safetyMarginSeconds = 300;
        long ttlSeconds = ChronoUnit.SECONDS.between(Instant.now(), expiresAt) - safetyMarginSeconds;

        long finalTtl = Math.max(0, ttlSeconds);

        redisTemplate.opsForValue().set("token:" + installationId, newToken, Duration.ofSeconds(finalTtl));

        return newToken;
    }

    protected String generateJwt() {
        Path path = Paths.get(privateKeyPath);
        if (!Files.exists(path)) {
            throw new IllegalStateException("Private key file not found at path: " + privateKeyPath);
        }

        try {
            String key = Files.readString(path);

            String privateKeyPEM = key.replace("-----BEGIN PRIVATE KEY-----", "")
                    .replaceAll("\\s+", "")
                    .replace("-----END PRIVATE KEY-----", "");

            byte[] encoded = Base64.getDecoder().decode(privateKeyPEM);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PrivateKey privateKey = keyFactory.generatePrivate(new PKCS8EncodedKeySpec(encoded));

            return Jwts.builder()
                    .setIssuer(appId)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 600000))
                    .signWith(privateKey, SignatureAlgorithm.RS256)
                    .compact();
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while generating JWT", e);
        }
    }
}
