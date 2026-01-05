import fs from "node:fs/promises";
import path from "node:path";
import { remark } from "remark";
import html from "remark-html";
import slug from "remark-slug";
import gfm from "remark-gfm";

const SOURCE_FILE = "README.md";

export async function getManifestoHtml() {
  const sourcePath = path.join(process.cwd(), SOURCE_FILE);
  const markdown = await fs.readFile(sourcePath, "utf8");
  const processed = await remark()
    .use(gfm)
    .use(slug)
    .use(html, { sanitize: false })
    .process(markdown);
  return processed.toString();
}

export async function getManifestoMarkdown() {
  const sourcePath = path.join(process.cwd(), SOURCE_FILE);
  return fs.readFile(sourcePath, "utf8");
}
