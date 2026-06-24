package dev.cleat.githubclient.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.ExchangeFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
class GitHubClientTest {

    @Mock
    private TokenManager tokenManager;

    @Mock
    private RateLimiterService rateLimiterService;

    private GitHubClient gitHubClient;

    @BeforeEach
    void setUp() {
        ExchangeFunction exchangeFunction = request -> {
            if (request.headers().getFirst("Authorization") == null
                    || !request.headers().getFirst("Authorization").startsWith("Bearer ")) {
                return Mono.just(ClientResponse.create(HttpStatus.UNAUTHORIZED).build());
            }

            return Mono.just(ClientResponse.create(HttpStatus.OK)
                    .header("X-RateLimit-Remaining", "4999")
                    .header("X-RateLimit-Reset", "1767272800")
                    .body("{\"name\": \"test\"}")
                    .build());
        };

        WebClient webClient =
                WebClient.builder().exchangeFunction(exchangeFunction).build();

        gitHubClient = new GitHubClient(webClient, tokenManager, rateLimiterService);
    }

    @Test
    void getSendsBearerTokenAndUpdatesRateLimit() {
        String installationId = "123";
        String fakeToken = "fake-token";

        when(tokenManager.getInstallationToken(installationId)).thenReturn(fakeToken);

        String response = gitHubClient.get("/test", installationId, String.class);

        verify(rateLimiterService).checkLimit(installationId);
        assertEquals("{\"name\": \"test\"}", response);
        verify(rateLimiterService).updateLimit(eq(installationId), eq("4999"), eq("1767272800"));
    }
}
