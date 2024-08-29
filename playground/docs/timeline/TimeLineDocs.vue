<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import Timeline from 'lib/components/timeline/Timeline.vue';
import { TimelineItem } from 'lib/components/timeline/Timeline.vue.d';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';

const user = {
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
};

const eventLogs = shallowRef<TimelineItem[]>([
  {
    _id: '1',
    date: '22/03/22 13:00:01',
    user,
    action: 'PBI Selesai',
  },
]);

onMounted(() => {
  setTimeout(() => {
    eventLogs.value = [
      {
        _id: '1',
        date: '22/03/22 13:00:01',
        user,
        action: 'Sub Modul `Pending E2E Testing`',
      },
      {
        _id: '1',
        date: '22/03/22 13:00:01',
        user,
        action:
          'Task `Create API`. `Transfer`. `Prelist`. `Prelist-detail` dibuat',
      },
      {
        _id: '2',
        date: '22/03/22 13:00:01',
        user,
        action: 'PBI Sprint',
        detail: {
          'Sprint': 'Sprint 4',
          'Timeline Sprint': '16 Agu 24 - 20 Sep 24',
          'Profile Picture': {
            type: 'image',
            path: 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/712020:50961b54-29e8-4a94-8982-6cb6735b6a98/7ae11d7d-18c4-43b7-a63f-fc33fa80efe3/512',
          },
        },
      },
    ];
  }, 1000);
});
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Timeline - Event Log" />
    </template>
    <template #content>
      <Timeline :value="eventLogs" />
    </template>
    <template #footer>
      <div class="flex flex-col gap-2 pt-5">
        <span>Catatan untuk BE developer:</span>
        <ul class="list-disc pl-4 [&_p]:pt-1 [&_li]:mb-2">
          <li>
            <strong>Interface</strong>

            <pre>
export interface DetailValueImage {
  type: 'image';
  path?: string;
}

export type DetailValue = string | DetailValueImage;

export type TimelineItem = {
  _id: string;
  action: string;
  date: string;
  user: {
    _id: string;
    fullName: string;
    profilePicture: string;
    nickName: string;
    division: string;
    position: string;
    email: string;
  }; 
  detail?: Record&lt;string, DetailValue&gt;;
};
            </pre>
          </li>
          <li>
            <strong>Value Action samakan persis dengan Figma</strong>
            <p>Contoh action:</p>
            <p>
              Figma: Task Create API. Transfer. Prelist. Prelist-detail dibuat
            </p>
            <p>
              Response: Task `Create API`. `Transfer`. `Prelist`.
              `Prelist-detail` dibuat
            </p>

            <p class="mt-1">
              Kalau ada text yang bold di Figma, bungkus pake backtick jadi
              `Text Bold`. Di FE auto ke format jadi Bold.
            </p>
          </li>

          <li><strong>Kalau tidak ada value, jadikan null</strong></li>
          <li>
            <strong>Key di dalam detail object samakan dengan Figma</strong>
            <p>Contoh object detail:</p>
            <pre>
  {
    detail: {
      'Sprint': 'Sprint 4',
      'Timeline Sprint': '16 Agu 24 - 20 Sep 24',
      'Profile Picture': {
        type: 'image',
        path: 'avatar.png',
      },
    },
  }
            </pre>

            <p class="mt-1">
              Untuk tipe-tipe khusus kaya image, valuenya berupa object dengan
              property type buat nentuin tipenya. Sekarang baru ada Image.
            </p>
          </li>
        </ul>
      </div>
    </template>
  </Card>
</template>
