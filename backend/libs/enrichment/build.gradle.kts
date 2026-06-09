plugins {
    `java-library`
}

dependencies {
    api(project(":libs:domain"))
    implementation(project(":libs:common"))
    implementation(project(":libs:persistence"))

    implementation("org.springframework.boot:spring-boot-starter-web")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
