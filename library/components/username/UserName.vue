<script setup lang="ts">
import { nextTick, shallowRef } from 'vue';
import { getNestedProperyValue } from 'lib/utils';
import { UserNameProps } from './UserName.vue.d';
import Image from '../image/Image.vue';
import Icon from '../icon/Icon.vue';
import OverlayPanel from 'primevue/overlaypanel';
import MemberServices, { Member } from 'lib/services/member.service';
import Skeleton from 'primevue/skeleton';

const props = withDefaults(defineProps<UserNameProps>(), {
  type: 'picture',
  userNameField: 'nickName',
  profilePictureField: 'profilePicture',
  emptyable: false,
});

const overlayId = +new Date();
const loadingUser = shallowRef<boolean>(false);
const fullUserObject = shallowRef<Member>();

const adjustPosition = async (): Promise<void> => {
  const overlay = document.getElementById(overlayId.toString());

  if (overlay) {
    await nextTick(() => {
      overlay.style.top = 'revert-layer';
      overlay.style.bottom = '0';
      overlay.style.translate = '-25%';
    });
  }

  if (!fullUserObject.value) {
    try {
      loadingUser.value = true;
      const { data } = await MemberServices.getMemberDetail(props.user?._id);

      fullUserObject.value = data.data;
    } catch (error) {
      console.error(error);
    } finally {
      loadingUser.value = false;
    }
  }
};
</script>

<template>
  <span v-if="props.emptyable && Object.keys(props.user).length < 2">-</span>
  <span
    v-else
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
      :width="30"
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
          :src="
            fullUserObject?.profilePicture ?? fullUserObject?.profilePictureBig
          "
          class="w-[60px] h-[60px]"
          rounded
        />

        <div
          v-if="!loadingUser"
          class="flex flex-col gap-0.5 items-center justify-center"
        >
          <h4
            class="font-semibold text-[10px] leading-[15px] text-center text-balance"
          >
            {{ fullUserObject?.fullName }} ({{ fullUserObject?.nickName }})
          </h4>

          <span class="text-[8px] font-normal leading-3">
            {{ fullUserObject?.email }}
          </span>
        </div>
        <Skeleton v-else height="29px" width="100px" />

        <span v-if="!loadingUser" class="text-[8px] font-normal leading-3">
          {{ fullUserObject?.division }}
          /
          {{ fullUserObject?.position }}
        </span>

        <Skeleton v-else height="12px" width="60px" />

        <a
          v-if="!loadingUser"
          :href="`/user/${fullUserObject?._id}`"
          class="underline text-primary-400 text-[10px] leading-4 cursor-pointer hover:text-primary-500 transition-colors duration-100"
          target="_blank"
          title="link to user detail"
        >
          Detail Member
        </a>

        <Skeleton v-else width="75px" />
      </div>
    </OverlayPanel>
  </span>
</template>
