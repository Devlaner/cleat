package dev.cleat.githubclient.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

@ExtendWith(MockitoExtension.class)
class RateLimiterServiceTest {

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private RateLimiterService rateLimiterService;

    @Test
    void checkLimit_ThrowsException_WhenLimitIsZero() {
        String id = "123";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("rate_limit:" + id)).thenReturn("0");

        assertThrows(RuntimeException.class, () -> rateLimiterService.checkLimit(id));
    }
}
