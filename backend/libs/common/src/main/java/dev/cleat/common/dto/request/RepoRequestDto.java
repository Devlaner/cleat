package dev.cleat.common.dto.request;

import dev.cleat.common.enums.Visibility;
import java.util.List;

public class RepoRequestDto {
    private String name;
    private Visibility visibility;
    private String language;
    private String defaultBranch;
    private List<String> topics;

    public RepoRequestDto() {}

    public RepoRequestDto(
            String name, Visibility visibility, String language, String defaultBranch, List<String> topics) {
        this.name = name;
        this.visibility = visibility;
        this.language = language;
        this.defaultBranch = defaultBranch;
        this.topics = topics;
    }

    public String getName() {
        return name;
    }

    public RepoRequestDto setName(String name) {
        this.name = name;
        return this;
    }

    public Visibility getVisibility() {
        return visibility;
    }

    public RepoRequestDto setVisibility(Visibility visibility) {
        this.visibility = visibility;
        return this;
    }

    public String getLanguage() {
        return language;
    }

    public RepoRequestDto setLanguage(String language) {
        this.language = language;
        return this;
    }

    public String getDefaultBranch() {
        return defaultBranch;
    }

    public RepoRequestDto setDefaultBranch(String defaultBranch) {
        this.defaultBranch = defaultBranch;
        return this;
    }

    public List<String> getTopics() {
        return topics;
    }

    public RepoRequestDto setTopics(List<String> topics) {
        this.topics = topics;
        return this;
    }
}
