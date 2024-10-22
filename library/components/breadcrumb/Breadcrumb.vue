<script lang="ts" setup>
import { computed, inject } from 'vue';
import { navigateToUrl } from 'single-spa';
import { BreadcrumbProps } from './Breadcrumb.vue.d';

const props = defineProps<BreadcrumbProps>();
const Preset = inject<Record<string, any>>('preset', {}).breadcrumb;
const lastIndex = computed(() => props.menus.length - 1);
</script>

<template>
  <div v-bind="Preset.root">
    <template :key="menu.route" v-for="(menu, index) in props.menus">
      <span
        v-bind="
          Preset.item({
            context: {
              firstItem: index == 0,
              lastItem: index == lastIndex,
              hasRoute: !!menu.route,
            },
          })
        "
      >
        <a
          v-if="menu.route"
          :href="menu.route"
          :title="menu.title"
          v-bind="Preset.itemlink"
          @click="navigateToUrl(menu.route!)"
        >
          {{ menu.name }}
        </a>

        <template v-else>
          {{ menu.name }}
        </template>
      </span>

      <span
        v-if="index != lastIndex"
        v-text="Preset.separator.content"
        v-bind="Preset.separator"
      />
    </template>
  </div>
</template>
