package dev.cleat.enrichment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OsvRequest {
    @JsonProperty("package")
    private OsvPackage pkg;

    public OsvPackage getPkg() {
        return pkg;
    }

    public OsvRequest setPkg(OsvPackage pkg) {
        this.pkg = pkg;
        return this;
    }
}
