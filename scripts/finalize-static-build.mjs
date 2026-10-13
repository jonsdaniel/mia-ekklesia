import { cp, copyFile, mkdir, rm } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const clientOutput = new URL("dist/client/", projectRoot);

await rm(clientOutput, { recursive: true, force: true });
await mkdir(clientOutput, { recursive: true });
await cp(new URL("site/", projectRoot), clientOutput, { recursive: true });
await rm(new URL("_article.html", clientOutput), { force: true });
await rm(new URL(".openai/", clientOutput), { recursive: true, force: true });
await mkdir(new URL("dist/.openai/", projectRoot), { recursive: true });
await copyFile(new URL(".openai/hosting.json", projectRoot), new URL("dist/.openai/hosting.json", projectRoot));

console.log("Copied the complete static site into the deployment output.");
