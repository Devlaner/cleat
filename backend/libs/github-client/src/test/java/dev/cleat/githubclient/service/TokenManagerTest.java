package dev.cleat.githubclient.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenManagerTest {

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private TokenManager tokenManager;

    @Test
    void getInstallationToken_ReturnsCachedToken_WhenExistsInRedis() {
        String installationId = "123";
        String expectedToken = "valid-token";

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("token:" + installationId)).thenReturn(expectedToken);

        String actualToken = tokenManager.getInstallationToken(installationId);

        assertEquals(expectedToken, actualToken);
        verify(redisTemplate, times(1)).opsForValue();
    }

    @Test
    void getInstallationToken_CallsMintNewToken_WhenNotInCache() {
        String installationId = "123";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("token:" + installationId)).thenReturn(null);

    }
}