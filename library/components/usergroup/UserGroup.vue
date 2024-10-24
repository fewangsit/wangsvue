<script setup lang="ts">
import { computed } from 'vue';
import { getImageURL, getNestedProperyValue } from 'lib/utils';
import { UserGroupProps } from './UserGroup.vue.d';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';

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
  <span
    class="flex items-center gap-1 ml-4"
    data-wv-name="usergroup"
    data-wv-section="root"
  >
    <AvatarGroup>
      <template :key="user" v-for="user in showedUsers">
        <Avatar
          :image="
            getImageURL(
              getNestedProperyValue(user ?? {}, profilePictureField) as string,
            )
          "
          shape="circle"
        />
      </template>
      <Avatar
        v-if="totalRemainingUser"
        :label="`+${totalRemainingUser}`"
        shape="circle"
      />
    </AvatarGroup>
  </span>
</template>
