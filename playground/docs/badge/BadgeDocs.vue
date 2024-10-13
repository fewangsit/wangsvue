<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Badge from 'lib/components/badge/Badge.vue';
import BadgeGroup from 'lib/components/badgegroup/BadgeGroup.vue';
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Badge" />
    </template>
    <template #content>
      <div
        class="w-[588px] flex flex-col gap-3 h-auto py-4 px-1 relative bg-white rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <div class="flex gap-0.5">
          <Badge format="nowrap" label="Unverified" removable />
          <Badge
            format="nowrap"
            label="Unverified"
            removable
            severity="success"
          />
          <Badge
            format="nowrap"
            label="Unverified"
            removable
            severity="warning"
          />
          <Badge
            format="nowrap"
            label="Unverified"
            removable
            severity="danger"
          />
          <Badge format="nowrap" label="Unverified" removable severity="dark" />
          <Badge disabled format="nowrap" label="Unverified" removable />
        </div>
        <BadgeGroup
          :labels="[
            'June Nicolas',
            'Tiffany Glover',
            'Lori Richie',
            'Rodney Fadel',
          ]"
          :limit="2"
          format="username"
          severity="primary"
        />
      </div>
    </template>
  </Card>
</template>
