<script setup lang="ts">
import { shallowRef } from 'vue';
import { Pbi } from 'lib/components/dialogdetailpbi/DialogDetailPbi.vue.d';
import { Project } from 'lib/types/project.type';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Button from 'lib/components/button/Button.vue';
import DialogDetailPbi from 'lib/components/dialogdetailpbi/DialogDetailPbi.vue';
import pbi from './pbi.json';
import project from './project.json';
import Toast from 'lib/components/toast/Toast.vue';

const showDialog = shallowRef<boolean>(false);
const showDialogNonEditable = shallowRef<boolean>(false);
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Dialog Detail PBI" /> </template>
    <template #content>
      <div class="flex gap-2">
        <Button
          @click="showDialog = true"
          icon="eye"
          label="Show Dialog (editable)"
          severity="secondary"
        />

        <Button
          @click="showDialogNonEditable = true"
          icon="eye"
          label="Show Dialog (non-editable)"
          severity="secondary"
        />

        <DialogDetailPbi
          v-model:visible="showDialog"
          :project="project as Project"
          :selected-pbi="pbi as Pbi"
        />

        <DialogDetailPbi
          v-model:visible="showDialogNonEditable"
          :editable="false"
          :project="project as Project"
          :selected-pbi="pbi as Pbi"
        />
      </div>
    </template>
  </Card>
  <Toast />
</template>
