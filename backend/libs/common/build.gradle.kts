plugins {
    `java-library`
}

dependencies {
    api("org.springframework.boot:spring-boot-starter")
    api("org.springframework.boot:spring-boot-starter-validation")
    implementation(project(":libs:persistence"))
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
