var fsExtra = require("fs-extra");
var cp = require("child_process");


console.log("\x1b[35m***BUILD***\x1b[0m");

console.log("Cleaning...");
fsExtra.emptyDirSync("dist");

console.log("Building...");
cp.execSync("node node_modules/typescript/bin/tsc");

console.log("\x1b[35m***BUILD COMPLETE***\x1b[0m");