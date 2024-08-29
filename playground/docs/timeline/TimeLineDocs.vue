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
  {
    _id: '2',
    date: '22/03/22 13:00:01',
    user,
    action: 'Edit Deskripsi',
    detail: {
      Sebelum: 'Buat tampilan halaman login yang user-friendly dan responsive',
      Sesudah:
        'Buat tampilan halaman login yang user friendly dan responsive, Buat tampilan halaman login yang user friendly dan responsive, Buat tampilan halaman login yang user friendly dan responsive',
    },
  },
  {
    _id: '2',
    date: '22/03/22 13:00:01',
    user,
    action: 'Tambah Deskripsi',
    detail: 'Buat tampilan halaman login yang user-friendly dan responsive',
  },
  {
    _id: '7',
    date: '22/03/22 13:00:01',
    user,
    action: 'Tambah attachment URL',
    detail: {
      type: 'link',
      url: 'https://www.figma.com/design/w5wCvgBfDUd0uLM68teipd/Library-Web?t=vgIAzJQ0Ho7MIyog-0',
    },
  },
]);

onMounted(() => {
  setTimeout(() => {
    eventLogs.value = [
      ...eventLogs.value,
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
        },
      },
      {
        _id: '10',
        date: '22/03/22 13:00:01',
        user,
        action: 'Tambah attachment gambar',
        detail: {
          type: 'image',
          filePath:
            'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/712020:50961b54-29e8-4a94-8982-6cb6735b6a98/7ae11d7d-18c4-43b7-a63f-fc33fa80efe3/512',
        },
      },
      {
        _id: '10',
        date: '22/03/22 13:00:01',
        user,
        action: 'Tambah attachment file',
        detail: {
          type: 'pdf',
          filePath: 'https://example.com/path/to/Document.pdf',
        },
      },
      {
        _id: '10',
        date: '22/03/22 13:00:01',
        user,
        action: 'Tambah attachment file',
        detail: {
          type: 'xls',
          filePath: 'https://example.com/path/to/Document.xlsx',
        },
      },
      {
        _id: '13',
        date: '22/03/22 13:00:01',
        user,
        action: 'Tambah attachment file',
        detail: {
          type: 'csv',
          filePath: 'https://example.com/path/to/Document.csv',
        },
      },
      {
        _id: '13',
        date: '22/03/22 13:00:01',
        user,
        action: 'Tambah attachment file',
        detail: {
          type: 'doc',
          filePath: 'https://example.com/path/to/Document.doc',
        },
      },
      {
        _id: '13',
        date: '22/03/22 13:00:01',
        user,
        action: 'Tambah attachment file',
        detail: {
          type: 'data',
          filePath: 'https://example.com/path/to/Data.apk',
        },
      },
      {
        _id: '15',
        date: '22/03/22 13:00:01',
        user,
        action: 'Tambah link task',
        detail: {
          type: 'taskUrl',
          url: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FGPuAClv4vhxSn7zwkLMKcb%2FWorkspace-Task%252C-Tiket%252C-Notif%3Fnode-id%3D4-176225%26t%3DM3SctM8ILgQclLlF-1',
        },
      },
      {
        _id: '15',
        date: '22/03/22 13:00:01',
        user,
        action: 'Edit link task',
        detail: {
          Sebelum: {
            type: 'taskUrl',
            url: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FGPuAClv4vhxSn7zwkLMKcb%2FWorkspace-Task%252C-Tiket%252C-Notif%3Fnode-id%3D4-176225%26t%3DM3SctM8ILgQclLlF-1',
          },
          Sesudah: {
            type: 'taskUrl',
            url: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FGPuAClv4vhxSn7zwkLMKcb%2FWorkspace-Task%252C-Tiket%252C-Notif%3Fnode-id%3D4-176225%26t%3DM3SctM8ILgQclLlF-1',
          },
        },
      },
      {
        _id: '17',
        date: '22/03/22 13:00:01',
        user,
        action: 'Tambah embed',
        detail: {
          type: 'embed',
          code: `
<iframe
  style="border: 1px solid rgba(0, 0, 0, 0.1)"
  width="800"
  height="450"
  src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FGPuAClv4vhxSn7zwkLMKcb%2FWorkspace-Task%252C-Tiket%252C-Notif%3Fnode-id%3D4-176225%26t%3DM3SctM8ILgQclLlF-1"
  allowfullscreen
/>
          `,
        },
      },
      {
        _id: '17',
        date: '22/03/22 13:00:01',
        user,
        action: 'Edit embed',
        detail: {
          Sebelum: {
            type: 'embed',
            code: `
<iframe
  style="border: 1px solid rgba(0, 0, 0, 0.1)"
  width="800"
  height="450"
  src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FGPuAClv4vhxSn7zwkLMKcb%2FWorkspace-Task%252C-Tiket%252C-Notif%3Fnode-id%3D4-176225%26t%3DM3SctM8ILgQclLlF-1"
  allowfullscreen
/>
          `,
          },
          Sesudah: {
            type: 'embed',
            code: `
<iframe
  style="border: 1px solid rgba(0, 0, 0, 0.1)"
  width="800"
  height="450"
  src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FGPuAClv4vhxSn7zwkLMKcb%2FWorkspace-Task%252C-Tiket%252C-Notif%3Fnode-id%3D4-176225%26t%3DM3SctM8ILgQclLlF-1"
  allowfullscreen
/>
          `,
          },
        },
      },
      {
        _id: '17',
        date: '22/03/22 13:00:01',
        user,
        action: 'Edit embed to link',
        detail: {
          Sebelum: {
            type: 'embed',
            code: `
<iframe
  style="border: 1px solid rgba(0, 0, 0, 0.1)"
  width="800"
  height="450"
  src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FGPuAClv4vhxSn7zwkLMKcb%2FWorkspace-Task%252C-Tiket%252C-Notif%3Fnode-id%3D4-176225%26t%3DM3SctM8ILgQclLlF-1"
  allowfullscreen
/>
          `,
          },
          Sesudah: {
            type: 'taskUrl',
            url: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FGPuAClv4vhxSn7zwkLMKcb%2FWorkspace-Task%252C-Tiket%252C-Notif%3Fnode-id%3D4-176225%26t%3DM3SctM8ILgQclLlF-1',
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
export interface AttachmentFile {
  type: 'image' | 'xls' | 'doc' | 'pdf' | 'csv' | 'video' | 'data';
  filePath?: string;
}

export interface AttachmentLink {
  type: 'link';
  url?: string;
}

export interface LinkTaskURL {
  type: 'taskUrl';
  url: string;
}

export interface LinkTaskIframeEmbed {
  type: 'embed';
  code: string;
}

export type Attachment =
  | AttachmentLink
  | AttachmentFile
  | LinkTaskIframeEmbed
  | LinkTaskURL;

export type LinkTaskEditAction = Record&lt;
  'Sebelum' | 'Sesudah',
  LinkTaskURL | LinkTaskIframeEmbed
&gt;;

export type KeyValue = Record&lt;string, string&gt;;

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
  detail?: string | KeyValue | Attachment | LinkTaskEditAction;
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
