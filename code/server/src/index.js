import server from "./server.js";

async function main() {
  const port = process.env.PORT || 8080;
  server.listen(port, () =>
    console.log('Server listening on port %d!', port),
  );
}

main();