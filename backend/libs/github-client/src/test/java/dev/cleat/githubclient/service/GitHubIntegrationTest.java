package dev.cleat.githubclient.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import dev.cleat.githubclient.config.TestGitHubConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(classes = TestGitHubConfig.class)
class GitHubIntegrationTest {

    @MockitoBean
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private GitHubClient gitHubClient;

    @Test
    void testFullFlow() {
        assertNotNull(gitHubClient);
    }
}
