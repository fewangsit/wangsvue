<script setup lang="ts">
import { computed } from 'vue';
import { getNestedProperyValue } from 'lib/utils';
import { UserGroupProps } from './UserGroup.vue.d';
import PrimeAvatar from 'primevue/avatar';
import PrimeAvatarGroup from 'primevue/avatargroup';
import Image from '../image/Image.vue';

const props = withDefaults(defineProps<UserGroupProps>(), {
  userNameField: 'nickName',
  profilePictureField: 'profilePicture',
});

const showedUsers = computed(() => {
  return props.users.slice(0, props.limit); // When limit undefined, it will return full array
});

const totalRemainingUser = computed<number>(
  () => props.users.length - showedUsers.value.length,
);
</script>

<template>
  <PrimeAvatarGroup>
    <template :key="user" v-for="user in showedUsers">
      <PrimeAvatar shape="circle">
        <template #icon>
          <Image
            :src="
              getNestedProperyValue(user ?? {}, profilePictureField) as string
            "
            class="w-[29px] h-[29px]"
            rounded
          />
        </template>
      </PrimeAvatar>
    </template>
    <PrimeAvatar
      v-if="totalRemainingUser"
      :label="`+${totalRemainingUser}`"
      shape="circle"
    />
  </PrimeAvatarGroup>
</template>
