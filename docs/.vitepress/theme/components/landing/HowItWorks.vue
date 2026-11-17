<script setup lang="ts">
import { ref } from 'vue';

const copied = ref(false);

async function copyCliCommand() {
  if (typeof window === 'undefined') return;
  try {
    await navigator.clipboard.writeText('npm run resource:add');
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy command:', err);
  }
}
</script>

<template>
  <section class="rh-how-section rh-cv-auto" aria-labelledby="how-heading">
    <div class="rh-section-header">
      <div class="rh-section-eyebrow">WORKFLOW & EXTENSIBILITY</div>
      <h2 id="how-heading" class="rh-section-title">How It Works</h2>
      <p class="rh-section-subtitle">
        A transparent lifecycle engineered for rapid discovery and effortless community expansion.
      </p>
    </div>

    <!-- 3-Step Horizontal Stepper -->
    <div class="rh-stepper-container">
      <div class="rh-step-card rh-card">
        <div class="rh-step-num">01</div>
        <h3 class="rh-step-name">Discover & Filter</h3>
        <p class="rh-step-text">
          Instant keyboard search (<kbd class="rh-kbd">/</kbd>) across 250+ tools. Filter by taxonomy, free tiers, and stack with zero latency.
        </p>
      </div>

      <div class="rh-step-connector" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>

      <div class="rh-step-card rh-card">
        <div class="rh-step-num">02</div>
        <h3 class="rh-step-name">Save & Share</h3>
        <p class="rh-step-text">
          Every search state and filter permutation is mirrored in shareable URL parameters for clean bookmarking and team sharing.
        </p>
      </div>

      <div class="rh-step-connector" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>

      <div class="rh-step-card rh-card">
        <div class="rh-step-num">03</div>
        <h3 class="rh-step-name">Contribute via Git</h3>
        <p class="rh-step-text">
          Add new tools directly via Markdown pull requests or with our automated terminal CLI. Automated CI verifies links and schemas.
        </p>
      </div>
    </div>

    <!-- Terminal Command Snippet Box -->
    <div class="rh-card rh-cli-snippet-box">
      <div class="rh-cli-left">
        <span class="rh-cli-prompt">$</span>
        <code class="rh-cli-code">npm run resource:add</code>
      </div>
      <button
        class="rh-btn rh-btn-secondary rh-btn-sm rh-cli-copy-btn"
        :class="{ 'is-copied': copied }"
        :aria-label="copied ? 'Command copied' : 'Copy terminal command'"
        @click="copyCliCommand"
      >
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>{{ copied ? 'Copied!' : 'Copy CLI Command' }}</span>
      </button>
    </div>

    <!-- High-Contrast Contribution Banner -->
    <div class="rh-card rh-contribute-cta-banner">
      <div class="rh-cta-text-col">
        <h3 class="rh-cta-heading">Help Expand the Knowledge Hub</h3>
        <p class="rh-cta-paragraph">
          Developer Resource Hub is 100% open-source under the MIT license. Suggest outstanding libraries, tools, or design systems.
        </p>
      </div>
      <div class="rh-cta-buttons-col">
        <a href="/contribute" class="rh-btn rh-btn-primary rh-btn-md">
          <span>Read Contribution Guide</span>
          <span aria-hidden="true">→</span>
        </a>
        <a
          href="https://github.com/azmil666/resource-hub"
          target="_blank"
          rel="noopener noreferrer"
          class="rh-btn rh-btn-secondary rh-btn-md"
        >
          <span>Star on GitHub</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rh-how-section {
  width: 100%;
  max-width: 1200px;
  margin: var(--rh-space-12) auto;
  padding: 0 var(--rh-space-4);
}

@media (min-width: 768px) {
  .rh-how-section {
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

/* 3-Step Stepper */
.rh-stepper-container {
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-4);
  align-items: center;
  margin-bottom: var(--rh-space-8);
}

@media (min-width: 768px) {
  .rh-stepper-container {
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
  }
}

.rh-step-card {
  flex: 1;
  padding: var(--rh-space-6);
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-lg);
  display: flex;
  flex-direction: column;
}

.rh-step-num {
  font-size: 0.8125rem;
  font-weight: 700;
  font-family: var(--rh-font-mono);
  color: var(--rh-c-brand);
  background-color: var(--rh-c-brand-soft);
  width: 32px;
  height: 32px;
  border-radius: var(--rh-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--rh-space-3);
}

.rh-step-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--rh-c-text-primary);
  margin: 0 0 var(--rh-space-2) 0;
  letter-spacing: -0.02em;
}

.rh-step-text {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--rh-c-text-secondary);
  margin: 0;
}

.rh-step-connector {
  display: none;
  color: var(--rh-c-text-tertiary);
  align-self: center;
  padding: 0 var(--rh-space-1);
}

@media (min-width: 768px) {
  .rh-step-connector {
    display: flex;
  }
}

/* CLI Snippet */
.rh-cli-snippet-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--rh-space-3);
  padding: 12px 16px;
  background-color: var(--rh-c-bg-subtle);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-md);
  margin-bottom: var(--rh-space-8);
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
}

.rh-cli-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--rh-font-mono);
  font-size: 0.875rem;
}

.rh-cli-prompt {
  color: var(--rh-c-text-tertiary);
}

.rh-cli-code {
  color: var(--rh-c-text-primary);
  font-weight: 500;
}

.rh-cli-copy-btn.is-copied {
  border-color: var(--rh-color-emerald-border);
  color: var(--rh-color-emerald-text) !important;
}

/* High-Contrast CTA Banner */
.rh-contribute-cta-banner {
  padding: var(--rh-space-8) var(--rh-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-6);
  background: linear-gradient(
    135deg,
    var(--rh-c-bg-surface) 0%,
    var(--rh-c-bg-subtle) 100%
  );
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-lg);
}

@media (min-width: 768px) {
  .rh-contribute-cta-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: var(--rh-space-10) var(--rh-space-8);
  }
}

.rh-cta-text-col {
  max-width: 580px;
}

.rh-cta-heading {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--rh-c-text-primary);
  margin: 0 0 var(--rh-space-2) 0;
}

.rh-cta-paragraph {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--rh-c-text-secondary);
  margin: 0;
}

.rh-cta-buttons-col {
  display: flex;
  flex-wrap: wrap;
  gap: var(--rh-space-3);
  flex-shrink: 0;
}
</style>
