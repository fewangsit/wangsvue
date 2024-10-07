<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import { FormPayload } from 'lib/components/form/Form.vue.d';
import InputText from 'lib/components/inputtext/InputText.vue';
import InputURL from 'lib/components/inputurl/InputURL.vue';
import { MenuItem } from 'lib/components/menuitem';
import TabMenu from 'lib/components/tabmenu/TabMenu.vue';
import { EditTaskLinkDTO } from 'lib/dto/task.dto';
import eventBus from 'lib/event-bus';
import TaskServices from 'lib/services/task.service';
import { TaskLink, TaskLinkURLType } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import { computed, inject, Ref, ref } from 'vue';

const toast = useToast();

const taskId = inject<Ref<string>>('taskId');

const props = withDefaults(
  defineProps<{
    type: 'link' | 'repositori' | 'microservices';
    initialValue: TaskLink;
  }>(),
  {
    type: 'link',
  },
);

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

const dialogHeader = computed(() => {
  switch (props.type) {
    case 'repositori':
      return 'Link Repositori';
    case 'microservices':
      return 'Link Micro Services';
    default:
      return 'Link Task';
  }
});

const getLinkType = (): TaskLinkURLType => {
  if (props.type === 'link') {
    return linkMenuIndex.value === 0 ? 'url' : 'embedded';
  }

  return 'url';
};

const handleSubmit = async (payload: FormPayload): Promise<void> => {
  try {
    if (!taskId.value) return;

    const dataDTO: EditTaskLinkDTO = {
      link: payload.formValues.link as unknown as string,
      linkType: getLinkType(),
      type: props.type === 'microservices' ? 'service' : 'task',
    };

    await TaskServices.putTaskLink(taskId.value, dataDTO);

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
    :header="dialogHeader"
    @hide="reset"
    @submit="handleSubmit"
    closable
    data-wv-name="dialog-set-task-link"
  >
    <template #fields>
      <template v-if="props.type === 'link'">
        <TabMenu v-model:active-index="linkMenuIndex" :menu="linkMenu" />
        <div>
          <div v-if="linkMenuIndex === 0" data-wv-section="url-tab">
            <InputURL
              :validator-message="{
                empty: 'URL proses harus diisi.',
              }"
              :value="
                props.initialValue?.linkType === 'url'
                  ? props.initialValue.link
                  : undefined
              "
              field-name="link"
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
              :value="
                props.initialValue?.linkType === 'embedded'
                  ? props.initialValue.link
                  : undefined
              "
              field-name="link"
              label="Code Embed"
              mandatory
              placeholder="Paste kode embed"
              use-validator
            />
          </div>
        </div>
      </template>
      <template v-else>
        <InputURL
          :validator-message="{
            empty: 'URL proses harus diisi.',
          }"
          :value="
            props.initialValue?.linkType === 'url'
              ? props.initialValue.link
              : undefined
          "
          field-name="link"
          label="URL"
          mandatory
          placeholder="Tulis URL"
          use-validator
        />
      </template>
      <div class="flex justify-end">
        <Button @click="handleClick" label="Simpan" severity="secondary" />
      </div>
    </template>
  </DialogForm>
</template>
