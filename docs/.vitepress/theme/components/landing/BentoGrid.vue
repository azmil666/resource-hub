<script setup lang="ts">
import { ref } from 'vue';
import { FEATURED_BADGE } from '../../utils/labels';

function handlePointerMove(e: PointerEvent) {
  const card = (e.currentTarget as HTMLElement);
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.style.setProperty('--spotlight-x', `${x}px`);
  card.style.setProperty('--spotlight-y', `${y}px`);
}
</script>

<template>
  <section class="rh-bento-section rh-cv-auto" aria-labelledby="bento-heading">
    <!-- Section Eyebrow & Title -->
    <div class="rh-section-header">
      <div class="rh-section-eyebrow">ENGINEERING ADVANTAGES</div>
      <h2 id="bento-heading" class="rh-section-title">Why Developers Use This Hub</h2>
      <p class="rh-section-subtitle">
        Zero promotional fluff, no paywalled listings, and zero tracking. A fast directory built for daily development.
      </p>
    </div>

    <!-- Asymmetric Bento Grid -->
    <div class="rh-bento-grid">
      <!-- 1. Instant Search (Spans 2 cols on desktop) -->
      <div
        class="rh-card rh-spotlight-card rh-bento-card rh-bento-span-2"
        @pointermove="handlePointerMove"
      >
        <div class="rh-bento-content">
          <div class="rh-bento-tag">SPEED & PRECISION</div>
          <h3 class="rh-bento-heading">Sub-Millisecond Search</h3>
          <p class="rh-bento-text">
            Search 250+ tools in real-time. Fuzzy matching searches titles, descriptions, categories, and tags simultaneously with zero server latency.
          </p>
        </div>

        <!-- Live Visual: Mini Search Simulation -->
        <div class="rh-bento-visual rh-visual-search">
          <div class="rh-mini-search-box">
            <svg class="rh-mini-lens" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <span class="rh-mini-query">daisyui</span>
            <span class="rh-mini-cursor">|</span>
            <kbd class="rh-kbd rh-mini-kbd">/</kbd>
          </div>
          <div class="rh-mini-result-pill">
            <span class="rh-mini-match">daisyUI</span>
            <span class="rh-badge rh-badge-emerald" style="padding: 1px 5px; font-size: 0.65rem;">free</span>
            <span class="rh-mini-cat">frontend</span>
          </div>
        </div>
      </div>

      <!-- 2. Smart Multi-Axis Filters -->
      <div
        class="rh-card rh-spotlight-card rh-bento-card"
        @pointermove="handlePointerMove"
      >
        <div class="rh-bento-content">
          <div class="rh-bento-tag">TAXONOMY</div>
          <h3 class="rh-bento-heading">Multi-Axis Filters</h3>
          <p class="rh-bento-text">
            Slice by pricing model (Free, Freemium, Paid), resource type (Tool, Library, API), and 10 categories.
          </p>
        </div>

        <!-- Live Visual: Filter Pills Stack -->
        <div class="rh-bento-visual rh-visual-pills">
          <div class="rh-pill-stack">
            <span class="rh-badge rh-badge-brand rh-pill-active">Frontend</span>
            <span class="rh-badge rh-badge-emerald">Free & Open</span>
            <span class="rh-badge rh-badge-amber">{{ FEATURED_BADGE }}</span>
          </div>
        </div>
      </div>

      <!-- 3. Shareable Deep Links -->
      <div
        class="rh-card rh-spotlight-card rh-bento-card"
        @pointermove="handlePointerMove"
      >
        <div class="rh-bento-content">
          <div class="rh-bento-tag">STATE HARMONY</div>
          <h3 class="rh-bento-heading">Deep-Link Sync</h3>
          <p class="rh-bento-text">
            Every query, filter pill, and tag choice updates URL parameters in real time for effortless sharing.
          </p>
        </div>

        <!-- Live Visual: Mini URL Bar -->
        <div class="rh-bento-visual rh-visual-url">
          <div class="rh-mini-url-bar">
            <span class="rh-url-host">/resources?</span><span class="rh-url-param">q=icons</span><span class="rh-url-sep">&</span><span class="rh-url-param">pricing=free</span>
          </div>
        </div>
      </div>

      <!-- 4. Open Markdown & Git-backed (Spans 2 cols on desktop) -->
      <div
        class="rh-card rh-spotlight-card rh-bento-card rh-bento-span-2"
        @pointermove="handlePointerMove"
      >
        <div class="rh-bento-content">
          <div class="rh-bento-tag">TRANSPARENT ARCHITECTURE</div>
          <h3 class="rh-bento-heading">100% Flat Markdown Records</h3>
          <p class="rh-bento-text">
            Zero proprietary databases or vendor lock-in. Every resource is stored as an auditable Markdown file with validated YAML frontmatter in Git.
          </p>
        </div>

        <!-- Live Visual: Code Snippet -->
        <div class="rh-bento-visual rh-visual-code">
          <pre class="rh-bento-code"><code><span class="rh-code-dash">---</span>
