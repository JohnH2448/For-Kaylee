# The Long Way Home

A buildless scavenger hunt for GitHub Pages. All illustrations are original inline SVG. No framework, installation, backend, or API key is required.

## Customize

Edit the first three constants in `app.js`:

- Outer password: `prettygirl`
- Inner password: `india`
- Revealed word: `doe eyes`

Password matching ignores capitalization and leading/trailing spaces. Give your participants the two passwords separately as part of your wider hunt. Scene copy and hints are in the `stages` array.

## Publish on GitHub Pages

1. Add `index.html`, `style.css`, `app.js`, and `.nojekyll` to the root of your GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Select **Deploy from a branch**, choose your branch and **/ (root)**, then save.
4. Open the published URL shown by GitHub once deployment completes.

All asset references are relative, so repository project URLs work. Google Fonts is optional; local serif and sans-serif fallbacks work offline.

## Preview locally

Run `python -m http.server 4173` from this folder and open http://localhost:4173. You can also open `index.html` directly.

## How the trail works

Solve four word puzzles in order: Caesar shift, five-bit binary, Morse code, and interleaved text. Short clues identify the decoding rules. There are no hints or Morse reference chart; Morse can be decoded using outside reference material if needed. Answers, for the organizer: CURRENT, CLOVER, FETCH, SWEETNESS.

Future chapters stay locked until the preceding puzzles are solved. Progress survives reloads in the same tab. This version uses a new storage key so completion of the old, easier puzzles does not bypass the new trail.

The outer password opens an animated hinged door, revealing a smaller vault inside. The inner password opens its door and reveals only the word inside the cavity. Reduced-motion preferences are respected. Vault progress is saved; restart clears both locks and all puzzle progress.

The password and answer are deliberately stored in client-side JavaScript, as requested. This is a playful gate, not secure storage. No sensitive content should be placed behind it.
