package dev.cleat.scanning;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

import dev.cleat.common.enums.Severity;
import dev.cleat.common.enums.Status;
import dev.cleat.persistence.entity.CodeScanAlertEntity;
import dev.cleat.persistence.repository.CodeScanAlertRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class CodeScanAlertScannerTest {

    @InjectMocks
    CodeScanAlertScanner codeScanAlertScanner;

    @Mock
    CodeScanAlertRepository codeScanAlertRepository;

    @Test
    void whenProcessAlert_thenStatusShouldBeOpen() {

        // given
        CodeScanAlertEntity codeScanAlertEntity = new CodeScanAlertEntity().setSeverity(Severity.CRITICAL);

        // when
        codeScanAlertScanner.process(codeScanAlertEntity);

        // then
        Assertions.assertEquals(Status.OPEN, codeScanAlertEntity.getStatus());
        verify(codeScanAlertRepository).save(any());
    }
}
