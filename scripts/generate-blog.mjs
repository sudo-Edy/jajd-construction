/**
 * Static blog generator — runs after `vite build`.
 *
 * Turns blog/posts.mjs into real, crawlable HTML at dist/blog/<slug>/index.html
 * plus a dist/blog/index.html index, and rewrites dist/sitemap.xml to include
 * the homepage and every post. These are plain static pages (no JS needed to
 * read the content), which is exactly what search engines index well — the fix
 * for a client-rendered SPA's thin HTML.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { POSTS } from '../blog/posts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');

const SITE = {
  domain: 'https://jajdconstruction.com',
  name: 'JAJD Construction',
  phone: '(380) 239-5307',
  phoneRaw: '3802395307',
  email: 'jajdconstruction@gmail.com',
  logoWord: 'JAJD',
  city: 'Omaha, Nebraska',
};

/* ----------------------------- small helpers ------------------------------ */
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// JSON-LD: only need to neutralize the closing-script sequence.
const ldSafe = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

const fmtDate = (iso) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

/* --------------------------- block → HTML renderer ------------------------ */
function renderBlocks(blocks) {
  const out = [];
  for (const block of blocks) {
    const [type, a, b] = block;
    switch (type) {
      case 'h2': out.push(`<h2>${esc(a)}</h2>`); break;
      case 'h3': out.push(`<h3>${esc(a)}</h3>`); break;
      case 'p': out.push(`<p>${a}</p>`); break; // light inline HTML allowed by author
      case 'ul': out.push(`<ul>${a.map((i) => `<li>${i}</li>`).join('')}</ul>`); break;
      case 'ol': out.push(`<ol>${a.map((i) => `<li>${i}</li>`).join('')}</ol>`); break;
      case 'quote': out.push(`<blockquote>${esc(a)}</blockquote>`); break;
      case 'cta':
        out.push(`
          <aside class="cta">
            <h3>${esc(a)}</h3>
            <div class="cta-actions">
              <a class="btn btn-gold" href="/#projects">${esc(b)}</a>
              <a class="btn btn-ghost" href="tel:${SITE.phoneRaw}">Call ${esc(SITE.phone)}</a>
            </div>
          </aside>`);
        break;
      default: break;
    }
  }
  return out.join('\n');
}

