<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import CodeSnippet from 'lib/components/codesnippet/CodeSnippet.vue';
import { shallowRef } from 'vue';
import DocTitle from '../DocTitle.vue';

const codeSnippet = shallowRef<string>('const fullName = "Zain Kurnia";');
const codeSnippetJSON = shallowRef<string>(`{
  "_id": "6454c4253dd1017f28689572",
  "company": "65ea78abf45825785b68a2d7",
  "companyName": "PT V2",
  "companyCode": "000v2",
  "nickName": "Kur",
  "fullName": "Zain Kurnia",
  "userType": "Admin",
  "division": "RnD",
  "position": "Front End Developer",
  "isActive": true,
  "profilePicture": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/712020:50961b54-29e8-4a94-8982-6cb6735b6a98/7ae11d7d-18c4-43b7-a63f-fc33fa80efe3/512",
  "email": "zainkurnia@mailnesia.com",
  "phoneNumber": "+62 81234567890"
},`);

const codeSnippetTS = shallowRef<string>(`export interface CodeSnippetProps {
  code?: string;
  /**
   * @default 'javascript'
   */
  lang?: 'javascript' | 'typescript' | 'html' | 'json';
}
`);
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Code Snippet" />
    </template>
    <template #subtitle> Open Browser console to see inputted code! </template>
    <template #content>
      JavaScript
      <CodeSnippet
        v-model:code="codeSnippet"
        @update:code="console.log"
        lang="javascript"
      />
      TypeScript
      <CodeSnippet
        v-model:code="codeSnippetTS"
        @update:code="console.log"
        lang="typescript"
      />
      JSON and Readonly
      <CodeSnippet
        v-model:code="codeSnippetJSON"
        @update:code="console.log"
        readonly
      />
    </template>
  </Card>
</template>
