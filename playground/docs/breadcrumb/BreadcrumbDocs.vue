<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Breadcrumb from 'lib/components/breadcrumb/Breadcrumb.vue';
import type { BreadcrumbMenu } from 'lib/components/breadcrumb/Breadcrumb.vue.d';
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Breadcrumb" /> </template>
    <template #content>
      <div
        class="flex flex-col gap-1 w-full h-max relative rounded-[5px] p-6 border border-[#9747ff] border-dashed"
      >
        <template :key="index" v-for="(_, index) of Array.from({ length: 8 })">
          <Breadcrumb
            :menus="
              Array.from<BreadcrumbMenu>({ length: index + 1 }).fill({
                name: 'Page',
                route: 'breadcrumb',
              })
            "
          />
        </template>
      </div>
    </template>
  </Card>
</template>
