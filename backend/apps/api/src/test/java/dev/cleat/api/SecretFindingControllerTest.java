package dev.cleat.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.cleat.api.controller.SecretFindingController;
import dev.cleat.common.dto.request.SecretFindingRequestDto;
import dev.cleat.scanning.service.SecretFindingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(SecretFindingController.class)
@AutoConfigureMockMvc(addFilters = false)
@ContextConfiguration(classes = {SecretFindingController.class})
public class SecretFindingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SecretFindingService secretFindingService;

    @Test
    void whenCreateSecretThenShouldReturn201() throws Exception {

        // given
        SecretFindingRequestDto secretFindingRequestDto = new SecretFindingRequestDto();

        // then
        mockMvc.perform(post("/api/v1/secrets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(secretFindingRequestDto)))
                .andExpect(status().isCreated());
    }
}
