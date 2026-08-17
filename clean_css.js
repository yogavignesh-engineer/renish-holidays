
const fs = require("fs");

let css = fs.readFileSync("style.css", "utf8");

// Remove older whatsapp-cta-box (lines 508-528 approx)
css = css.replace(/\.whatsapp-cta-box \{[\s\S]*?\.btn-whatsapp:hover \{[\s\S]*?\}/, "");

// Remove duplicated hero-video-wrapper (from MORE FIXES)
css = css.replace(/\/\* MORE FIXES \*\/[\s\S]*?\.hero-video-wrapper \{[\s\S]*?z-index: -2;\s*\}/, "");

// Convert icon fixes to standard rules
css = css.replace(/\/\* ICON FIXES \*\/[\s\S]*$/, `
/* ICON SIZING FIXES */
.pkg-duration svg { width: 16px; height: 16px; margin-right: 0.25rem; flex-shrink: 0; }
.pkg-inc-item svg { width: 16px; height: 16px; color: var(--brand-accent); flex-shrink: 0; }
.footer-logo-icon svg { width: 32px; height: 32px; flex-shrink: 0; }
.footer-contact-item svg { width: 18px; height: 18px; flex-shrink: 0; margin-right: 0.5rem; }
.footer-social a svg { width: 20px; height: 20px; flex-shrink: 0; }
.form-success-icon svg { width: 48px; height: 48px; color: var(--brand-accent); flex-shrink: 0; margin: 0 auto; display: block; }
.scroll-top svg { width: 24px; height: 24px; flex-shrink: 0; }
.review-stars svg { width: 16px; height: 16px; color: #F59E0B; flex-shrink: 0; }
.whatsapp-fab svg { width: 28px; height: 28px; flex-shrink: 0; }
.btn-whatsapp svg { width: 18px; height: 18px; flex-shrink: 0; margin-right: 0.25rem; }
`);

fs.writeFileSync("style.css", css);
console.log("CSS cleaned!");

