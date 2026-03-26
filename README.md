- [1. PollAssignment](#1-pollassignment)
  - [1.1. Development server](#11-development-server)
- [2. 🛠️ Stack](#2-️-stack)
- [3. 🛢️ Database](#3-️-database)
  - [3.1. 🗺️ Schema](#31-️-schema)
  - [3.2. 🗃️ Entities](#32-️-entities)
    - [3.2.1. 🎭 Role](#321--role)
    - [3.2.2. 👤 User](#322--user)
    - [3.2.3. 📝 Poll](#323--poll)
    - [3.2.4. ❓ Question](#324--question)
    - [3.2.5. 💬 Answer](#325--answer)
  - [3.3. Building](#33-building)
  - [3.4. Running unit tests](#34-running-unit-tests)
  - [3.5. Running end-to-end tests](#35-running-end-to-end-tests)
  - [3.6. Additional Resources](#36-additional-resources)


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

## 3.2. 🗃️ Entities

There are 5 entities :

### 3.2.1. 🎭 Role
- 🗝️ id: number;
- label: string;

### 3.2.2. 👤 User
- 🗝️ id: number;
- name: string;
- 🗝️👽 roleid: number;

### 3.2.3. 📝 Poll
- 🗝️ id: number;
- title: string;
- 🗝️👽 userid: number;

### 3.2.4. ❓ Question
- 🗝️ id: number;
- title: string;
- 🗝️👽 pollid: number;

### 3.2.5. 💬 Answer
- 🗝️ id: number; 
- vote: boolean; 
- timestamp: Date; 
- 🗝️👽 questionid: number; 
- 🗝️👽 userid: number;

## 3.3. Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 3.4. Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## 3.5. Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## 3.6. Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
