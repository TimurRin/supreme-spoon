# Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or create a pull request.

## Installation

We support [Devcontainers](https://containers.dev/). You can use the provided development container to work on this project. The development container includes all the necessary tools and dependencies to work on this project.

Otherwise, download, install and configure [Node.js](https://nodejs.org/en/download/).

If you're NOT using the devcontainer, ensure you have PostgreSQL connection set to `DATABASE_URL` environment variable.

Then, run the following commands:

```bash
npm ci
npm run build
npm run migration:up
npm start
```
