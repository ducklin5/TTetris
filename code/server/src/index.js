import server from "./server.js";

async function main() {
  server.listen(8080, () =>
    console.log('Server listening on port %d!', 8080),
  );
}

main();