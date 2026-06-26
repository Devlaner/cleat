package dev.cleat.scanning;

import java.util.List;

public record WorkflowAnalysis(
        String workflowPath,
        List<String> unpinnedActions,
        boolean broadPermissions,
        boolean missingOidc,
        int riskScore) {}
