package dev.cleat.githubclient.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.cleat.githubclient.dto.GitHubTokenResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
class TokenManagerTest {

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestBodyUriSpec requestBodyUriSpec;

    @Mock
    private WebClient.RequestBodySpec requestBodySpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    private TokenManager tokenManager;

    @BeforeEach
    void setUp() {
        TokenManager realTokenManager = new TokenManager(redisTemplate, webClient);
        tokenManager = spy(realTokenManager);

        ReflectionTestUtils.setField(tokenManager, "appId", "12345");
        ReflectionTestUtils.setField(tokenManager, "privateKeyPath", "src/test/resources/test-key.pem");
    }

    @Test
    void getInstallationTokenReturnsCachedTokenWhenExistsInRedis() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        String installationId = "123";
        String expectedToken = "valid-token";
        when(valueOperations.get("token:" + installationId)).thenReturn(expectedToken);

        String actualToken = tokenManager.getInstallationToken(installationId);

        assertEquals(expectedToken, actualToken);
    }

    @Test
    void getInstallationTokenMintNewTokenAndCacheItWhenCacheMiss() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        doReturn("fake-jwt-token").when(tokenManager).generateJwt();

        String installationId = "123";
        String newToken = "new-minted-token";

        GitHubTokenResponse response = new GitHubTokenResponse();
        response.setToken(newToken);
        response.setExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS).toString());

        when(valueOperations.get("token:" + installationId)).thenReturn(null);

        // WebClient chain
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(any(String.class))).thenReturn(requestBodySpec);
        when(requestBodySpec.header(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(GitHubTokenResponse.class)).thenReturn(Mono.just(response));

        String actualToken = tokenManager.getInstallationToken(installationId);

        assertEquals(newToken, actualToken);
        verify(valueOperations).set(eq("token:" + installationId), eq(newToken), any(Duration.class));
    }
}
