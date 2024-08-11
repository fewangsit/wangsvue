<script setup lang="ts">
import Button from 'wangsvue/button';
import Card from 'wangsvue/card';
</script>

<template>
  <Card>
    <template #header> This is a Header using slot #header </template>
    <template #subtitle> #subtitle Lorem ipsum dolor sit amet. </template>
    <template #content>
      The content using slot #content. Lorem ipsum dolor sit amet consectetur
      adipisicing elit. Eveniet praesentium architecto quae hic vel, consequatur
      voluptate ea impedit, sit nostrum ratione blanditiis ex sapiente labore
      ullam? Iste atque aut ipsum.
    </template>
    <template #footer>
      <span>The #footer</span>
      <Button label="Cancel" text />
      <Button label="Apply" />
    </template>
  </Card>
</template>
