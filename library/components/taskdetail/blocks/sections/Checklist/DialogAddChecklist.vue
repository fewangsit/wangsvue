<script setup lang="ts">
import { inject, Ref, ref, shallowRef } from 'vue';

import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import { DropdownOption } from 'lib/types/options.type';
import { useToast } from 'lib/utils';
import InputText from 'lib/components/inputtext/InputText.vue';
import TaskChecklistServices from 'lib/services/taskChecklist.service';
import { AddTaskChecklistDTO } from 'lib/dto/taskChecklist.dto';
import { FormPayload, FormValue } from 'lib/components/form/Form.vue.d';

export type AddTaskChecklistStaticDTO = Omit<
  AddTaskChecklistDTO,
  'template'
> & {
  template: string[];
};

const { setLoading } = useLoadingStore();
const toast = useToast();

const projectId = inject<Ref<string>>('projectId');

const props = defineProps<{
  /**
   * This props.static is used in DialogReviewLeader component
   */
  static?: boolean;
}>();

const taskId = inject<Ref<string>>('taskId');

const visible = defineModel<boolean>('visible', { required: true });

const emit = defineEmits<{
  /**
   * @description Emit for adding checklist with static mode
   */
  add: [body: AddTaskChecklistStaticDTO];
  added: [];
}>();

const templateOptions = ref<DropdownOption[]>();
const templateLoading = shallowRef<boolean>(false);

const getChecklistTemplates = async (): Promise<void> => {
  try {
    templateLoading.value = true;
    const { data: response } =
      await TaskChecklistServices.getTaskChecklistTemplates(projectId.value);
    if (response) {
      templateOptions.value = response.data.data.map((d) => ({
        label: d.name,
        value: d,
      }));
    }
  } catch (error) {
    toast.add({
      message: 'Template ceklis gagal dimuat.',
      error,
    });
  } finally {
    templateLoading.value = false;
  }
};

const handleSubmit = async (e: FormPayload): Promise<void> => {
  try {
    setLoading(true);

    const template = e.formValues?.template as unknown as FormValue;
    const body: AddTaskChecklistDTO = {
      name: e.formValues?.name as unknown as string,
      task: taskId?.value,
      template: template ? template['_id'] : undefined,
    };

    if (props.static) {
      const staticBody = {
        ...body,
        template: template ? (template['items'] as string[]) : undefined,
      };
      emit('add', staticBody);
      handleSuccess();
    } else {
      const { data } = await TaskChecklistServices.addTaskChecklist(body);
      if (data) {
        handleSuccess();
      }
    }
  } catch (error) {
    toast.add({
      message: 'Ceklis gagal ditambahkan.',
      error,
    });
  } finally {
    setLoading(false);
  }
};

const handleSuccess = (): void => {
  toast.add({
    message: 'Ceklis telah ditambahkan.',
    severity: 'success',
  });
  emit('added');
  visible.value = false;
};
</script>

<template>
  <DialogForm
    v-model:visible="visible"
    :buttons-template="['cancel', 'clear', 'submit']"
    :closable="false"
    :close-on-submit="false"
    :reset-after-submit="false"
    :show-stay-checkbox="false"
    :use-clear-btn="false"
    @submit="handleSubmit"
    data-wv-name="dialog-add-checklist"
    header="Tambah Ceklis"
  >
    <template #fields>
      <InputText
        :validator-message="{
          empty: 'Nama ceklis harus diisi.',
        }"
        field-name="name"
        label="Nama Ceklis"
        mandatory
        placeholder="Tulis nama ceklis"
        use-validator
      />
      <Dropdown
        :loading="templateLoading"
        :options="templateOptions"
        @show="getChecklistTemplates"
        data-key="name"
        field-name="template"
        label="Salin List Dari"
        option-label="label"
        option-value="value"
        placeholder="Pilih template ceklis"
        use-validator
      >
        <template #option="{ option }">
          <div class="flex flex-col gap-0.5">
            <div class="text-xs font-normal">{{ option.label }}</div>
            <div class="text-[10px] font-normal">
              {{
                `${option.value.module}. ${option.value.subModule}. ${option.value.task}`
              }}
            </div>
          </div>
        </template>
      </Dropdown>
    </template>
  </DialogForm>
</template>
