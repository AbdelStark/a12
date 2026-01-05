import { getManifestoHtml } from "@/lib/manifesto";

export default async function Home() {
  const html = await getManifestoHtml();

  return (
    <div className="shell">
      <section id="manifesto" className="manifesto">
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>
    </div>
  );
}
