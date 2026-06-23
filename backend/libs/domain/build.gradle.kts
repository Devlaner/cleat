plugins {
    `java-library`
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    implementation(project(":libs:persistence"))
    implementation(project(":libs:common"))
}
