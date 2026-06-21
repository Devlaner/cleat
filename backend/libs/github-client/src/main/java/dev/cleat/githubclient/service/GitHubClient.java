package dev.cleat.githubclient.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GitHubClient {
    private final WebClient webClient;
    private final TokenManager tokenManager;
    private final RateLimiterService rateLimiterService;

    public GitHubClient(WebClient.Builder webClientBuilder,
                        TokenManager tokenManager,
                        RateLimiterService rateLimiterService) {
        this.webClient = webClientBuilder.build();
        this.tokenManager = tokenManager;
        this.rateLimiterService = rateLimiterService;
    }

    public <T> T get(String uri, String installationId, Class<T> responseType) {
        rateLimiterService.checkLimit(installationId);

        String token = tokenManager.getInstallationToken(installationId);

        return webClient.get()
                .uri(uri)
                .header("Authorization", "Bearer " + token)
                .exchange()
                .flatMap(response -> {
                    String remaining = response.headers().header("X-RateLimit-Remaining").get(0);
                    rateLimiterService.updateLimit(installationId, remaining);

                    return response.bodyToMono(responseType);
                })
                .block();
    }
}