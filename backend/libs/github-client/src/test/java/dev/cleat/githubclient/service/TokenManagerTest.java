package dev.cleat.githubclient.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    private TokenManager tokenManager;

    @BeforeEach
    void setUp() {
        tokenManager = new TokenManager(redisTemplate, webClient);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void getInstallationTokenReturnsCachedTokenWhenExistsInRedis() {
        String installationId = "123";
        String expectedToken = "valid-token";

        when(valueOperations.get("token:" + installationId)).thenReturn(expectedToken);

        String actualToken = tokenManager.getInstallationToken(installationId);

        assertEquals(expectedToken, actualToken);
    }

    @Test
    void getInstallationTokenMintNewTokenAndCacheItWhenCacheMiss() {
        // Arrange
        String installationId = "123";
        String newToken = "new-minted-token";
        String expiresAt = Instant.now().plus(1, ChronoUnit.HOURS).toString();

        GitHubTokenResponse response = new GitHubTokenResponse();
        response.setToken(newToken);
        response.setExpiresAt(expiresAt);

        when(valueOperations.get("token:" + installationId)).thenReturn(null);

        // Mocking WebClient chain
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(any(String.class))).thenReturn(requestBodySpec);
        when(requestBodySpec.header(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(GitHubTokenResponse.class)).thenReturn(Mono.just(response));

        // Act
        String actualToken = tokenManager.getInstallationToken(installationId);

        // Assert
        assertEquals(newToken, actualToken);
        // Verify that the token was saved to Redis with calculated TTL
        verify(valueOperations).set(eq("token:" + installationId), eq(newToken), any(Duration.class));
    }
}
