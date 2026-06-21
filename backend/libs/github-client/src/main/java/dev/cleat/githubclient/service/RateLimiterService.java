package dev.cleat.githubclient.service;

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

    public void updateLimit(String installationId, String remaining) {
        redisTemplate.opsForValue().set("rate_limit:" + installationId, remaining);
    }
}
