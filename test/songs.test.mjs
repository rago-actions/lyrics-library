import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
execFileSync('node', [join(root, 'scripts/build-songs.mjs')], { stdio: 'pipe' });

const songs = JSON.parse(readFileSync(join(root, 'songs.json'), 'utf8'));
const merged = JSON.parse(readFileSync(join(root, 'merged.json'), 'utf8'));
const files = readdirSync(join(root, 'All-Songs'));

test('songs.json has one entry per song file', () => {
    assert.equal(songs.length, files.length);
});

test('slugs are unique and filesystem-safe', () => {
    const slugs = songs.map(s => s.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
});

test('every song has a title, a known type, and lyrics', () => {
    for (const s of songs) {
        assert.ok(s.title.trim(), `empty title: ${s.filename}`);
        assert.ok(['song', 'sermon', 'prayer', 'worship'].includes(s.type), `bad type: ${s.filename}`);
        assert.ok(s.content.trim().length > 0, `empty lyrics: ${s.filename}`);
        if (!/english/i.test(s.filename)) assert.ok(/[ఀ-౿]/.test(s.content), `no Telugu text: `);
    }
});

test('lyrics do not repeat the title line', () => {
    for (const s of songs) {
        assert.doesNotMatch(s.content.split('\n')[0], /^(title:|\[title\])/i, s.filename);
    }
});

test('every song has a static page, and merged songs redirect to a kept song', () => {
    for (const s of songs) assert.ok(existsSync(join(root, 'songs', `${s.slug}.html`)), s.slug);
    for (const [oldName, kept] of Object.entries(merged)) {
        assert.ok(songs.some(s => s.filename === kept), `kept song missing: ${kept}`);
        assert.ok(!files.includes(oldName), `merged song still present: ${oldName}`);
        assert.ok(!(oldName in merged && Object.values(merged).includes(oldName)), `merge chain: ${oldName}`);
    }
});

test('sitemap lists the home page and every song', () => {
    const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
    assert.equal((sitemap.match(/<loc>/g) || []).length, songs.length + 1);
});
