Kanban board backend REST API with mongoDB datastore, built with Node.js and Express in TypeScript.

## Development

If you want to run it locally:

### Build

```sh
npm install -g typescript
```

### Set MONGODB_URI

Put the URI in a file named `.env` in the root of the project

An example URI looks like this: (you can substitute `<user>`, `<pass>` and `cluster0.mec48.mongodb.net` with your own (*)):

`mongodb+srv://<user>:<pass>@cluster0.mec48.mongodb.net/kanban_board?retryWrites=true&w=majority`

(*) You can create a cloud mongodb account in the free tier and use it.

### Run

```sh
npm run start
```

In dev (debug log and monitor file changes):

```sh
npm run debug
```

### Build with docker

```sh
docker build -t kanban-board-backend .
```

### Run with docker

If you want to run it locally with docker:

```sh
docker run -p 8080:8080 -e MONGODB_URI="mongodb+srv://<user>:<pass>@cluster0.mec48.mongodb.net/kanban_board?retryWrites=true&w=majority" kanban-board-backend
```
Again, substitute the URI with your own

I already pushed the image to Docker Hub:
https://hub.docker.com/repository/docker/perrybird/kanban-board-backend


Once the server is running, navigate to http://localhost:8080 to call the app.

#### Notes
You can replace port 8080 with some other port number by setting PORT in `.env`
