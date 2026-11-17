<script setup lang="ts">
import AnnouncementBar from './landing/AnnouncementBar.vue';
import HeroSection from './landing/HeroSection.vue';
import CategoryMarquee from './landing/CategoryMarquee.vue';
import BentoGrid from './landing/BentoGrid.vue';
import CategoryShowcase from './landing/CategoryShowcase.vue';
import FeaturedShelf from './landing/FeaturedShelf.vue';
import RecentTable from './landing/RecentTable.vue';
import HowItWorks from './landing/HowItWorks.vue';
import LandingFooter from './landing/LandingFooter.vue';
</script>

<template>
  <div class="rh-landing-page">
    <!-- 1. Announcement Pulse Bar -->
    <AnnouncementBar />

    <!-- 2. Grade-S Hero with Product Window Mockup & Trust Strip -->
    <HeroSection />

    <!-- 3. Infinite Category Marquee Strip -->
    <CategoryMarquee />

    <!-- 4. Asymmetric Bento Feature Grid -->
    <BentoGrid />

    <!-- 5. 10 Curated Category Showcase Cards -->
    <CategoryShowcase />

    <!-- 6. Hand-picked Tools / Featured Showcase -->
    <FeaturedShelf />

    <!-- 7. Chronological Recent Table Feed -->
    <RecentTable />

    <!-- 8. How It Works, CLI Snippet & Contribution Banner -->
    <HowItWorks />

    <!-- 9. Semantic 4-Column Footer -->
    <LandingFooter />
  </div>
</template>

<style scoped>
.rh-landing-page {
  width: 100%;
  overflow-x: hidden;
  position: relative;
}
</style>
