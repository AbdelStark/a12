import fs from "node:fs/promises";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

const SOURCE_FILE = "README.md";

export async function getManifestoHtml() {
  const sourcePath = path.join(process.cwd(), SOURCE_FILE);
  const markdown = await fs.readFile(sourcePath, "utf8");
  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  return processed.toString();
}

export async function getManifestoMarkdown() {
  const sourcePath = path.join(process.cwd(), SOURCE_FILE);
  return fs.readFile(sourcePath, "utf8");
}
