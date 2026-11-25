# Egypt Income Tax Study Guide (Law 91 of 2005)

An interactive Arabic study guide for tax accounting, based on the Egyptian Income Tax Law No. 91 of 2005. It has chapter summaries, one-page review posters, "summary of the summary" lists and worked examples, in a right-to-left layout that works on phone and desktop.

**Live site:** https://egypt-income-tax-study.pages.dev

## Where the code lives

| Path | What it is |
| --- | --- |
| `src/App.tsx` | The React application: layout, navigation, chapter index, poster viewer, scroll and search behavior |
| `src/main.tsx` | Entry point |
| `src/style.css`, `src/fontface.css` | Styles and web fonts (readable source) |
| `src/posters.ts` | Review poster definitions: titles, stat chips, tables and diagrams per chapter |
| `src/molakhas.ts` | The "summary of the summary" content for each chapter |
| `src/data.ts` | Note on the chapter text (the full text is compiled into `main.js`) |
| `index.html`, `main.js`, `main.css`, `shim.js`, `*.woff2`, images | The built site that is deployed. `main.js` is a compiled bundle (minified), so read `src/` instead |

## How it was built

Built with AI-assisted development (Claude Code): agentic coding workflows, prompt engineering and iterative prototyping, by Mohamed Ayman Harash. The content is summarized from a university textbook and checked against its pages.

`src/App.tsx` imports UI components from the `@instinct/files` kit, which is not part of this repository, so `src/` is there to read, not to rebuild.

## Run the built site

There is no build step for the built files. Serve the folder with any static server, for example `python3 -m http.server`, and open `http://localhost:8000`.

## Note

This is a student study aid, not legal or tax advice. Check the law and your textbook for anything that matters. Minor errors may remain.
