<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import { TimelineItem } from 'lib/components/timeline/Timeline.vue.d';
import Timeline from 'lib/components/timeline/Timeline.vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import eventLogs from './timeline.json';
import Button from 'lib/components/button/Button.vue';

const downloadUrl = shallowRef('');
const filename = 'eventLogs.json';

onMounted(() => {
  const blob = new Blob([JSON.stringify(eventLogs, null, 2)], {
    type: 'application/json',
  });

  downloadUrl.value = URL.createObjectURL(blob);
});
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Timeline - Event Log" />
    </template>
    <template #content>
      <Timeline :value="eventLogs as TimelineItem[]" />
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

export interface DetailText {
  type: 'text';
  value: string;
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
  detail?: string | KeyValue | Attachment | LinkTaskEditAction | DetailText;
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
              Untuk event logs khusus kaya Attachment dan Link Task, sesuaikan
              dengan interface diatas atau seperti contoh ini:
            </p>

            <Button class="p-3 px-4 mt-6" severity="secondary">
              <a
                :download="filename"
                :href="downloadUrl"
                class="font-medium text-md"
              >
                Download Contoh JSON Data
              </a>
            </Button>
          </li>
        </ul>
      </div>
    </template>
  </Card>
</template>
