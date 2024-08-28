<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Editor from 'lib/components/editor/Editor.vue';
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Editor" />
    </template>
    <template #content>
      <Editor />
    </template>
  </Card>
</template>
