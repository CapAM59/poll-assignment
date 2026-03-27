- [1. PollAssignment](#1-pollassignment)
  - [1.1. Development server](#11-development-server)
- [2. 🛠️ Stack](#2-️-stack)
- [3. 🛢️ Database](#3-️-database)
  - [3.1. 🗺️ Schema](#31-️-schema)
  - [3.2. 🌱 Seed Initialization](#32--seed-initialization)
    - [How It Works](#how-it-works)
    - [Implementation Details](#implementation-details)
  - [3.3. 🗃️ Entities](#33-️-entities)
    - [3.3.1. 🎭 Role](#331--role)
    - [3.3.2. 👤 User](#332--user)
    - [3.3.3. 📝 Poll](#333--poll)
    - [3.3.4. ❓ Question](#334--question)
    - [3.3.5. 💬 Answer](#335--answer)
  - [3.4. Building](#34-building)
  - [3.5. Running unit tests](#35-running-unit-tests)
  - [3.6. Running end-to-end tests](#36-running-end-to-end-tests)
  - [3.7. Additional Resources](#37-additional-resources)


# 1. PollAssignment

***Design your poll and let users answer it.***

PollAssignment is a local‑first polling application.

## 1.1. Development server

To start a local development server of PollAssigmnent, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to :
- `http://localhost:4200/`

The application will automatically reload whenever you modify any of the source files.

# 2. 🛠️ Stack

- Angular v^19.2.0 : https://v19.angular.dev/overview
- PrimeNG v^19.1.4 : https://www.npmjs.com/package/primeng and https://v19.primeng.org/
- idb v^8.0.3 : https://www.npmjs.com/package/idb

# 3. 🛢️ Database

## 3.1. 🗺️ Schema

Database is stored in IndexedDB thanks to **idb wrapper**. Here its schema:

![databaseSchema](public/documentation/assets/databaseSchema.webp)

## 3.2. 🌱 Seed Initialization

When the application starts, a **seed service** automatically initializes the database with default roles if they don't already exist. This ensures the database is always in a valid state for the application to operate.

### How It Works

1. **Idempotent Initialization**: The seed runs only once per unique role. If a role with the same label already exists in the database, it is skipped.

2. **Default Roles**: Two default roles are automatically created on first run:
   - **Admin**: Administrator role with full permissions
   - **User**: Standard user role with limited permissions

3. **Startup Integration**: The seed is executed during Angular application bootstrap via `provideAppInitializer()`. This ensures all required data exists before any component interacts with the database.

4. **Error Handling**: If role creation fails, the error is logged but does not prevent the application from starting. Users can manually reseed the database if needed.

### Implementation Details

- **Service**: [`src/app/db/seed/seed.service.ts`](src/app/db/seed/seed.service.ts)
- **Seed Data**: [`src/app/db/seed/default-roles.seed.ts`](src/app/db/seed/default-roles.seed.ts)
- **Configuration**: Integrated in [`src/app/app.config.ts`](src/app/app.config.ts)
- **Tests**: Comprehensive unit tests in [`src/app/db/seed/seed.service.spec.ts`](src/app/db/seed/seed.service.spec.ts)

## 3.3. 🗃️ Entities

There are 5 entities :

### 3.3.1. 🎭 Role
- 🗝️ id: number;
- label: string;

### 3.3.2. 👤 User
- 🗝️ id: number;
- name: string;
- 🗝️👽 roleid: number;

### 3.3.3. 📝 Poll
- 🗝️ id: number;
- title: string;
- 🗝️👽 userid: number;

### 3.3.4. ❓ Question
- 🗝️ id: number;
- title: string;
- 🗝️👽 pollid: number;

### 3.3.5. 💬 Answer
- 🗝️ id: number; 
- vote: boolean; 
- timestamp: Date; 
- 🗝️👽 questionid: number; 
- 🗝️👽 userid: number;

## 3.4. Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 3.5. Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## 3.6. Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## 3.7. Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
