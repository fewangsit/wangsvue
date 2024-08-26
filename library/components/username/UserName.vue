<script setup lang="ts">
import { getNestedProperyValue } from 'lib/utils';
import { UserNameProps } from './UserName.vue.d';
import Image from '../image/Image.vue';

const props = withDefaults(defineProps<UserNameProps>(), {
  userNameField: 'nickName',
  userProfileField: 'profile',
});
</script>

<template>
  <span class="flex items-center gap-1">
    <Image
      :thumbnail="getNestedProperyValue(props.user, userProfileField) as string"
      class="w-[30px] h-[30px]"
      rounded
    />
    <span class="text-xs font-normal">
      {{ getNestedProperyValue(props.user, userNameField) }}
    </span>
  </span>
</template>
