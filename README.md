# Next frourio Starter

A monorepo service enabling full-stack development with TypeScript, constructed using [Next.js](https://nextjs.org/) in the `src` directory for the frontend and [frourio](https://frourio.com/) in the `server` directory for the backend.

Latest Commit Demo - <https://solufa.github.io/next-frourio-starter/>

## Development Procedure

### Node.js Installation

Install directly on your local machine.

Download and install the LTS version from <https://nodejs.org/en/> (left button).

### Clone the Repository and Install npm Modules

There are `package.json` files in the root, front-end, and back-end, so you need to install three times.

```sh
npm i
npm i --prefix client
npm i --prefix server
```

```sh
yarn
yarn --cwd client
yarn --cwd server
```

### Creating Environment Variable Files

```sh
cp client/.env.example client/.env
cp server/.env.example server/.env
cp docker/dev/.env.example docker/dev/.env
cp server/prisma/.env.example server/prisma/.env
```

### Middleware Setup

```sh
docker compose up -d
```

### Starting the Development Server

For subsequent development sessions, the following command is sufficient:

```sh
npm run notios
```

```sh
yarn notios
```

Open <http://localhost:3000> in a web browser.

Terminal display during development is managed by [notios](https://github.com/frouriojs/notios).

[New CLI Tool notios for Uncluttering Terminal Logs in Node.js Monorepo Development](https://zenn.dev/luma/articles/nodejs-new-cli-tool-notios)

To close, press `Ctrl + C` twice in succession.

#### Firebase Emulator

<http://localhost:4000/auth>

#### MinIO Console

<http://localhost:9001/>

#### PostgreSQL UI

```sh
$ cd server
$ npx prisma studio
```
