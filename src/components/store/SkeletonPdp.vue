<template>
  <div class="z-skel-pdp" aria-busy="true">
    <div class="z-skel-pdp__gallery">
      <div class="z-skel z-skel-pdp__main" />
      <div class="z-skel-pdp__thumbs">
        <div v-for="n in 4" :key="n" class="z-skel z-skel-pdp__thumb" />
      </div>
    </div>
    <div class="z-skel-pdp__buy">
      <div class="z-skel z-skel--md" style="width: 40%" />
      <div class="z-skel z-skel--lg" style="width: 85%; margin-top: 12px" />
      <div class="z-skel z-skel--md" style="width: 55%; margin-top: 10px" />
      <div class="z-skel z-skel--lg" style="width: 35%; height: 28px; margin-top: 16px" />
      <div class="z-skel z-skel--md" style="width: 100%; height: 56px; margin-top: 16px" />
      <div class="z-skel-pdp__swatches">
        <div v-for="n in 4" :key="n" class="z-skel z-skel-pdp__swatch" />
      </div>
      <div class="z-skel-pdp__actions">
        <div class="z-skel z-skel--btn" style="width: 100px" />
        <div class="z-skel z-skel--btn" style="flex: 1" />
        <div class="z-skel z-skel--btn" style="flex: 1" />
      </div>
    </div>
  </div>
</template>
