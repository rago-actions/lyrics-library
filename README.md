# Joey Telugu Lyrics Library

Telugu Christian songs with lyrics and English transliteration.

**Live site:** https://rago-actions.github.io/nlag-telugu-lyrics-library/

## Features

- Search songs and lyrics (spelling variants like "yesayya" / "yesayyaa" match)
- Filter by first letter, favorites, or recently viewed
- Click a card to read the lyrics; share, print, copy, or open in presenter mode
- Dark/light theme, five colour palettes, font size and transliteration toggle
- Featured-songs carousel
- Works offline and can be installed as an app
- Keyboard shortcuts (press `?` to see them)

## Adding a song

1. Add a text file to `All-Songs/`. The file name is the song title.
2. Put the lyrics inside: Telugu line, then transliteration line, with `[Verse 1]`-style headings if wanted.
3. Commit and push. A GitHub Action rebuilds `songs.json`, the per-song pages, and the sitemap.

To build locally: `node scripts/build-songs.mjs`

Two titles that differ only by case or punctuation clash; the build fails with "Slug collision", so rename one.

## Development

```bash
python3 -m http.server 8000   # then open http://localhost:8000
npm test                      # runs test/songs.test.mjs
```

Plain HTML, CSS and JavaScript; no framework. Preferences are saved in the browser only. There is no tracking.
