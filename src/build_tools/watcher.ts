const path = "./src"; // Relative to repo root
const watcher = Deno.watchFs(path);

const command = Deno.args[0];

let canRun = false;

await run();

const pathMessage = `👀 Watching ${path} for changes... 👀`;
console.log(pathMessage);

setTimeout(() => {
  canRun = true;
}, 2000);

for await (const _event of watcher) {
  // NOTE: Uncomment this if we need to look at events
  // _debug(_event);

  if (canRun) {
    canRun = false;
    await run();
    // We need to prevent subsequent tasks from running. For some reason,
    // 3 events seems to trigger every time I save
    setTimeout(() => {
      canRun = true;
      console.log(pathMessage);
    }, 1000);
  }
}

async function run() {
  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  const process = Deno.run({ cmd: command.split(" ") });
  const status = await process.status();
  const { success } = status;
  if (!success) {
    console.error("🔴 ERROR 🔴");
  } else {
    console.log("✅ SUCCESS ✅");
  }
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
}

function _debug(event: Deno.FsEvent) {
  console.log(">>>> File system event");
  console.log(event);
  // Example event: { kind: "create", paths: [ "/home/alice/deno/foo.txt" ] }
}
