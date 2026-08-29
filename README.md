# PersuaRL — project page

Source for the project page of **PersuaRL: Reinforcement Learning-Driven
Multi-Expert Selection for Persuasive Dialogue Generation in Insurance**
(Findings of EMNLP 2026).

## Layout

```
index.html              the whole page — content and structure
static/css/paper.css    all styling; theme variables live in :root
static/js/paper.js      copy-BibTeX, scroll-spy nav, back-to-top
static/images/          figures used by the page
```

No framework and no build step: open `index.html` in a browser, or push to
GitHub Pages as-is. `.nojekyll` keeps Pages from reprocessing the files.

## Editing

- **Theme** — colours, fonts and column widths are the custom properties at the
  top of `static/css/paper.css`.
- **Paper / arXiv links** — currently placeholder pills marked `soon`. Swap each
  `<span class="resource is-pending" …>` for
  `<a class="resource" href="URL" target="_blank" rel="noopener">` and drop the
  `<em class="soon">soon</em>` line once the links exist.
- **Publication metadata** — the `citation_*` meta tags in `<head>` are what
  Google Scholar reads; `PAPER_URL` and `PAGE_URL` in there are still
  placeholders.
- **Social preview** — add a 1200x630 image at
  `static/images/social_preview.png` for link cards.

## Citation

The BibTeX entry is in the Citation section at the bottom of the page.
