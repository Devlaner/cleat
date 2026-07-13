package dev.cleat.enrichment.dto;

public class OsvPackage {

    private String name;
    private String ecosystem;

    public String getName() {
        return name;
    }

    public OsvPackage setName(String name) {
        this.name = name;
        return this;
    }

    public String getEcosystem() {
        return ecosystem;
    }

    public OsvPackage setEcosystem(String ecosystem) {
        this.ecosystem = ecosystem;
        return this;
    }
}
