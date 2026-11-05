// Builds from All-Songs/: songs.json, songs/<slug>.html, sitemap.xml, robots.txt,
// and the crawlable song list in index.html. Run: node scripts/build-songs.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://rago-actions.github.io/nlag-telugu-lyrics-library/';
const SITE_NAME = 'Joey Telugu Lyrics Library';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'All-Songs');

const invisible = /[​-‍⁠﻿]/g;

const escapeHtml = s => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

function determineType(filename, content) {
    const lower = filename.toLowerCase();
    const contentLower = content.toLowerCase();

    if (lower.includes('sermon') || contentLower.includes('romans') || contentLower.includes('prayer:')) {
        return 'sermon';
    }
    if (lower.includes('prayer') || lower.includes('prardhana')) {
        return 'prayer';
    }
    if (lower.includes('aaradhana') || lower.includes('worship') || lower.includes('stuthi')) {
        return 'worship';
    }
    return 'song';
}

// Drop a leading title line ("Title: X", "[Title]" + next line, or the bare title);
// the title is already shown as the heading.
function stripTitle(content, title) {
    const lines = content.replace(/^\s+/, '').split('\n');
    const first = lines[0].trim();
    const compact = t => t.replace(/[^a-z0-9]/gi, '').toLowerCase();
    let drop = 0;
    if (/^title:/i.test(first)) drop = 1;
    else if (/^\[title\]\s*\S/i.test(first)) drop = 1;
    else if (/^\[title\]$/i.test(first)) drop = 2;
    else if (compact(first) === compact(title)) drop = 1;
    return lines.slice(drop).join('\n').replace(/^\s+/, '');
}

function slugify(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const songs = readdirSync(dir)
    .filter(name => !name.startsWith('.'))
    .map(filename => {
        const content = readFileSync(join(dir, filename), 'utf8');
        const cleaned = filename.replace(invisible, '').trim();
        const title = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        return { filename, title, slug: slugify(title), type: determineType(filename, content), content: stripTitle(content, title) };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

const seen = new Map();
for (const song of songs) {
    if (!song.slug) throw new Error(`Empty slug for "${song.filename}"`);
    if (seen.has(song.slug)) {
        throw new Error(`Slug collision "${song.slug}": "${seen.get(song.slug)}" and "${song.filename}"`);
    }
    seen.set(song.slug, song.filename);
}

writeFileSync(join(root, 'songs.json'), JSON.stringify(songs));

// Static page per song (crawlable lyrics + per-song meta tags)
function songPage(song) {
    const url = `${BASE_URL}songs/${song.slug}.html`;
    const title = `${song.title} Lyrics - ${SITE_NAME}`;
    const lines = song.content.split('\n').map(l => l.trim()).filter(l => l && !/^\[.*\]$/.test(l));
    const description = `${song.title} - Telugu Christian song lyrics with transliteration. ${lines.slice(0, 2).join(' ')}`.slice(0, 200);
    const ld = {
        '@context': 'https://schema.org',
        '@type': 'MusicComposition',
        name: song.title,
        lyrics: { '@type': 'CreativeWork', text: song.content.trim() },
        inLanguage: 'te',
        url
    };
    return `<!DOCTYPE html>
<html lang="te">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${BASE_URL}og-image.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#c9a227">
    <link rel="manifest" href="../manifest.webmanifest">
    <link rel="stylesheet" href="../styles.css">
    <link rel="preload" href="../fonts/anek-telugu-400-telugu.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="../fonts.css">
    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
    <style>
        .song-page { max-width: 720px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
        .song-page a { color: var(--accent-text); text-decoration: none; }
        .song-page h1 { margin: 1rem 0 1.5rem; }
        .song-page pre { white-space: pre-wrap; font-family: inherit; line-height: 1.9; font-size: 1.1rem; }
    </style>
</head>
<body data-theme="dark">
    <main class="song-page">
        <a href="../?song=${encodeURIComponent(encodeURIComponent(song.filename))}">&larr; ${SITE_NAME}</a>
        <h1>${escapeHtml(song.title)}</h1>
        <pre>${escapeHtml(song.content.trim())}</pre>
    </main>
    <script>
        // Keep the dark/light preference chosen in the main app
        try { document.body.setAttribute('data-theme', localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')); } catch (e) {}
    </script>
</body>
</html>
`;
}

const songsDir = join(root, 'songs');
rmSync(songsDir, { recursive: true, force: true });
mkdirSync(songsDir);
for (const song of songs) {
    writeFileSync(join(songsDir, `${song.slug}.html`), songPage(song));
}

// Redirect stubs so old links to merged-away songs keep working (see merged.json)
const merged = JSON.parse(readFileSync(join(root, 'merged.json'), 'utf8'));
for (const [oldName, keptName] of Object.entries(merged)) {
    const kept = songs.find(s => s.filename === keptName);
    if (!kept) throw new Error(`merged.json: kept song "${keptName}" does not exist`);
    const oldSlug = slugify(oldName);
    if (seen.has(oldSlug)) continue; // old file still exists; it has its own page
    const target = `${BASE_URL}songs/${kept.slug}.html`;
    writeFileSync(join(songsDir, `${oldSlug}.html`), `<!DOCTYPE html>
<html lang="te">
<head>
    <meta charset="UTF-8">
    <title>${escapeHtml(kept.title)} - ${SITE_NAME}</title>
    <link rel="canonical" href="${target}">
    <meta http-equiv="refresh" content="0; url=${kept.slug}.html">
</head>
<body><a href="${kept.slug}.html">${escapeHtml(kept.title)}</a></body>
</html>
`);
}

// sitemap + robots
const urls = [BASE_URL, ...songs.map(s => `${BASE_URL}songs/${s.slug}.html`)];
writeFileSync(join(root, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n') + `\n</urlset>\n`);
writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}sitemap.xml\n`);

// Crawlable song list in index.html (between markers)
const START = '<!-- SONG-LINKS:START -->';
const END = '<!-- SONG-LINKS:END -->';
const indexPath = join(root, 'index.html');
const indexHtml = readFileSync(indexPath, 'utf8');
const links = songs.map(s => `<li><a href="songs/${s.slug}.html">${escapeHtml(s.title)}</a></li>`).join('\n');
const block = `${START}\n<details class="all-songs-links"><summary>All songs (${songs.length})</summary>\n<ul>\n${links}\n</ul></details>\n${END}`;
const re = new RegExp(`${START}[\\s\\S]*?${END}`);
if (!re.test(indexHtml)) throw new Error('SONG-LINKS markers missing in index.html');
writeFileSync(indexPath, indexHtml.replace(re, () => block));

console.log(`Built ${songs.length} songs`);
