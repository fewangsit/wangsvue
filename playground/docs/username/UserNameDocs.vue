<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import UserName from 'lib/components/username/UserName.vue';
import { ref } from 'vue';

const user = ref({
  _id: '6454c4253dd1017f28689572',
  company: '65ea78abf45825785b68a2d7',
  companyName: 'PT V2',
  companyCode: '000v2',
  firstName: 'ASDF Tag',
  lastName: 'Samurai V2',
  nickName: 'Samurai',
  fullName: 'ASDF Tag Samurai V2',
  userType: 'Admin',
  isActive: true,
  profilePictureMedium: '/000v2/users/1722931142061-medium.webp',
  profilePictureBig: '/000v2/users/1722931142061-big.webp',
  profilePictureSmall: '/000v2/users/1722931142061-small.webp',
  email: 'userv2@mailnesia.com',
  phoneNumber: '+62 81234567890',
});
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="UserName" />
    </template>
    <template #content>
      <div
        class="w-[137px] flex flex-col gap-3 h-auto p-4 relative bg-white rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <div class="flex gap-0.5">
          <UserName :user="user" />
        </div>
      </div>
    </template>
  </Card>
</template>
