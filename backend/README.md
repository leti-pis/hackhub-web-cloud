# HackHub Backend

Spring Boot backend for HackHub, a platform that manages hackathons, teams, staff assignments, registrations, submissions, evaluations, requests, and notifications.

The backend exposes REST APIs under `/api`. The Angular application in `../frontend` is a separate client and reaches these APIs through its development proxy.

## Technologies

- Java 21
- Spring Boot 4.0.2 and Spring Web
- Spring Security with a custom JWT bearer filter
- JJWT 0.12.7
- Spring Data JPA and Hibernate
- Jakarta Bean Validation
- MySQL 8
- Gradle Wrapper
- Docker Compose for the MySQL development database
- JUnit 5, Spring Test, MockMvc, Spring Security Test, and an isolated in-memory H2 test database

## Requirements

- JDK 21
- Docker and Docker Compose, unless a compatible MySQL instance is already available

The Gradle installation is not required because the repository includes the Gradle Wrapper.

## Project structure

```text
backend/
  src/main/java/unicam/cs/hackhub/
    boundary/       REST controllers and API DTOs
    handler/        application use cases and transaction boundaries
    domain/         domain entities, roles, and hackathon states
    repository/     Spring Data JPA repositories
    servizi/        JWT, notifications, scheduling, and external-service abstractions
  src/main/resources/
    application.properties
  src/test/java/
    unicam/cs/hackhub/
  docker-compose.yml
  .env.example
  build.gradle
```

## Environment configuration

`src/main/resources/application.properties` is the single Spring configuration source committed for the backend. It optionally imports a local `backend/.env` file:

```properties
spring.config.import=optional:file:.env[.properties]
```

Create a local file from the example before running the application:

```powershell
Copy-Item .env.example .env
```

Do not commit `.env`. It is ignored by Git and must contain environment-specific credentials and secrets.

| Variable | Purpose | Example/default |
|---|---|---|
| `MYSQL_DATABASE` | Database created by Docker Compose | `hackhub` |
| `MYSQL_USER` | MySQL application user created by Docker Compose | `hackhub` |
| `MYSQL_PASSWORD` | Password for the MySQL application user | no secure default |
| `MYSQL_ROOT_PASSWORD` | MySQL root password | no secure default |
| `MYSQL_PORT` | MySQL port exposed on the host | `3306` |
| `DB_HOST` | MySQL host used by Spring Boot | `localhost` |
| `DB_PORT` | MySQL port used by Spring Boot | `3306` |
| `DB_NAME` | Database used by Spring Boot | `hackhub` |
| `DB_USERNAME` | Database username used by Spring Boot | `hackhub` |
| `DB_PASSWORD` | Database password used by Spring Boot | no secure default |
| `SERVER_PORT` | Backend HTTP port | `8080` |
| `APP_JWT_SECRET` | HMAC signing secret; use at least 32 random characters | required |
| `APP_JWT_EXPIRATION_MS` | JWT lifetime in milliseconds | `3600000` |

`SERVER_PORT` can be omitted because `application.properties` defaults to `8080`. It is included in `.env.example` so the effective port remains explicit.

## Database and persistence

Start the development MySQL database from `backend/`:

```powershell
docker compose up -d
```

Docker Compose starts only MySQL 8 and stores its data in the named volume `hackhub_mysql_data`. It does not containerize the backend or frontend.

The effective JPA settings are:

```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
```

Hibernate therefore updates the schema during startup. The project does not currently include versioned Flyway or Liquibase migrations.

## Running the backend

From `backend/`, after configuring the environment and starting MySQL:

```powershell
.\gradlew.bat bootRun
```

The default API base URL is:

```text
http://localhost:8080/api
```

The Angular development proxy currently targets `http://192.168.117.129:8080`. This is a private-network address for the machine that hosts the backend in that development setup; it is not evidence of a public or cloud deployment. If Angular and Spring Boot run on different machines, the machine at that address must run the backend on port `8080` and be reachable from the frontend development machine.

## Main API groups

- `/api/autenticazione`: registration and login
- `/api/hackathon`: public listing/details, creation, team registration, and hackathon management
- `/api/team`: team creation, membership, invitations, leadership, and the current user's team
- `/api/sottomissioni`: submission and evaluation operations
- `/api/richieste`: acceptance and rejection of pending requests
- `/api/notifiche`: user notifications
- `/api/call`, `/api/assistenza`, and `/api/richieste-supporto`: mentor/team support flows

The frontend currently uses these contracts:

- `POST /api/autenticazione/registrazione` returns `201 Created` with `{ token, tipo, nomeUtente }`.
- `POST /api/autenticazione/accesso` returns `200 OK` with `{ token, tipo, nomeUtente }`.
- `GET /api/hackathon` returns the public hackathon list.
- `GET /api/hackathon/{id}` returns one public hackathon by ID.
- `POST /api/hackathon` returns `200 OK` with the complete hackathon representation expected by the Angular `Hackathon` model.
- `POST /api/hackathon/{nomeHackathon}/iscrizioni` returns `204 No Content`.
- `GET /api/team/mio` returns `{ nomeTeam, nomeLeader, nomiMembri }`.
- `GET /api/team/iscrizioni` returns the IDs of the hackathons associated with the current team.

API errors are returned as JSON:

```json
{
  "message": "Error description"
}
```

Application exceptions are centrally mapped to the appropriate `400`, `403`, `404`, `409`, or `500` HTTP status.

## Authentication and security

Registration stores passwords using BCrypt. Login and registration return a signed JWT with the username as subject and a configured expiration time.

Send the token to protected endpoints with:

```http
Authorization: Bearer <token>
```

The following endpoints are public:

- `/api/autenticazione/**`
- `GET /api/hackathon`
- `GET /api/hackathon/{id}`

All other requests require authentication. The JWT contains no role claims. Team and hackathon permissions are checked in the application handlers against persisted domain roles such as team leader, organizer, mentor, and judge.

## Hackathon scheduler

Scheduling is enabled with `@EnableScheduling`. `SchedulerHackathon` runs every 60 seconds and invokes the existing temporal-event handler, which:

- closes expired registration windows;
- starts eligible hackathons;
- moves completed events into the evaluation phase.

The scheduler uses the same database and domain state rules as the REST use cases.

## External services

Calendar and payment are represented by interfaces, but the current handlers use `CalendarioMock` and `SistemaDiPagamentoMock`. They are simulations, not integrations with real external providers.

## Build and tests

Compile and package the backend:

```powershell
.\gradlew.bat build
```

Run the backend test suite:

```powershell
.\gradlew.bat test
```

Tests use the dedicated configuration in `src/test/resources/application.properties` and an in-memory H2 database in MySQL compatibility mode. They do not connect to or truncate the development MySQL database. Test reports are generated under `build/reports/tests/test/`.

## Current Docker and deployment status

Only MySQL is containerized. There are no backend or frontend Dockerfiles, no full application Compose stack, no CI/CD workflow, and no committed cloud-provider deployment configuration. The repository therefore supports local or private-network development but does not yet define a complete production deployment.