/* -------------------------------- styling --------------------------------- */
const STYLES = `
  :root{--navy:#0b1220;--gold:#cf9a26;--gold-600:#8f6115;--ink:#0f172a;--muted:#475569;--line:#e7e5e4;--bg:#ffffff}
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;color:var(--ink);background:var(--bg);line-height:1.7}
  h1,h2,h3,h4{font-family:Archivo,Inter,system-ui,sans-serif;letter-spacing:-.02em;line-height:1.2;color:var(--navy)}
  a{color:var(--gold-600);text-decoration:none}
  a:hover{text-decoration:underline}
  img{max-width:100%;height:auto;display:block}
  .wrap{max-width:760px;margin:0 auto;padding:0 20px}
  .wide{max-width:1100px}
  header.site{background:var(--navy);color:#fff;position:sticky;top:0;z-index:10}
  header.site .row{display:flex;align-items:center;justify-content:space-between;padding:14px 0}
  .brand{display:flex;align-items:center;gap:10px;color:#fff;font-weight:800;font-family:Archivo,sans-serif;font-size:18px}
  .brand .mark{background:var(--gold);color:var(--navy);width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900}
  .brand .mark + span span{color:var(--gold)}
  .nav-cta{display:inline-flex;align-items:center;gap:8px;background:var(--gold);color:var(--navy);font-weight:700;font-size:14px;padding:9px 16px;border-radius:9px}
  .nav-cta:hover{text-decoration:none;background:#fff}
  .crumbs{font-size:13px;color:var(--muted);padding:18px 0 0}
  .crumbs a{color:var(--muted)}
  .eyebrow{color:var(--gold-600);font-weight:800;font-size:12px;letter-spacing:.16em;text-transform:uppercase}
  article h1{font-size:clamp(28px,5vw,44px);margin:.4em 0 .3em}
  .meta{color:var(--muted);font-size:14px;font-weight:600;margin-bottom:24px}
  .hero{border-radius:16px;overflow:hidden;margin:8px 0 28px;border:1px solid var(--line)}
  .hero img{width:100%;height:auto;object-fit:cover}
  article p,article ul,article ol{font-size:17px;color:#1f2937}
  article h2{font-size:26px;margin:1.6em 0 .5em}
  article h3{font-size:20px;margin:1.4em 0 .4em}
  blockquote{margin:1.6em 0;padding:16px 22px;border-left:4px solid var(--gold);background:#fbf6ea;border-radius:0 10px 10px 0;font-size:18px;font-style:italic;color:var(--navy)}
  .cta{margin:2.4em 0;padding:28px;border-radius:16px;background:var(--navy);color:#fff;text-align:center}
  .cta h3{color:#fff;margin:0 0 16px;font-size:22px}
  .cta-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  .btn{display:inline-flex;align-items:center;gap:8px;font-weight:700;font-size:15px;padding:13px 22px;border-radius:11px}
  .btn:hover{text-decoration:none}
  .btn-gold{background:var(--gold);color:var(--navy)}
  .btn-gold:hover{background:#fff}
  .btn-ghost{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.3)}
  .btn-ghost:hover{background:rgba(255,255,255,.1)}
  .tag{display:inline-block;background:#fbf6ea;color:var(--gold-600);font-weight:700;font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:5px 11px;border-radius:999px}
  .related{border-top:1px solid var(--line);margin-top:48px;padding-top:32px}
  .related h2{font-size:22px}
  .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;margin-top:20px}
  .card{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#fff;transition:box-shadow .2s,transform .2s}
  .card:hover{box-shadow:0 12px 30px rgba(15,23,42,.12);transform:translateY(-2px)}
  .card a{color:inherit}
  .card img{width:100%;height:160px;object-fit:cover}
  .card .body{padding:16px}
  .card h3{font-size:17px;margin:8px 0 6px}
  .card p{font-size:14px;color:var(--muted);margin:0}
  footer.site{background:var(--navy);color:rgba(255,255,255,.7);margin-top:60px;padding:44px 0;font-size:14px}
  footer.site .row{display:flex;flex-wrap:wrap;gap:20px;justify-content:space-between;align-items:center}
  footer.site a{color:var(--gold)}
  .page-head{padding:36px 0 8px;text-align:center}
  .page-head h1{font-size:clamp(30px,5vw,46px);margin:.2em 0}
  .page-head p{color:var(--muted);font-size:18px;max-width:600px;margin:0 auto}
`;

function chrome(innerHead, innerBody) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${innerHead}
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Archivo:wght@600;700;800;900&display=swap" rel="stylesheet">
<style>${STYLES}</style>
</head>
<body>
<header class="site"><div class="wrap wide"><div class="row">
  <a class="brand" href="/"><span class="mark">JD</span><span>${SITE.logoWord}&nbsp;<span>Construction</span></span></a>
  <a class="nav-cta" href="/#projects">Free Estimate</a>
</div></div></header>
${innerBody}
<footer class="site"><div class="wrap wide"><div class="row">
  <span>&copy; ${new Date().getUTCFullYear()} ${esc(SITE.name)} — ${esc(SITE.city)}. Painting, siding &amp; roofing across Nebraska.</span>
  <span><a href="/">Home</a> &nbsp;·&nbsp; <a href="/blog/">All articles</a> &nbsp;·&nbsp; <a href="tel:${SITE.phoneRaw}">${esc(SITE.phone)}</a></span>
</div></div></footer>
</body>
</html>`;
}

/* ------------------------------- post page -------------------------------- */
function renderPost(post) {
  const url = `${SITE.domain}/blog/${post.slug}/`;
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const head = `
<title>${esc(post.title)} | ${esc(SITE.name)}</title>
<meta name="description" content="${esc(post.description)}">
<meta name="keywords" content="${esc((post.keywords || []).join(', '))}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(post.title)}">
<meta property="og:description" content="${esc(post.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${esc(post.image)}">
<meta property="article:published_time" content="${post.date}">
<meta property="article:modified_time" content="${post.updated || post.date}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(post.title)}">
<meta name="twitter:description" content="${esc(post.description)}">
<meta name="twitter:image" content="${esc(post.image)}">
<script type="application/ld+json">${ldSafe({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url + '#article',
    mainEntityOfPage: url,
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: { '@type': 'Organization', name: SITE.name, url: SITE.domain },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.domain, '@id': SITE.domain + '/#business' },
    articleSection: post.category,
    keywords: (post.keywords || []).join(', '),
  })}</script>
<script type="application/ld+json">${ldSafe({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.domain + '/' },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: SITE.domain + '/blog/' },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  })}</script>`;

  const body = `
