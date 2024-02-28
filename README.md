# TicketFlow

![App](/.github/assets/ticketflow.gif)

This repository contains two folders with separate NodeJS applications: a NestJS REST API and a NextJS app. Additionally, there is a Docker Compose file to easily run both applications together in a containerized environment.

## Folder Structure

- `server/`: Contains the NestJS REST API.
- `client/`: Contains the NextJS application.
- `compose.yml`: Docker Compose configuration file to orchestrate the containers (client and server).

## Getting Started

### Prerequisites

Before you can run the applications using Docker Compose, make sure you have the following software installed:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)

### Running the Applications

Building images from source code.

First go to the "server" folder and rename the file ".env.example" to ".env". Then, execture this command:

```
docker compose -f compose.yaml up -d --build
```

This command will build and start the NestJS REST API and NextJS app in separate containers, exposing them on the specified ports, run a mongodb instance and seed the db.

Access the applications in your web browser:

- NestJS REST API: http://127.0.0.1:4000/api
- NextJS App: http://127.0.0.1:3000

You can use this connection string to connect to the db using MongoDB Compass: "mongodb://admin:password@127.0.0.1:27017/ticketflow?retryWrites=true&w=majority&appName=AtlasApp"

Then you can sign in with a any user in the database with the password: "password123456"


To stop the containers and remove the volume and images, run:

```
docker compose -f .\compose.yaml down --volumes
```
