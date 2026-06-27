plugins {
    `java-library`
}

dependencies {
    api(project(":libs:domain"))
    implementation(project(":libs:common"))
    implementation(project(":libs:persistence"))
    implementation(project(":libs:github-client"))

    implementation("org.springframework.boot:spring-boot-starter")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    implementation("org.yaml:snakeyaml")

        testImplementation("org.testcontainers:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

}
