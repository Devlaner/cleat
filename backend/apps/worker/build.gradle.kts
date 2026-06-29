plugins {
    id("org.springframework.boot")
}

dependencies {
    implementation(project(":libs:common"))
    implementation(project(":libs:domain"))
    implementation(project(":libs:persistence"))
    implementation(project(":libs:github-client"))
    implementation(project(":libs:enrichment"))
    implementation(project(":libs:scanning"))

    implementation("org.springframework.boot:spring-boot-starter")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
          testImplementation("org.testcontainers:junit-jupiter")
          testImplementation("org.testcontainers:postgresql")
          testImplementation("org.testcontainers:testcontainers")
          testImplementation("org.springframework.boot:spring-boot-testcontainers")
          testImplementation("com.h2database:h2")
}
