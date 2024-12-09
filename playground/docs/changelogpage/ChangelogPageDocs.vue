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
      <ChangelogPage object="Tim" object-name-column="Tim" />
      <ChangelogPage
        module-id="670620dd3be0c0a2ed7edcc4"
        object="Module"
        use-button-download
      />
    </template>
  </Card>
</template>
