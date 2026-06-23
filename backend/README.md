# Cleat backend

Java and Spring Boot, set up as a Gradle multi-module project. The structure is
in place; the application code is not written yet.

## Layout

```
backend/
  settings.gradle.kts        registers every module
  build.gradle.kts           shared config: Java 21, Spring Boot BOM, common plugins
  apps/
    api/                     deployable: REST read path + webhook receiver (fast)
    worker/                  deployable: queue consumers, scheduled scans, enrichment
  libs/
    common/                  config, observability, errors, shared DTOs
    domain/                  entities + business logic (vulnPriority, posture, hygiene)
    persistence/             JPA, repositories, Flyway migrations
    github-client/           GitHub App client: token manager + rate limiter
    enrichment/              EPSS / KEV / OSV / SPDX feeds + scoring
    scanning/                scan orchestration + per-domain workers
```

Two deployables, one codebase. `api` serves the frontend and accepts webhooks;
`worker` does the slow work so the api stays responsive. Both depend on the same
`libs/*`, so logic is shared rather than duplicated. Any library can be promoted
to its own deployable later if it needs to scale on its own.

## How modules connect

`settings.gradle.kts` includes each module, and an app pulls in a library with a
Gradle project dependency in its `build.gradle.kts`:

```kotlin
dependencies {
    implementation(project(":libs:domain"))
    implementation(project(":libs:persistence"))
}
```

Then import in Java as usual. Each module's package root is `dev.cleat.<module>`,
for example `dev.cleat.domain` and `dev.cleat.githubclient`.

## First steps when you start coding

1. Generate the Gradle wrapper once: `gradle wrapper --gradle-version 8.10`.
2. Add a `@SpringBootApplication` main class to `apps/api` and `apps/worker`.
3. Make the api return the shapes the frontend already uses
   (`apps/web/src/data/types.ts`) so it can switch from dummy data to live data
   with no UI change.

## Build (once the wrapper and a main class exist)

```bash
./gradlew :apps:api:bootRun        # run the api
./gradlew :apps:worker:bootRun     # run the worker
./gradlew build                    # build and test everything
```

Local dependencies (Postgres, Redis) are expected to run via Docker Compose. The
two services build into one container image each.


## Frontend–Backend Data Contract

The following rules apply to data exchange between the Frontend (`apps/web/src/data/types.ts`) and the 
Backend:

1. Field Mapping: All fields in Backend DTOs (e.g., `repoCount`, `postureScore`) follow the same camelCase
   naming convention as the Frontend interfaces.

2. Enum Synchronization: Enums such as `AccountType`, `Plan`, and `Severity` are serialized using 
   `@JsonValue` to the lowercase values expected by the Frontend (e.g., `user`, `critical`).

3. ISO Dates: Date fields (e.g., `lastPushedAt`, `detectedAt`) use the `OffsetDateTime` type and are 
   serialized to JSON as ISO-8601 formatted strings.

4. Data Container: The Frontend `Dataset` type is backed by `DatasetDto`. To switch from mock data 
   to real data, requests should be sent to the `/api/dashboard/dataset` endpoint.
