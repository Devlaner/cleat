package dev.cleat.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.cleat.api.controller.CodeScanAlertController;
import dev.cleat.common.dto.request.CodeScanAlertRequestDto;
import dev.cleat.scanning.service.CodeScanAlertService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CodeScanAlertController.class)
@AutoConfigureMockMvc(addFilters = false)
@ContextConfiguration(classes = CodeScanAlertController.class)
public class CodeScanAlertControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CodeScanAlertService codeScanAlertService;

    @Test
    void whenCreateCodeScanAlertThenShouldBeReturn201() throws Exception {

        // given
        CodeScanAlertRequestDto codeScanAlertRequestDto = new CodeScanAlertRequestDto();

        // then
        mockMvc.perform(post("/api/v1/alerts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(codeScanAlertRequestDto)))
                .andExpect(status().isCreated());
    }
}
