plugins {
    `java-library`
}

dependencies {
    api(project(":libs:domain"))
    implementation(project(":libs:common"))

    api("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    testImplementation("org.testcontainers:junit-jupiter")
    runtimeOnly("org.postgresql:postgresql")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
