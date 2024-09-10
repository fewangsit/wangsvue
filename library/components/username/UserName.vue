<script setup lang="ts">
import { nextTick } from 'vue';
import { getNestedProperyValue } from 'lib/utils';
import { UserNameProps } from './UserName.vue.d';
import Image from '../image/Image.vue';
import Icon from '../icon/Icon.vue';
import OverlayPanel from 'primevue/overlaypanel';

const props = withDefaults(defineProps<UserNameProps>(), {
  type: 'picture',
  userNameField: 'nickName',
  profilePictureField: 'profilePicture',
});

const overlayId = +new Date();

const adjustPosition = (): void => {
  const overlay = document.getElementById(overlayId.toString());

  if (overlay) {
    nextTick(() => {
      overlay.style.top = 'revert-layer';
      overlay.style.bottom = '0';
      overlay.style.translate = '-25%';
    });
  }
};
</script>

<template>
  <span
    @click="($refs['miniProfile'] as OverlayPanel).toggle"
    class="flex items-center gap-1"
    data-wv-name="username"
    data-wv-section="root"
  >
    <Image
      v-if="type == 'picture'"
      :src="
        getNestedProperyValue(props.user ?? {}, profilePictureField) as string
      "
      @click.stop=""
      class="w-[30px] h-[30px]"
      rounded
    />

    <Icon v-else class="text-general-300 text-base" icon="user" />

    <span
      :class="[
        'text-xs font-normal cursor-pointer',
        { 'text-primary-400 cursor-pointer': props.type === 'icon' },
        { 'text-general-800': props.type !== 'icon' },
      ]"
    >
      {{ getNestedProperyValue(props.user ?? {}, userNameField) }}
    </span>

    <OverlayPanel :id="overlayId" ref="miniProfile" @show="adjustPosition">
      <div
        class="relative overflow-hidden flex flex-col gap-2 w-[200px] h-max items-center justify-center p-3 rounded-[10px] border border-grayscale-900 text-grayscale-900"
      >
        <div class="bg-primary-100 absolute top-0 h-[42px] w-full" />

        <Image
          :src="props.user?.profilePicture"
          class="w-[60px] h-[60px]"
          rounded
        />

        <div class="flex flex-col gap-0.5 items-center justify-center">
          <h4 class="font-semibold text-[10px] leading-[15px]">
            {{ props.user?.fullName }} ({{ props.user?.nickName }})
          </h4>

          <span class="text-[8px] font-normal leading-3">
            {{ props.user?.email }}
          </span>
        </div>

        <span class="text-[8px] font-normal leading-3">
          {{ props.user?.division }}
          /
          {{ props.user?.position }}
        </span>

        <a
          :href="`/user/${props.user?._id}`"
          alt="link to user detail"
          class="underline text-primary-400 text-[10px] leading-4 cursor-pointer hover:text-primary-500 transition-colors duration-100"
          target="_blank"
        >
          Detail Member
        </a>
      </div>
    </OverlayPanel>
  </span>
</template>
