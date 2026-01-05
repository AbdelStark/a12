import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const repoUrl = process.env.NEXT_PUBLIC_REPO_URL || "https://github.com/agentic-twelve/a12";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || repoUrl;

export const metadata: Metadata = {
  title: "The Agentic Twelve Manifesto",
  description:
    "A minimal, elegant manifesto site rendered directly from the single Markdown source of truth.",
  openGraph: {
    title: "The Agentic Twelve Manifesto",
    description:
      "A minimal, elegant manifesto site rendered directly from the single Markdown source of truth.",
    url: siteUrl,
    siteName: "The Agentic Twelve",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="top-bar">
          <div className="top-bar__content">
            <div>
              <p className="eyebrow">Manifesto</p>
              <h1 className="site-title">The Agentic Twelve</h1>
            </div>
            <a className="pill" href={repoUrl} target="_blank" rel="noreferrer">
              View the repo
            </a>
          </div>
        </header>
        <main className="page">
          {children}
        </main>
        <footer className="footer">
          <div className="footer__content">
            <p>Built for the agent-native era.</p>
            <a href={repoUrl} target="_blank" rel="noreferrer">
              GitHub repository
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