<span class="rh-code-key">title:</span> <span class="rh-code-str">"Lucide Icons"</span>
<span class="rh-code-key">category:</span> <span class="rh-code-str">"design"</span>
<span class="rh-code-key">pricing:</span> <span class="rh-code-keyword">"free"</span>
<span class="rh-code-key">tags:</span> <span class="rh-code-arr">[icons, svg, react]</span>
<span class="rh-code-dash">---</span></code></pre>
        </div>
      </div>

      <!-- 5. Automated CI Quality Gate -->
      <div
        class="rh-card rh-spotlight-card rh-bento-card"
        @pointermove="handlePointerMove"
      >
        <div class="rh-bento-content">
          <div class="rh-bento-tag">RELIABILITY</div>
          <h3 class="rh-bento-heading">Automated CI Gates</h3>
          <p class="rh-bento-text">
            Strict GitHub Actions workflows run AST schema validation, enforce HTTPS, and monitor dead links weekly.
          </p>
        </div>

        <!-- Live Visual: Validation Checklist -->
        <div class="rh-bento-visual rh-visual-checks">
          <div class="rh-check-item">
            <span class="rh-check-icon">✓</span>
            <span>Frontmatter AST Validated</span>
          </div>
          <div class="rh-check-item">
            <span class="rh-check-icon">✓</span>
            <span>Strict HTTPS Protocol</span>
          </div>
          <div class="rh-check-item">
            <span class="rh-check-icon">✓</span>
            <span>Zero Broken URLs</span>
          </div>
        </div>
      </div>

      <!-- 6. Keyboard-First Ergonomics -->
      <div
        class="rh-card rh-spotlight-card rh-bento-card"
        @pointermove="handlePointerMove"
      >
        <div class="rh-bento-content">
          <div class="rh-bento-tag">DEVELOPER ERGONOMICS</div>
          <h3 class="rh-bento-heading">Keyboard-Driven</h3>
          <p class="rh-bento-text">
            Engineered for engineers who never leave the keyboard. Instant focus, popover toggles, and shortcuts.
          </p>
        </div>

        <!-- Live Visual: Row of Physical Keycaps -->
        <div class="rh-bento-visual rh-visual-kbd">
          <div class="rh-kbd-row">
            <div class="rh-kbd-box"><kbd class="rh-kbd">/</kbd> <span>Focus</span></div>
            <div class="rh-kbd-box"><kbd class="rh-kbd">ESC</kbd> <span>Clear</span></div>
            <div class="rh-kbd-box"><kbd class="rh-kbd">↵</kbd> <span>Select</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rh-bento-section {
  width: 100%;
  max-width: 1200px;
  margin: var(--rh-space-12) auto;
  padding: 0 var(--rh-space-4);
}

@media (min-width: 768px) {
  .rh-bento-section {
    padding: 0 var(--rh-space-6);
    margin: var(--rh-space-16) auto;
  }
}

