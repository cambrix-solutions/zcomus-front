<template>
  <div class="pb-50">
    <div class="section-box">
      <div class="breadcrumbs-div">
        <div class="container">
          <ul class="breadcrumb">
            <li><router-link class="font-xs color-gray-1000" to="/">Home</router-link></li>
            <li><router-link class="font-xs color-gray-500" to="/blog">Blog</router-link></li>
            <li><span class="font-xs color-gray-500">{{ post.title }}</span></li>
          </ul>
        </div>
      </div>
    </div>

    <section class="section-box shop-template">
      <div class="container col-lg-8 mx-auto">
        <span class="font-xs color-gray-500">{{ post.date }}</span>
        <h2 class="color-gray-1000 mt-10 mb-20">{{ post.title }}</h2>
        <img :src="post.image" :alt="post.title" class="img-fluid mb-30" style="border-radius: 8px" />
        <div class="font-md color-gray-900" style="line-height: 1.8">
          <p>{{ post.excerpt }}</p>
          <p class="mt-20">{{ post.body }}</p>
        </div>
        <div class="mt-40 d-flex gap-2 flex-wrap">
          <router-link class="btn btn-border" to="/blog">Back to blog</router-link>
          <router-link class="btn btn-buy" to="/shop">Shop now</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getBlogPost } from 'src/data/blog-posts';
import { ecom } from 'src/helper/ecomAssets';

const route = useRoute();

const post = computed(() => {
  const slug = String(route.params.slug);
  const found = getBlogPost(slug);
  if (found) return found;
  return {
    slug,
    title: slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    excerpt: 'Article preview',
    date: 'Aug 10, 2026',
    image: ecom('imgs/page/homepage1/imgsp2.png'),
    body: 'Full article content goes here.',
  };
});
</script>
