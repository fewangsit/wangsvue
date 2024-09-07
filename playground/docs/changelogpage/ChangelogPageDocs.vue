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
        module-id="66d809a4b23684578bc69c2b"
        object="Tim"
        use-button-download
      />
    </template>
  </Card>
</template>
