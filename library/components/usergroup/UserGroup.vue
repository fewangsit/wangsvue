<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { UserGroupProps } from './UserGroup.vue.d';
import PrimeAvatar from 'primevue/avatar';
import PrimeAvatarGroup from 'primevue/avatargroup';
import UserName from '../username/UserName.vue';
import Dialog from '../dialog/Dialog.vue';

const props = withDefaults(defineProps<UserGroupProps>(), {
  userNameField: 'nickName',
  profilePictureField: 'profilePicture',
  dialogHeaderLabel: 'User List',
});

const Preset = inject<Record<string, any>>('preset', {}).badgegroup;

const dialogDetail = ref(false);

const showedUsers = computed(() => {
  return props.users.slice(0, props.limit); // When limit undefined, it will return full array
});

const totalRemainingUser = computed<number>(
  () => props.users.length - showedUsers.value.length,
);
</script>

<template>
  <template v-if="props.withDialogDetail">
    <span v-if="!props.users.length">-</span>
    <div v-else class="flex gap-2 items-center">
      <UserName
        :profile-picture-field="props.profilePictureField"
        :user="props.users[0]"
        :user-name-field="props.userNameField"
      />
      <span
        v-if="props.users.length > 1"
        @click="dialogDetail = true"
        class="cursor-pointer"
      >
        {{ `+${props.users.length - 1}` }}
      </span>
    </div>

    <Dialog
      v-model:visible="dialogDetail"
      :draggable="false"
      :header="props.dialogHeaderLabel"
      :pt="Preset.showmoredialog"
      modal
    >
      <div class="flex flex-wrap gap-3 items-center">
        <UserName
          :key="user._id"
          v-for="user in props.users"
          :profile-picture-field="props.profilePictureField"
          :user="user"
          :user-name-field="props.userNameField"
        />
      </div>
    </Dialog>
  </template>

  <template v-else>
    <PrimeAvatarGroup>
      <template :key="user" v-for="user in showedUsers">
        <PrimeAvatar shape="circle">
          <template #icon>
            <UserName
              :key="user._id"
              :profile-picture-field="props.profilePictureField"
              :user="{ ...user, nickName: undefined }"
              class="w-[29px] h-[29px]"
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
</template>
