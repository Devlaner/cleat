package dev.cleat.githubclient.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
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
    void checkLimitThrowsExceptionWhenLimitIsZero() {
        String id = "123";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("rate_limit:" + id)).thenReturn("0");

        assertThrows(RuntimeException.class, () -> rateLimiterService.checkLimit(id));
    }

    @Test
    void updateLimitShouldCalculateCorrectTtlAndCallRedis() {
        String installationId = "123";
        String remaining = "4999";
        long resetTimestamp = Instant.now().getEpochSecond() + 3600;
        String resetStr = String.valueOf(resetTimestamp);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        rateLimiterService.updateLimit(installationId, remaining, resetStr);

        verify(valueOperations)
                .set(
                        eq("rate_limit:" + installationId),
                        eq(remaining),
                        argThat(duration -> duration.getSeconds() >= 3590 && duration.getSeconds() <= 3600));
    }

    @Test
    void updateLimitShouldClearCacheOnNumberFormatException() {
        String installationId = "123";

        rateLimiterService.updateLimit(installationId, "invalid", "invalid");

        verify(redisTemplate).delete("rate_limit:" + installationId);
    }
}
