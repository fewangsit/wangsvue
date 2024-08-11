<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import DocTitle from '../DocTitle.vue';

const severities = [undefined, 'secondary', 'success', 'warning', 'danger'];
</script>
<template>
  <div
    class="h-[1058px] p-16 bg-white rounded-[40px] flex-col justify-start items-start gap-4 inline-flex"
  >
    <DocTitle name="Button" />

    <div
      class="grid grid-cols-3 gap-2 p-4 relative rounded-[5px] border border-[#9747ff]"
    >
      <Button
        disabled
        icon="checkbox-blank-circle-line"
        icon-pos="right"
        label="Disabled"
        text
      />
      <Button
        disabled
        icon="checkbox-blank-circle-line"
        icon-pos="right"
        label="Disabled"
        outlined
      />
      <Button
        disabled
        icon="checkbox-blank-circle-line"
        icon-pos="right"
        label="Disabled"
      />

      <template :key="severity" v-for="severity of severities">
        <div
          :key="style?.toString()"
          v-for="style of ['text', 'outlined', undefined]"
          class="flex gap-1"
        >
          <Button
            :label="
              severity
                ? `${severity?.[0].toUpperCase()}${severity?.slice(1)}`
                : 'Primary'
            "
            :outlined="style === 'outlined'"
            :severity="severity"
            :text="style === 'text'"
            icon="checkbox-blank-circle-line"
            icon-pos="right"
          />
          <Button
            :outlined="style === 'outlined'"
            :severity="severity"
            :text="style === 'text'"
            icon="checkbox-blank-circle-line"
            icon-pos="right"
          />
        </div>
      </template>
    </div>
  </div>
</template>