<main class="wrap">
  <nav class="crumbs"><a href="/">Home</a> › <a href="/blog/">Journal</a> › ${esc(post.category)}</nav>
  <article>
    <span class="eyebrow">${esc(post.category)}</span>
    <h1>${esc(post.title)}</h1>
    <p class="meta">By ${esc(SITE.name)} · ${fmtDate(post.date)} · ${post.readMins} min read</p>
    <div class="hero"><img src="${esc(post.image)}" alt="${esc(post.imageAlt)}" width="1100" height="620" loading="eager"></div>
    ${renderBlocks(post.blocks)}
  </article>

  <section class="related">
    <h2>More from the JAJD journal</h2>
    <div class="cards">
      ${related.map((r) => `
        <div class="card"><a href="/blog/${r.slug}/">
          <img src="${esc(r.image)}" alt="${esc(r.imageAlt)}" loading="lazy">
          <div class="body"><span class="tag">${esc(r.category)}</span><h3>${esc(r.title)}</h3><p>${esc(r.excerpt)}</p></div>
        </a></div>`).join('')}
    </div>
  </section>
</main>`;

  return chrome(head, body);
}

/* ------------------------------- index page ------------------------------- */
function renderIndex() {
  const url = `${SITE.domain}/blog/`;
  const head = `
<title>Home Improvement Journal — Painting, Siding &amp; Roofing Tips | ${esc(SITE.name)}</title>
<meta name="description" content="Practical guides for Omaha-area homeowners: painting and siding costs, storm and hail damage steps, roofing advice, and how to hire the right contractor in Nebraska.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="Home Improvement Journal | ${esc(SITE.name)}">
<meta property="og:description" content="Painting, siding, roofing, and storm-damage guides for Omaha-area homeowners.">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${esc(POSTS[0].image)}">
<script type="application/ld+json">${ldSafe({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': url + '#blog',
    name: `${SITE.name} Journal`,
    url,
    publisher: { '@type': 'Organization', name: SITE.name, '@id': SITE.domain + '/#business' },
    blogPost: POSTS.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE.domain}/blog/${p.slug}/`,
      datePublished: p.date,
      image: p.image,
    })),
  })}</script>`;

  const body = `
<div class="wrap wide">
  <div class="page-head">
    <span class="eyebrow">JAJD Journal</span>
    <h1>Home improvement tips for Omaha homeowners</h1>
    <p>Straight, useful guides on painting, siding, roofing, storm damage, and hiring the right contractor in Nebraska.</p>
  </div>
  <div class="cards" style="margin:34px 0 10px">
    ${POSTS.map((p) => `
      <div class="card"><a href="/blog/${p.slug}/">
        <img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" loading="lazy">
        <div class="body"><span class="tag">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p></div>
      </a></div>`).join('')}
  </div>
</div>`;

  return chrome(head, body);
}

/* -------------------------------- sitemap --------------------------------- */
function renderSitemap() {
  const today = POSTS.reduce((max, p) => (p.updated > max ? p.updated : max), '2026-06-11');
  const urls = [
    { loc: `${SITE.domain}/`, lastmod: today, freq: 'weekly', pri: '1.0' },
    { loc: `${SITE.domain}/blog/`, lastmod: today, freq: 'weekly', pri: '0.7' },
    ...POSTS.map((p) => ({
      loc: `${SITE.domain}/blog/${p.slug}/`,
      lastmod: p.updated || p.date,
      freq: 'monthly',
      pri: '0.6',
    })),
  ];
  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

/* ---------------------------------- run ----------------------------------- */
async function main() {
  if (!existsSync(DIST)) {
    console.error(`[generate-blog] dist/ not found at ${DIST}. Run "vite build" first.`);
    process.exit(1);
  }

  for (const post of POSTS) {
    const dir = path.join(DIST, 'blog', post.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), renderPost(post), 'utf8');
  }

  await mkdir(path.join(DIST, 'blog'), { recursive: true });
  await writeFile(path.join(DIST, 'blog', 'index.html'), renderIndex(), 'utf8');
  await writeFile(path.join(DIST, 'sitemap.xml'), renderSitemap(), 'utf8');

  console.log(`[generate-blog] Wrote ${POSTS.length} posts + index + sitemap to dist/blog/`);
}

main().catch((err) => {
  console.error('[generate-blog] failed:', err);
  process.exit(1);
});
