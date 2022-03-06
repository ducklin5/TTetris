import api from "./api.js";

async function main() {
  api.listen(PORT, () =>
    console.log('QuickFileSytem server listening on port %d!', PORT),
  );
}

main();