package dev.cleat.githubclient.service;

import java.time.Duration;
import java.time.Instant;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RateLimiterService {
    private final RedisTemplate<String, String> redisTemplate;

    public RateLimiterService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void checkLimit(String installationId) {
        String remaining = redisTemplate.opsForValue().get("rate_limit:" + installationId);

        if (remaining != null && Integer.parseInt(remaining) <= 0) {
            throw new RuntimeException("Rate limit exceeded for installation: " + installationId);
        }
    }

    public void updateLimit(String installationId, String remaining, String resetTimestamp) {
        try {
            int limit = Integer.parseInt(remaining);
            long resetTime = Long.parseLong(resetTimestamp);

            long ttl = resetTime - Instant.now().getEpochSecond();

            redisTemplate
                    .opsForValue()
                    .set("rate_limit:" + installationId, String.valueOf(limit), Duration.ofSeconds(Math.max(ttl, 1)));
        } catch (NumberFormatException e) {
        }
    }
}
