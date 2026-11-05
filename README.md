# 🎵 Joey Telugu Lyrics Library

A beautiful, feature-rich web application for browsing, searching, and sharing Telugu Christian songs and lyrics.

**Live Site:** [https://rago-actions.github.io/nlag-telugu-lyrics-library/](https://rago-actions.github.io/nlag-telugu-lyrics-library/)

## ✨ Features

### 🎯 Core Features
- **142 Telugu Christian Songs** - Comprehensive collection of worship songs, hymns, prayers, and sermons
- **Instant Search** - Fast, fuzzy search across song titles and lyrics
- **Alphabet Navigation** - Quick filter by first letter (A-Z)
- **Beautiful Card Interface** - Flip cards to reveal full lyrics
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### ⭐ Enhanced Features

#### 💾 Favorites & Bookmarks
- **Star your favorite songs** for quick access later
- Click the ★ icon on any song card
- View all favorites with the "Favorites" button
- Persists across browser sessions using localStorage

#### 🌓 Dark/Light Mode
- **Toggle between themes** with the moon/sun icon
- Smooth transitions between modes
- Theme preference saved automatically
- Optimized colors for both light and dark environments

#### 🎨 Palettes & Featured Carousel
- Pick one of five colour palettes (gold, sapphire, emerald, rose, violet) from the menu
- Auto-rotating "Featured today" carousel of songs on the main list

#### 📤 Share Functionality
- **Share songs via link** - Copy direct link to any song
- **WhatsApp sharing** - Send songs directly to WhatsApp
- **Deep linking** - URLs with song parameters work perfectly
- Example: `?song=Yehovaa%20Nee%20Naamamu`

#### 🖨️ Print Support
- **Print-friendly view** - Clean, optimized for printing
- Print individual songs with one click
- Removes UI elements and formats for paper
- Perfect for creating physical songbooks

#### 📜 Recently Viewed
- **Track your history** - See recently opened songs
- Access via "Recent" button
- Stores last 10 viewed songs
- Helps you find songs you were just looking at

#### 🔤 Font Size Controls
- **Adjust text size** with A+/A- buttons
- **Keyboard shortcuts**: `Ctrl +` / `Ctrl -`
- Range: 50% to 200%
- Preference saved per browser

#### 🌐 Transliteration Toggle
- **Show/hide English transliteration** with తె/En button
- Perfect for those who can read Telugu script
- Reduces clutter when you don't need romanization
- Toggle preference saved

#### 🔄 Sorting Options
- **A → Z** - Alphabetical ascending
- **Z → A** - Alphabetical descending
- Sort dropdown in toolbar

#### ⌨️ Keyboard Shortcuts
- **`/`** - Focus search box
- **`Esc`** - Close opened card or modal
- **`P`** - Presenter mode: full screen, large lyrics (when card is open)
- **`F`** - Toggle favorite (when card is open)
- **`Ctrl +`** - Increase font size
- **`Ctrl -`** - Decrease font size
- **`?`** - Show keyboard shortcuts help

#### 📱 Mobile Gestures
- **Swipe down** to close expanded lyrics
- Touch-optimized interface
- Smooth animations

#### 🔝 Scroll to Top
- Floating button appears when scrolling
- Smooth scroll animation
- Appears after scrolling 500px

#### 🎨 Performance Optimizations
- **Lazy loading** for cards
- **Fuzzy search** algorithm for better matching
- **Smooth animations** throughout
- **Fast load times** with optimized assets

#### ♿ Accessibility
- **Full keyboard navigation** support
- **ARIA labels** for screen readers
- **Semantic HTML** structure
- **Focus management** for modals
- **High contrast** mode compatible

### 📊 SEO & Sharing
- **Open Graph tags** for social media
- **Twitter Card** support
- **Schema.org** structured data
- **Optimized meta tags**
- **Canonical URLs**

## 🚀 Quick Start

### For Users
Simply visit [https://rago-actions.github.io/nlag-telugu-lyrics-library/](https://rago-actions.github.io/nlag-telugu-lyrics-library/)

### For Developers

1. **Clone the repository**
   ```bash
   git clone https://github.com/rago-actions/nlag-telugu-lyrics-library.git
   cd nlag-telugu-lyrics-library
   ```

2. **Open locally**
   - Simply open `index.html` in a web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (with http-server)
     npx http-server
     
     # VS Code Live Server extension
     ```

3. **Visit** `http://localhost:8000`

## 📁 Project Structure

```
nlag-telugu-lyrics-library/
├── index.html          # Main HTML file with SEO meta tags
├── styles.css          # Enhanced CSS with dark/light themes
├── script.js           # JavaScript with all features
├── sw.js               # Service worker (offline support)
├── manifest.webmanifest
├── songs.json          # Generated: all songs in one file
├── songs/              # Generated: one static page per song (SEO)
├── sitemap.xml, robots.txt  # Generated
├── scripts/build-songs.mjs  # Generator
├── README.md           # This file
└── All-Songs/          # Source song files
    ├── Song Name 1
    ├── Song Name 2
    └── ...
```

## 🎨 Adding New Songs

1. Create a new text file in the `All-Songs/` directory
2. Name it exactly as you want it displayed (no extension)
3. Format the content:
   ```
   Title: Song Name

   తెలుగు లిరిక్స్
   Telugu transliteration

   [Verse 1]
   తెలుగు లిరిక్స్
   Telugu transliteration
   ```

4. Commit and push. A GitHub Action (`.github/workflows/build-songs.yml`) runs
   `node scripts/build-songs.mjs`, which regenerates `songs.json`, the per-song pages in
   `songs/`, `sitemap.xml`, and the song list in `index.html`. To preview locally, run
   the script yourself first:
   ```bash
   node scripts/build-songs.mjs
   git add .
   git commit -m "Add new song: Your Song Name"
   git push
   ```

   Two songs whose names differ only by case or punctuation produce the same URL slug;
   the build fails with a "Slug collision" error — rename one of them.

## ✅ Tests

```bash
npm test   # or: node --test test/songs.test.mjs
```

Checks that every song builds, slugs are unique, lyrics don't repeat the title, merged songs
point at a kept song, and the sitemap is complete. CI runs it before regenerating files.

## 🛠️ Technologies Used

- **HTML5** - Semantic markup with accessibility
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)** - Modern features, async/await
- **Web APIs** - localStorage, Clipboard, Fetch, IntersectionObserver
- **Self-hosted fonts** - Anek Telugu, Instrument Serif, Outfit

## 🌟 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Privacy

- **No tracking** - No analytics or tracking scripts
- **No cookies** - Uses localStorage for preferences only
- **No external requests** - All data stored locally
- **No user accounts** - Everything works anonymously

## 📱 PWA Features

The site works offline-first and can be installed as a Progressive Web App:

1. Visit the site on mobile
2. Tap "Add to Home Screen"
3. Use it like a native app!

## 🎯 Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `/` | Focus search |
| `Esc` | Close card/modal |
| `P` | Presenter mode (in card) |
| `F` | Toggle favorite (in card) |
| `Ctrl +` | Increase font size |
| `Ctrl -` | Decrease font size |
| `?` | Show shortcuts help |
| `Enter` | Open first search result |

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Add new songs** - Follow the format in "Adding New Songs"
2. **Fix bugs** - Submit issues or pull requests
3. **Improve translations** - Help with English transliterations
4. **Suggest features** - Open an issue with your idea

### Contribution Guidelines

- Keep song formatting consistent
- Test on multiple devices before submitting
- Follow existing code style
- Update README if adding major features

## 📝 License

This project is open source and available for use by anyone. Feel free to use, modify, and distribute.

## 🙏 Acknowledgments

- All song lyricists and composers
- The Telugu Christian community
- Contributors and users

## 📞 Contact

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/rago-actions/nlag-telugu-lyrics-library/issues)
- **Pull Requests**: [Contribute to the project](https://github.com/rago-actions/nlag-telugu-lyrics-library/pulls)

## 🔄 Recent Updates

### Version 2.0 (Latest)
- ✅ Added favorites/bookmarks system
- ✅ Dark/light mode toggle
- ✅ Share functionality (link & WhatsApp)
- ✅ Print-friendly view
- ✅ Recently viewed tracking
- ✅ Font size controls
- ✅ Transliteration toggle
- ✅ Sorting options
- ✅ Keyboard shortcuts
- ✅ Mobile gesture support
- ✅ Scroll to top button
- ✅ Enhanced search with fuzzy matching
- ✅ SEO optimization
- ✅ Improved accessibility
- ✅ Added 13 new songs

### Version 1.0
- Initial release with 127 songs
- Basic search and filtering
- Card flip interface

---

Made with ❤️ for the Telugu Christian community

**Star ⭐ this repository if you find it helpful!**
