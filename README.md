# Wedding Invitation Static Page

This is a static wedding invitation page ready for Cloudflare Pages.

## Files

- `index.html`: page copy and sections
- `styles.css`: responsive visual design
- `script.js`: countdown, share button, RSVP link behavior
- Built-in Web Audio music: click the `音乐` button to play or pause
- `assets/couple-hero.webp`: optimized hero image used by the page
- `assets/couple-*.jpg`: original wedding photos copied into the project
- `assets/couple-*.webp`: optimized wedding photos used by the page
- `assets/hero-wedding.*`: earlier generated fallback visual, currently not used

## Customize

Replace these before publishing:

- Names: search `赵威威` and `姜紫玲` in `index.html`
- Date/time: update visible text in `index.html` and `weddingConfig.date` in `script.js`
- Venue/map: update the address text and `data-map` link in `index.html`
- RSVP: put your Tencent Form / Wenjuanxing link into `weddingConfig.rsvpUrl`
- QR code: after Cloudflare Pages gives you the final URL, generate a QR image and replace the decorative QR block if desired

## Deploy To Cloudflare Pages

Upload this folder as a static site. Build command can be empty. Output directory is `/`.
