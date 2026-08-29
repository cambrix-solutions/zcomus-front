<template>
  <div class="z-container z-page">
    <StoreCrumbs :crumbs="[{ label: t('nav.blog') }]" />

    <div class="z-blog-hero">
      <div>
        <p class="z-page-hero__kicker">{{ t('blog.kicker') }}</p>
        <h1>{{ t('nav.blog') }}</h1>
        <p class="z-muted">{{ t('blog.subtitle') }}</p>
      </div>
      <router-link class="z-btn z-btn-deal" to="/shop">
        {{ t('home.shopNow') }}
        <i class="material-icons">arrow_forward</i>
      </router-link>
    </div>

    <div class="z-blog-toolbar">
      <label class="z-blog-toolbar__search">
        <i class="material-icons">search</i>
        <input v-model="search" type="search" :placeholder="t('blog.search')" />
      </label>
      <div class="z-blog-topics">
        <button type="button" :class="{ 'is-active': topic === 'all' }" @click="topic = 'all'">
          {{ t('shop.all') }}
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          :class="{ 'is-active': topic === cat }"
          @click="topic = cat"
        >
          {{ cat }}
        </button>
      </div>
      <span class="z-blog-toolbar__meta">{{ t('blog.count', { n: filtered.length }) }}</span>
    </div>

    <div v-if="booting" class="z-blog-layout">
      <div class="z-blog-layout__main">
        <div class="z-skel-blog z-skel-blog--featured z-fade-item">
          <div class="z-skel z-skel-blog__img" />
          <div class="z-skel-blog__body">
            <div class="z-skel z-skel--sm" style="width: 24%" />
            <div class="z-skel z-skel--lg" style="width: 80%; margin-top: 12px; height: 24px" />
            <div class="z-skel z-skel--md" style="width: 100%; height: 48px; margin-top: 12px" />
          </div>
        </div>
        <div class="z-blog-grid">
          <SkeletonBlogCard v-for="n in 3" :key="n" class="z-fade-item" :style="{ '--i': n }" />
        </div>
      </div>
    </div>

    <div v-else-if="!filtered.length" class="z-empty z-fade-item">
      <h3>{{ t('blog.empty') }}</h3>
      <p>{{ t('blog.emptyHint') }}</p>
      <button class="z-btn z-btn-primary" type="button" @click="resetFilters">{{ t('shop.reset') }}</button>
    </div>

    <div v-else class="z-blog-layout">
      <div class="z-blog-layout__main">
        <article v-if="featured" class="z-blog-featured z-fade-item">
          <router-link class="z-blog-featured__media" :to="`/blog/${featured.slug}`">
            <img :src="featured.image" :alt="featured.title" />
            <span class="z-blog-tag">{{ featured.category }}</span>
          </router-link>
          <div class="z-blog-featured__body">
            <p class="z-blog-meta">
              <span>{{ featured.date }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ t('blog.minutes', { n: featured.minutes }) }}</span>
            </p>
            <h2>
              <router-link :to="`/blog/${featured.slug}`">{{ featured.title }}</router-link>
            </h2>
            <p class="z-muted">{{ featured.excerpt }}</p>
            <router-link class="z-blog-read" :to="`/blog/${featured.slug}`">
              {{ t('blog.readMore') }}
              <i class="material-icons">arrow_forward</i>
            </router-link>
          </div>
        </article>

        <div v-if="rest.length" class="z-blog-grid">
          <article
            v-for="(post, i) in rest"
            :key="post.slug"
            class="z-blog-card z-fade-item"
            :style="{ '--i': i }"
          >
            <router-link class="z-blog-card__media" :to="`/blog/${post.slug}`">
              <img :src="post.image" :alt="post.title" />
              <span class="z-blog-tag">{{ post.category }}</span>
            </router-link>
            <div class="z-blog-card__body">
              <p class="z-blog-meta">
                <span>{{ post.date }}</span>
                <span aria-hidden="true">·</span>
                <span>{{ t('blog.minutes', { n: post.minutes }) }}</span>
              </p>
              <h3>
                <router-link :to="`/blog/${post.slug}`">{{ post.title }}</router-link>
              </h3>
              <p class="z-muted">{{ post.excerpt }}</p>
              <router-link class="z-blog-read" :to="`/blog/${post.slug}`">
                {{ t('blog.readMore') }}
                <i class="material-icons">arrow_forward</i>
              </router-link>
            </div>
          </article>
        </div>
      </div>

      <aside class="z-blog-aside">
        <div class="z-blog-aside__card">
          <h4>{{ t('blog.topics') }}</h4>
          <ul class="z-blog-aside__topics">
            <li>
              <button type="button" :class="{ 'is-active': topic === 'all' }" @click="topic = 'all'">
                <span>{{ t('shop.all') }}</span>
                <em>{{ posts.length }}</em>
              </button>
            </li>
            <li v-for="cat in categories" :key="cat">
              <button type="button" :class="{ 'is-active': topic === cat }" @click="topic = cat">
                <span>{{ cat }}</span>
                <em>{{ countByTopic(cat) }}</em>
              </button>
            </li>
          </ul>
        </div>
        <div class="z-blog-aside__card">
          <h4>{{ t('blog.latest') }}</h4>
          <ul class="z-blog-aside__latest">
            <li v-for="post in latest" :key="post.slug">
              <router-link :to="`/blog/${post.slug}`">
                <img :src="post.image" :alt="post.title" />
                <span>
                  <strong>{{ post.title }}</strong>
                  <small>{{ post.date }}</small>
                </span>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="z-blog-aside__promo">
          <p class="z-page-hero__kicker">{{ t('blog.promoKicker') }}</p>
          <h4>{{ t('blog.promoTitle') }}</h4>
          <p class="z-muted">{{ t('blog.promoSub') }}</p>
          <router-link class="z-btn z-btn-primary z-btn-sm" to="/shop">{{ t('home.shopNow') }}</router-link>
        </div>
      </aside>
    </div>

    <TrustStrip />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import StoreCrumbs from 'components/store/StoreCrumbs.vue';
import TrustStrip from 'components/home/TrustStrip.vue';
import SkeletonBlogCard from 'components/store/SkeletonBlogCard.vue';
import { blogCategories, blogPosts } from 'src/data/blog-posts';
import { useBootLoad } from 'src/composables/useBootLoad';

const { t } = useI18n();
const posts = blogPosts;
const categories = [...blogCategories];
const search = ref('');
const topic = ref('all');
const { booting } = useBootLoad(undefined, 400);

const filtered = computed(() => {
  let list = [...posts];
  if (topic.value !== 'all') list = list.filter((p) => p.category === topic.value);
  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }
  return list;
});

const featured = computed(() => filtered.value[0]);
const rest = computed(() => filtered.value.slice(1));
const latest = computed(() => posts.slice(0, 3));

function countByTopic(cat: string) {
  return posts.filter((p) => p.category === cat).length;
}

function resetFilters() {
  search.value = '';
  topic.value = 'all';
}
</script>
