<template>
  <div class="pb-50">
    <div class="section-box">
      <div class="breadcrumbs-div">
        <div class="container">
          <ul class="breadcrumb">
            <li><router-link class="font-xs color-gray-1000" to="/">Home</router-link></li>
            <li><span class="font-xs color-gray-500">{{ title }}</span></li>
          </ul>
        </div>
      </div>
    </div>

    <section class="section-box shop-template">
      <div class="container">
        <div class="head-main mb-30">
          <h3 class="mb-5">{{ title }}</h3>
          <p class="font-base color-gray-500">Latest news &amp; events</p>
          <div class="d-flex flex-wrap gap-2 mt-15">
            <router-link class="btn btn-border btn-sm" to="/blog">No sidebar</router-link>
            <router-link class="btn btn-border btn-sm" to="/blog/alt">Right sidebar</router-link>
            <router-link class="btn btn-border btn-sm" to="/blog/list">List</router-link>
            <router-link class="btn btn-border btn-sm" to="/blog/big">Big</router-link>
          </div>
        </div>

        <div class="row" :class="{ 'flex-row-reverse': sidebar === 'right' }">
          <div :class="sidebar === 'none' ? 'col-12' : 'col-lg-8'">
            <div class="row">
              <div
                v-for="post in posts"
                :key="post.slug"
                :class="big ? 'col-12 mb-30' : 'col-md-6 mb-30'"
              >
                <article class="card-grid-style-3">
                  <div class="card-grid-inner">
                    <div class="image-box">
                      <router-link :to="`/blog/${post.slug}`">
                        <img
                          :src="post.image"
                          :alt="post.title"
                          :style="big ? 'width:100%;max-height:320px;object-fit:cover' : ''"
                        />
                      </router-link>
                    </div>
                    <div class="info-right mt-15">
                      <span class="font-xs color-gray-500">{{ post.date }}</span>
                      <h5 class="mt-5">
                        <router-link class="color-brand-3" :to="`/blog/${post.slug}`">
                          {{ post.title }}
                        </router-link>
                      </h5>
                      <p class="font-sm color-gray-500">{{ post.excerpt }}</p>
                      <router-link class="btn btn-link-orange font-sm" :to="`/blog/${post.slug}`">
                        Read more
                      </router-link>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <aside v-if="sidebar !== 'none'" class="col-lg-4 mb-30">
            <div class="sidebar-border p-3 mb-30">
              <h5 class="mb-15">Categories</h5>
              <ul class="menu-footer">
                <li><router-link to="/blog">All posts</router-link></li>
                <li><router-link to="/shop">Shopping tips</router-link></li>
                <li><router-link to="/vendors">Vendors</router-link></li>
              </ul>
            </div>
            <div class="sidebar-border p-3">
              <h5 class="mb-15">Recent</h5>
              <ul class="menu-footer">
                <li v-for="p in posts.slice(0, 3)" :key="p.slug">
                  <router-link :to="`/blog/${p.slug}`">{{ p.title }}</router-link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { blogPosts } from 'src/data/blog-posts';

withDefaults(
  defineProps<{
    title?: string;
    sidebar?: 'left' | 'right' | 'none';
    big?: boolean;
  }>(),
  { title: 'Blog', sidebar: 'none', big: false },
);

const posts = blogPosts;
</script>
