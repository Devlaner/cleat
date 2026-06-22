package dev.cleat.githubclient.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class GitHubClient {
    private final WebClient webClient;
    private final TokenManager tokenManager;
    private final RateLimiterService rateLimiterService;

    public GitHubClient(WebClient gitHubWebClient, TokenManager tokenManager, RateLimiterService rateLimiterService) {
        this.webClient = gitHubWebClient;
        this.tokenManager = tokenManager;
        this.rateLimiterService = rateLimiterService;
    }

    public <T> T get(String uri, String installationId, Class<T> responseType) {
        rateLimiterService.checkLimit(installationId);

        String token = tokenManager.getInstallationToken(installationId);

        return webClient
                .get()
                .uri(uri)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .toEntity(responseType)
                .flatMap(entity -> {
                    List<String> remainingHeaders = entity.getHeaders().get("X-RateLimit-Remaining");
                    List<String> resetHeaders = entity.getHeaders().get("X-RateLimit-Reset");

                    if (remainingHeaders != null
                            && !remainingHeaders.isEmpty()
                            && resetHeaders != null
                            && !resetHeaders.isEmpty()) {
                        rateLimiterService.updateLimit(installationId, remainingHeaders.get(0), resetHeaders.get(0));
                    }
                    return Mono.justOrEmpty(entity.getBody());
                })
                .block();
    }
}
