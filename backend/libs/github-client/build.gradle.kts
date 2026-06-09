plugins {
    `java-library`
}

dependencies {
    implementation(project(":libs:common"))

    api("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
