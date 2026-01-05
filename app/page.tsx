import { getManifestoHtml } from "@/lib/manifesto";

const repoUrl = process.env.NEXT_PUBLIC_REPO_URL || "https://github.com/agentic-twelve/a12";

export default async function Home() {
  const html = await getManifestoHtml();

  return (
    <div className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Manifesto</p>
          <h2>The Agentic Twelve</h2>
          <p className="lede">
            A modern standard for building robust, scalable, and safe agent-native applications—rendered directly from a single Markdown source of truth.
          </p>
          <div className="actions">
            <a className="pill" href="#manifesto">Read the manifesto</a>
            <a className="pill pill--ghost" href={repoUrl} target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      <section id="manifesto" className="manifesto">
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>

      <section className="download">
        <div className="panel">
          <div>
            <h3>Prefer the raw Markdown?</h3>
            <p className="muted">
              The site and the repository share the exact same source file, so edits stay in sync.
            </p>
          </div>
          <a className="pill" href={repoUrl} target="_blank" rel="noreferrer">
            Access the Markdown
          </a>
        </div>
      </section>

      <section className="toc">
        <h3>Quick navigation</h3>
        <ul className="pill-list">
          <li><a href="#introduction-from-imperative-to-intent">Introduction</a></li>
          <li><a href="#the-nomenclature">The Nomenclature</a></li>
          <li><a href="#the-twelve-factors">The Twelve Factors</a></li>
          <li><a href="#the-checklist">The Checklist</a></li>
          <li><a href="#conclusion-the-agent-native-future">Conclusion</a></li>
        </ul>
      </section>
    </div>
  );
}
