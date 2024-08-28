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
  nickName: 'Kur',
  fullName: 'Zain Kurnia',
  userType: 'Admin',
  division: 'RnD',
  position: 'Front End Developer',
  isActive: true,
  profilePicture:
    'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/712020:50961b54-29e8-4a94-8982-6cb6735b6a98/7ae11d7d-18c4-43b7-a63f-fc33fa80efe3/512',
  email: 'zainkurnia@mailnesia.com',
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
        class="w-max flex flex-col h-auto p-4 relative bg-white rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <div class="flex gap-4">
          <UserName :user="user" user-name-field="fullName" />
          <UserName :user="user" type="icon" user-name-field="fullName" />
        </div>
      </div>
    </template>
  </Card>
</template>
