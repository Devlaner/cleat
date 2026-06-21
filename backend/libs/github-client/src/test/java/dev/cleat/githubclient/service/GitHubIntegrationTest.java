package dev.cleat.githubclient.service;


import dev.cleat.githubclient.config.TestGitHubConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean; // Yeni Spring Boot yanaşması
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(classes = TestGitHubConfig.class)class GitHubIntegrationTest {

    @MockitoBean
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private GitHubClient gitHubClient;

    @Test
    void testFullFlow() {
        assertNotNull(gitHubClient);
    }
}