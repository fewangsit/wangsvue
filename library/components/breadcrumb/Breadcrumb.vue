<script lang="ts" setup>
import { computed } from 'vue';
import { navigateToUrl } from 'single-spa';
import { BreadcrumbProps } from './Breadcrumb.vue.d';

const props = defineProps<BreadcrumbProps>();
const lastIndex = computed(() => props.menus.length - 1);
</script>

<template>
  <div
    :class="[
      'flex gap-[5px] items-center text-left h-[21px]',
      'text-grayscale-900 ',
      'text-xs font-normal leading-none',
    ]"
    data-wv-name="breadcrumb"
  >
    <template :key="index" v-for="(menu, index) in props.menus">
      <span
        :class="{
          'font-semibold': index == lastIndex,
          'text-primary-400': index && index < lastIndex,
        }"
        data-wv-section="breadcrumb-menu"
      >
        <a
          v-if="menu.route"
          :href="menu.route"
          :title="menu.title"
          @click="navigateToUrl(menu.route!)"
          class="cursor-pointer text-primary"
          data-wv-section="breadcrumb-menu-link"
        >
          {{ menu.name }}
        </a>

        <template v-else>
          {{ menu.name }}
        </template>
      </span>

      <span
        v-if="index != lastIndex"
        v-text="'>'"
        data-wv-section="breadcrumb-separator"
      />
    </template>
  </div>
</template>