.rh-section-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto var(--rh-space-10) auto;
}

.rh-section-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--rh-c-text-tertiary);
  font-family: var(--rh-font-mono);
  margin-bottom: var(--rh-space-2);
}

.rh-section-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.035em;
  color: var(--rh-c-text-primary);
  margin: 0 0 var(--rh-space-2) 0;
}

.rh-section-subtitle {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--rh-c-text-secondary);
  margin: 0;
}

/* Asymmetric Bento Grid */
.rh-bento-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--rh-space-4);
}

@media (min-width: 768px) {
  .rh-bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .rh-bento-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .rh-bento-span-2 {
    grid-column: span 2;
  }
}

.rh-bento-card {
  padding: var(--rh-space-6);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--rh-space-5);
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-lg);
  min-height: 250px;
}

.rh-bento-tag {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--rh-c-text-tertiary);
  font-family: var(--rh-font-mono);
  margin-bottom: var(--rh-space-1);
}

.rh-bento-heading {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--rh-c-text-primary);
  letter-spacing: -0.025em;
  margin: 0 0 var(--rh-space-2) 0;
}

.rh-bento-text {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--rh-c-text-secondary);
  margin: 0;
}

/* Bento Visual Panels */
.rh-bento-visual {
  background-color: var(--rh-c-bg-subtle);
  border: 1px solid var(--rh-c-border-subtle);
  border-radius: var(--rh-radius-md);
  padding: 12px 14px;
}

/* Visual 1: Search */
.rh-visual-search {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rh-mini-search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-sm);
  padding: 4px 8px;
  font-size: 0.8125rem;
}

.rh-mini-lens { color: var(--rh-c-text-tertiary); }
.rh-mini-query { font-weight: 500; color: var(--rh-c-text-primary); }
.rh-mini-cursor { color: var(--rh-c-brand); animation: rh-blink 1s step-end infinite; }
.rh-mini-kbd { margin-left: auto; }

.rh-mini-result-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--rh-c-text-primary);
  padding: 2px 4px;
}

.rh-mini-match { font-weight: 600; }
.rh-mini-cat { color: var(--rh-c-text-tertiary); margin-left: auto; }

/* Visual 2: Pills */
.rh-pill-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.rh-pill-active {
  background-color: var(--rh-c-brand);
  color: var(--rh-c-bg) !important;
}

/* Visual 3: URL */
.rh-mini-url-bar {
  font-family: var(--rh-font-mono);
  font-size: 0.75rem;
  color: var(--rh-c-text-tertiary);
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-sm);
  padding: 6px 10px;
  white-space: nowrap;
  overflow-x: auto;
}

.rh-url-param {
  color: var(--rh-c-brand);
  font-weight: 600;
  background-color: var(--rh-c-brand-soft);
  padding: 1px 4px;
  border-radius: 3px;
}

.rh-url-sep { color: var(--rh-c-text-tertiary); }

/* Visual 4: Code */
.rh-bento-code {
  margin: 0;
  font-family: var(--rh-font-mono);
  font-size: 0.78125rem;
  line-height: 1.5;
  color: var(--rh-c-text-secondary);
}

.rh-code-dash { color: var(--rh-c-text-tertiary); }
.rh-code-key { color: #3b82f6; }
.dark .rh-code-key { color: #60a5fa; }
.rh-code-str { color: #10b981; }
.dark .rh-code-str { color: #34d399; }
.rh-code-keyword { color: #f59e0b; }
.rh-code-arr { color: #a855f7; }

/* Visual 5: Checks */
.rh-visual-checks {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.78125rem;
  color: var(--rh-c-text-secondary);
}

.rh-check-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rh-check-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--rh-color-emerald-bg);
  color: var(--rh-color-emerald-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: bold;
}

/* Visual 6: Keycaps */
.rh-kbd-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 8px;
}

.rh-kbd-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 0.6875rem;
  color: var(--rh-c-text-tertiary);
}
</style>
