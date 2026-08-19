<template>
  <div>
    <div
      v-if="expanded"
      class="sidebar-backdrop"
      @click="closeAll"
    />
    <div class="sidebar-left" :class="{ stick: stuck, 'is-expanded': expanded }">
      <a
        class="btn btn-open"
        href="#"
        :aria-expanded="expanded"
        aria-label="Toggle categories"
        @click.stop.prevent="toggleExpanded"
      />

      <ul class="menu-icons hidden">
        <li v-for="(icon, i) in sidebarIconOnly" :key="`icon-${i}`">
          <a href="#"><img :src="icon" alt="" /></a>
        </li>
      </ul>

      <ul class="menu-texts" :class="{ 'menu-close': !expanded }">
        <li
          v-for="cat in sidebarCategories"
          :key="cat.id"
          class="has-children"
          :class="{ 'submenu-open': expanded && openId === cat.id }"
          @mouseenter="onEnter(cat.id)"
          @mouseleave="onLeave"
        >
          <a
            href="#"
            :class="{ active: expanded && openId === cat.id }"
            @click.prevent="onCategoryClick(cat.id)"
          >
            <span class="img-link">
              <img :src="cat.icon" :alt="cat.name" />
            </span>
            <span class="text-link">{{ cat.name }}</span>
          </a>
          <ul class="sub-menu">
            <li v-for="child in cat.children" :key="child.slug">
              <router-link
                :to="{ path: '/shop', query: { category: child.slug } }"
                @click="closeAll"
              >
                {{ child.name }}
              </router-link>
            </li>
            <li>
              <router-link
                class="font-sm-bold"
                :to="{ path: '/shop', query: { category: cat.slug } }"
                @click="closeAll"
              >
                View all
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { sidebarCategories, sidebarIconOnly } from 'src/data/sidebar-nav';

const expanded = ref(false);
const openId = ref<string | null>(null);
const stuck = ref(false);
let leaveTimer: ReturnType<typeof setTimeout> | null = null;

function toggleExpanded() {
  expanded.value = !expanded.value;
  if (!expanded.value) openId.value = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onCategoryClick(id: string) {
  if (!expanded.value) {
    expanded.value = true;
    openId.value = id;
    return;
  }
  openId.value = openId.value === id ? null : id;
}

function closeAll() {
  expanded.value = false;
  openId.value = null;
}

function onEnter(id: string) {
  if (!expanded.value) return;
  if (leaveTimer) {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }
  openId.value = id;
}

function onLeave() {
  if (!expanded.value) return;
  leaveTimer = setTimeout(() => {
    openId.value = null;
  }, 220);
}

function onScroll() {
  stuck.value = window.scrollY > 100;
}

function onDocClick(e: MouseEvent) {
  const t = e.target as HTMLElement | null;
  if (!t) return;
  if (t.closest('.sidebar-left') || t.closest('.btn-open') || t.closest('.sidebar-backdrop')) return;
  if (expanded.value) closeAll();
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') closeAll();
}

watch(expanded, (v) => {
  document.body.classList.toggle('sidebar-menu-open', v);
});

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onKey);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  document.removeEventListener('click', onDocClick);
  document.removeEventListener('keydown', onKey);
  document.body.classList.remove('sidebar-menu-open');
  if (leaveTimer) clearTimeout(leaveTimer);
});
</script>

<style scoped>
.sidebar-left {
  z-index: 1050 !important;
}

:deep(.btn.btn-open) {
  z-index: 1300;
  position: fixed;
}

.menu-texts.menu-close .sub-menu {
  display: none !important;
}

.menu-icons.hidden {
  visibility: hidden;
  height: 0;
  overflow: hidden;
  padding: 0 !important;
  margin: 0;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(14, 34, 77, 0.25);
  z-index: 1040;
}
</style>
