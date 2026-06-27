package dev.cleat.scanning;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class WorkflowParserTest {

    private final WorkflowParser parser = new WorkflowParser();

    @Test
    void flagsUnpinnedActionsAndMissingOidc() {
        String yaml =
                """
                permissions:
                  contents: read

                jobs:
                  build:
                    runs-on: ubuntu-latest
                    steps:
                      - uses: actions/checkout@v3
                      - uses: actions/setup-java@v4
                """;

        WorkflowAnalysis result = parser.parse(".github/workflows/ci.yml", yaml);

        assertThat(result.unpinnedActions()).hasSize(2);
        assertThat(result.broadPermissions()).isFalse();
        assertThat(result.missingOidc()).isTrue();
        assertThat(result.riskScore()).isGreaterThan(0);
    }

    @Test
    void flagsBroadPermissions() {
        String yaml =
                """
                permissions: write-all

                jobs:
                  build:
                    runs-on: ubuntu-latest
                    steps:
                      - uses: actions/checkout@a81bbbf8298c0fa03ea29cdc473d45769f953675
                """;

        WorkflowAnalysis result = parser.parse(".github/workflows/ci.yml", yaml);

        assertThat(result.broadPermissions()).isTrue();
        assertThat(result.unpinnedActions()).isEmpty();
    }

    @Test
    void cleanWorkflowHasZeroScore() {
        String yaml =
                """
                permissions:
                  contents: read
                  id-token: write

                jobs:
                  build:
                    runs-on: ubuntu-latest
                    steps:
                      - uses: actions/checkout@a81bbbf8298c0fa03ea29cdc473d45769f953675
                """;

        WorkflowAnalysis result = parser.parse(".github/workflows/ci.yml", yaml);

        assertThat(result.unpinnedActions()).isEmpty();
        assertThat(result.broadPermissions()).isFalse();
        assertThat(result.missingOidc()).isFalse();
        assertThat(result.riskScore()).isZero();
    }

    @Test
    void emptyYamlReturnsZeroScore() {
        WorkflowAnalysis result = parser.parse(".github/workflows/empty.yml", "");

        assertThat(result.unpinnedActions()).isEmpty();
        assertThat(result.riskScore()).isEqualTo(20); // only missingOidc penalty
    }
}
