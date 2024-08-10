<script setup lang="ts">
import Button from '@/components/Button/Button.vue';

const severities = [undefined, 'secondary', 'success', 'warning', 'danger'];
</script>
<template>
  <div
    class="h-[1058px] p-16 bg-white rounded-[40px] flex-col justify-start items-start gap-10 inline-flex"
  >
    <div class="flex-col justify-start items-start gap-1 flex">
      <div
        class="text-[#6e7191] text-xs font-bold font-['Plus Jakarta Sans'] leading-3"
      >
        COMPONENTS
      </div>
      <div
        class="w-[342px] text-[#262627] text-3xl font-bold font-['Plus Jakarta Sans']"
      >
        Button
      </div>
    </div>

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
        <Button
          :key="style?.toString()"
          v-for="style of ['text', 'outlined', undefined]"
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
      </template>
    </div>
  </div>
</template>
