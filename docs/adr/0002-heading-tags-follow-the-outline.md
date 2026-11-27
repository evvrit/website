# Heading tags follow the page outline; looks come from type roles

Pages used to pick heading tags for their look (dates were `h5`, Quietly Radical's sections were `h4` resized on that page only), so the same tag looked different from page to page and the outline screen readers navigate by was wrong. We decided that a heading's tag only says where it sits in the outline (`h1` > `h2` > `h3`, one `h1` per page, no skipped levels). Its look comes from a small set of type roles defined once in `styles/site.css`: Title (`h1`), Section (`h2`), Subsection (`h3`), Label (`.label`, on any tag) and small text (`.caption`, `.fine`). Page sheets never restyle these roles, and `h4`–`h6` aren't used.

## Consequences

- To get a heading's look on something that isn't a heading, such as a date, use a class (`.label`). Don't pick a heading tag for it.
- The fonts the roles use are loaded by `site.css` itself (`@import`), so every page gets them. That costs a little load time compared with a `<link>` in each page's `<head>`, but it stops pages from loading fewer fonts than the roles need.
