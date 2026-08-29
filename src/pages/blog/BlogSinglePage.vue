<template>
  <main class="z-container z-page">
    <StoreCrumbs :crumbs="[{ label: t('nav.blog'), to: '/blog' }, { label: post.title }]" />

    <div v-if="booting" class="z-blog-single z-fade-item">
      <div class="z-skel z-skel--sm" style="width: 20%" />
      <div class="z-skel z-skel--lg" style="width: 80%; height: 32px; margin-top: 12px" />
      <div class="z-skel" style="width: 100%; height: 320px; margin-top: 18px; border-radius: 14px" />
      <div class="z-skel z-skel--md" style="width: 100%; height: 72px; margin-top: 18px" />
    </div>

    <article v-else class="z-blog-single z-fade-item">
      <header class="z-blog-single__head">
        <span class="z-blog-tag">{{ post.category }}</span>
        <h1>{{ post.title }}</h1>
        <p class="z-blog-meta">
          <span>{{ post.author }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ post.date }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ t('blog.minutes', { n: post.minutes }) }}</span>
        </p>
      </header>

      <div class="z-blog-single__cover">
        <img :src="post.image" :alt="post.title" />
      </div>

      <div class="z-blog-single__content">
        <p class="z-blog-single__lead">{{ post.excerpt }}</p>
        <p>{{ post.body }}</p>
      </div>

      <div class="z-blog-single__actions">
        <router-link class="z-btn z-btn-ghost" to="/blog">
          <i class="material-icons">arrow_back</i>
          {{ t('blog.back') }}
        </router-link>
        <router-link class="z-btn z-btn-deal" to="/shop">{{ t('home.shopNow') }}</router-link>
      </div>

      <section v-if="related.length" class="z-blog-related">
        <div class="z-section-head">
          <h3>{{ t('blog.related') }}</h3>
        </div>
        <div class="z-blog-grid z-blog-grid--related">
          <article v-for="(item, i) in related" :key="item.slug" class="z-blog-card" :style="{ '--i': i }">
            <router-link class="z-blog-card__media" :to="`/blog/${item.slug}`">
              <img :src="item.image" :alt="item.title" />
              <span class="z-blog-tag">{{ item.category }}</span>
            </router-link>
            <div class="z-blog-card__body">
              <p class="z-blog-meta">
                <span>{{ item.date }}</span>
                <span aria-hidden="true">·</span>
                <span>{{ t('blog.minutes', { n: item.minutes }) }}</span>
              </p>
              <h3>
                <router-link :to="`/blog/${item.slug}`">{{ item.title }}</router-link>
              </h3>
              <router-link class="z-blog-read" :to="`/blog/${item.slug}`">
                {{ t('blog.readMore') }}
                <i class="material-icons">arrow_forward</i>
              </router-link>
            </div>
          </article>
        </div>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import StoreCrumbs from 'components/store/StoreCrumbs.vue';
import { blogPosts, getBlogPost } from 'src/data/blog-posts';
import { ecom } from 'src/helper/ecomAssets';
import { useBootLoad } from 'src/composables/useBootLoad';

const { t } = useI18n();
const route = useRoute();
const { booting } = useBootLoad(undefined, 350);

const post = computed(() => {
  const slug = String(route.params.slug);
  return (
    getBlogPost(slug) ?? {
      slug,
      title: 'Post',
      date: '',
      excerpt: '',
      body: '',
      image: ecom('imgs/page/blog/blog-1.webp'),
      category: 'Guides',
      minutes: 3,
      author: 'Zcomus Team',
    }
  );
});

const related = computed(() =>
  blogPosts.filter((p) => p.slug !== post.value.slug && p.category === post.value.category).slice(0, 2)
    .concat(blogPosts.filter((p) => p.slug !== post.value.slug).slice(0, 2))
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, 2),
);
</script>
