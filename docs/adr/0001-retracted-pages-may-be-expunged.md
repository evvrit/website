# Retracted pages may be Expunged from git history

This repo is public, so a Retracted page stays readable in git history even after it leaves the live site. Retracting a page therefore comes with a second decision, made for each page: whether to also rewrite git history to remove it and force-push. Expunging is for pages whose content shouldn't stay findable at all; the private copy is still kept. Other Retracted pages are simply moved into a private, gitignored folder and left in history.

## Considered Options

- **Always leave history alone**: rejected, because some retractions need the content gone, not just off the live site.
- **Always expunge**: rejected, because rewriting history changes every later commit hash and can't be undone, which is too high a cost for routine retractions.
- **Make the repo private**: rejected, because GitHub Pages on a private repo requires a paid plan.

## Consequences

- Expunging a page rewrites every commit after the one that first added it. Existing clones and forks keep the old history, so expunging is only reliable for content that hasn't been widely copied.
- Retracted pages are not backed up anywhere other than this machine. Once a page is Expunged, the private folder holds its only copy.
