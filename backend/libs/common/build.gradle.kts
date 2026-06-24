

plugins {
    `java-library`
}

dependencies {

    api("org.springframework.boot:spring-boot-starter")
    api("org.springframework.boot:spring-boot-starter-validation")
    api("com.fasterxml.jackson.core:jackson-annotations")
    api("jakarta.persistence:jakarta.persistence-api")
    api("org.springframework:spring-web")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
