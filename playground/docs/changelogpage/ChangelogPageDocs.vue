<script setup lang="ts">
import ChangelogPage from 'lib/components/changelogpage/ChangelogPage.vue';
import Card from 'lib/components/card/Card.vue';
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="ChangelogPage" />
    </template>
    <template #content>
      <ChangelogPage object="Tim" />
    </template>
  </Card>
</template>
