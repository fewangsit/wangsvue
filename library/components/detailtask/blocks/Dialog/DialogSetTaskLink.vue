<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import InputText from 'lib/components/inputtext/InputText.vue';
import InputURL from 'lib/components/inputurl/InputURL.vue';
import { MenuItem } from 'lib/components/menuitem';
import TabMenu from 'lib/components/tabmenu/TabMenu.vue';
import eventBus from 'lib/event-bus';
import { useToast } from 'lib/utils';
import { computed, inject, Ref, ref } from 'vue';

const toast = useToast();

const taskId = inject<Ref<string>>('taskId');

const visible = defineModel<boolean>('visible', { required: true });

const dialogForm = ref();

const linkMenuIndex = ref<number>(0);
const linkMenu = computed<MenuItem[]>(() => [
  {
    label: 'URL',
  },
  {
    label: 'Embed',
  },
]);

// TODO: Handle submit link task
const handleSubmit = async (): Promise<void> => {
  try {
    eventBus.emit('detail-task:update', { taskId: taskId.value });
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Link Task gagal disimpan.',
      severity: 'error',
      error,
    });
  }
};

const handleClick = (): void => {
  dialogForm.value.form.submit();
};

const reset = (): void => {
  linkMenuIndex.value = 0;
};
</script>

<template>
  <DialogForm
    ref="dialogForm"
    v-model:visible="visible"
    :buttons-template="[]"
    @hide="reset"
    @submit="handleSubmit"
    closable
    data-wv-name="dialog-set-task-link"
    header="Link Task"
  >
    <template #fields>
      <TabMenu v-model:active-index="linkMenuIndex" :menu="linkMenu" />
      <div>
        <div v-if="linkMenuIndex === 0" data-wv-section="url-tab">
          <InputURL
            :validator-message="{
              empty: 'URL proses harus diisi.',
            }"
            label="URL"
            mandatory
            placeholder="Tulis URL"
            use-validator
          />
        </div>
        <div v-if="linkMenuIndex === 1" data-wv-section="code-embed-tab">
          <InputText
            :validator-message="{
              empty: 'Code embeded harus diisi.',
            }"
            label="Code Embed"
            mandatory
            placeholder="Paste kode embed"
            use-validator
          />
        </div>
      </div>
      <div class="flex justify-end">
        <Button @click="handleClick" label="Simpan" severity="secondary" />
      </div>
    </template>
  </DialogForm>
</template>
