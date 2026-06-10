plugins {
    `java-library`
}

dependencies {
    testImplementation(project(":apps:api"))
    testRuntimeOnly(project(":apps:api"))
    api(project(":libs:domain"))
    implementation(project(":libs:common"))
    api("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.flywaydb:flyway-core")
    runtimeOnly("org.flywaydb:flyway-database-postgresql")
    testRuntimeOnly("org.flywaydb:flyway-database-postgresql")
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")


    implementation("org.springframework.boot:spring-boot-starter")
}


