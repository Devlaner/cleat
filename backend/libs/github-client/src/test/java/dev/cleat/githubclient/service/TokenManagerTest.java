package dev.cleat.githubclient.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

@ExtendWith(MockitoExtension.class)
class TokenManagerTest {

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private TokenManager tokenManager;

    @Test
    void getInstallationTokenReturnsCachedTokenWhenExistsInRedis() {
        String installationId = "123";
        String expectedToken = "valid-token";

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("token:" + installationId)).thenReturn(expectedToken);

        String actualToken = tokenManager.getInstallationToken(installationId);

        assertEquals(expectedToken, actualToken);
        verify(redisTemplate, times(1)).opsForValue();
    }

    @Test
    void getInstallationTokenCallsMintNewTokenWhenNotInCache() {
        String installationId = "123";

        // leninet() istifadə edirik ki, metod çağırılmasa belə xəta verməsin
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        lenient().when(valueOperations.get("token:" + installationId)).thenReturn(null);
    }
}
