/**
 * Generates the OG image (1200x630px) for social media sharing.
 * Uses Playwright to screenshot an HTML template for pixel-perfect control.
 *
 * @example
 * pnpm tsx scripts/generate-og-image.ts
 */
import { chromium } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const OG_WIDTH = 1200
const OG_HEIGHT = 630

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;600;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: ${OG_WIDTH}px;
    height: ${OG_HEIGHT}px;
    background: #0d1117;
    color: #e6edf3;
    font-family: 'Inter', sans-serif;
    overflow: hidden;
    position: relative;
  }

  /* Subtle grid pattern background */
  .grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(48, 54, 61, 0.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(48, 54, 61, 0.3) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0;
  }

  /* GitHub-style contribution graph dots */
  .dots {
    position: absolute;
    top: 80px;
    right: 60px;
    display: grid;
    grid-template-columns: repeat(15, 20px);
    gap: 4px;
    opacity: 0.6;
    z-index: 1;
  }
  .dot {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    background: #161b22;
  }
  .dot.l1 { background: #0e4429; }
  .dot.l2 { background: #006d32; }
  .dot.l3 { background: #26a641; }
  .dot.l4 { background: #39d353; }

  /* Diagonal accent line */
  .accent-line {
    position: absolute;
    top: 0;
    right: 320px;
    width: 3px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #58a6ff 30%, #58a6ff 70%, transparent);
    transform: skewX(-12deg);
    z-index: 2;
  }

  /* Content area */
  .content {
    position: relative;
    z-index: 3;
    padding: 80px 72px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .logo-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #58a6ff 0%, #3fb950 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 800;
    color: #0d1117;
    font-family: 'JetBrains Mono', monospace;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #8b949e;
  }

  .main-text {
    max-width: 640px;
  }

  h1 {
    font-size: 64px;
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.03em;
    margin-bottom: 20px;
  }

  h1 .highlight {
    background: linear-gradient(135deg, #58a6ff, #3fb950);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 22px;
    font-weight: 300;
    color: #8b949e;
    line-height: 1.5;
    max-width: 520px;
  }

  .bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .url {
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    color: #58a6ff;
    letter-spacing: 0.02em;
  }

  .tags {
    display: flex;
    gap: 8px;
  }

  .tag {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid #30363d;
    font-size: 13px;
    color: #8b949e;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Timeline snippets decoration */
  .timeline-deco {
    position: absolute;
    right: 72px;
    bottom: 160px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .timeline-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background: rgba(22, 27, 34, 0.9);
    border: 1px solid #30363d;
    border-radius: 8px;
    backdrop-filter: blur(8px);
    width: 280px;
  }

  .timeline-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .timeline-icon.pr { background: #238636; color: #fff; }
  .timeline-icon.issue { background: #da3633; color: #fff; }
  .timeline-icon.comment { background: #58a6ff; color: #0d1117; }

  .timeline-text {
    font-size: 12px;
    color: #8b949e;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .timeline-text strong {
    color: #e6edf3;
  }
</style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="accent-line"></div>

  <!-- Contribution graph dots -->
  <div class="dots">
    ${generateDots()}
  </div>

  <!-- Timeline decoration -->
  <div class="timeline-deco">
    <div class="timeline-item">
      <div class="timeline-icon pr">PR</div>
      <div class="timeline-text"><strong>feat:</strong> add user autocomplete</div>
    </div>
    <div class="timeline-item">
      <div class="timeline-icon issue">!</div>
      <div class="timeline-text"><strong>fix:</strong> resolve rate limiting</div>
    </div>
    <div class="timeline-item">
      <div class="timeline-icon comment">&gt;</div>
      <div class="timeline-text"><strong>review:</strong> approved changes</div>
    </div>
  </div>

  <div class="content">
    <div class="logo-area">
      <div class="logo-icon">GI</div>
      <div class="logo-text">Laststance.io</div>
    </div>

    <div class="main-text">
      <h1>
        <span class="highlight">GitHub</span><br/>
        Activity<br/>
        Visualization
      </h1>
      <p class="subtitle">
        Track issues, PRs, and discussions in a clean timeline from developers you follow.
      </p>
    </div>

    <div class="bottom-bar">
      <span class="url">geek-infiltration.vercel.app</span>
      <div class="tags">
        <span class="tag">React 19</span>
        <span class="tag">MUI v7</span>
        <span class="tag">GraphQL</span>
      </div>
    </div>
  </div>
</body>
</html>`

function generateDots(): string {
  const levels = ['', 'l1', 'l2', 'l3', 'l4']
  // Seeded pattern to look like a real contribution graph
  const pattern = [
    0, 0, 1, 0, 2, 0, 0, 3, 1, 0, 0, 2, 0, 1, 0, 0, 1, 0, 3, 1, 0, 2, 4, 2, 1,
    0, 0, 1, 3, 0, 1, 0, 2, 1, 0, 4, 3, 1, 0, 2, 1, 0, 3, 2, 0, 0, 2, 0, 0, 3,
    1, 0, 2, 0, 4, 3, 1, 0, 0, 2, 0, 0, 1, 2, 0, 0, 1, 3, 2, 1, 0, 4, 2, 0, 1,
    2, 1, 0, 0, 1, 3, 2, 0, 1, 0, 0, 2, 1, 3, 0, 0, 3, 1, 0, 2, 0, 0, 1, 4, 2,
    0, 1, 0, 0, 3,
  ]
  return pattern
    .map((level) => `<div class="dot ${levels[level]}"></div>`)
    .join('\n    ')
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: OG_WIDTH, height: OG_HEIGHT },
    deviceScaleFactor: 2,
  })

  await page.setContent(html, { waitUntil: 'networkidle' })

  // Wait for fonts to load
  await page.waitForTimeout(1500)

  const outputPath = path.resolve(__dirname, '..', 'public', 'og-image.png')
  await page.screenshot({
    path: outputPath,
    type: 'png',
    clip: { x: 0, y: 0, width: OG_WIDTH, height: OG_HEIGHT },
  })

  await browser.close()
  console.log(`OG image generated: ${outputPath}`)
}

main().catch((err) => {
  console.error('Failed to generate OG image:', err)
  process.exit(1)
})
