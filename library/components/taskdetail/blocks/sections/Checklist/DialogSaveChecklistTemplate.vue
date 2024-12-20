<script setup lang="ts">
import { inject, Ref, ref, shallowRef } from 'vue';

import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import { DropdownOption } from 'lib/types/options.type';
import { useToast } from 'lib/utils';
import { TaskChecklistServices } from 'wangsit-api-services';
import { FormPayload, FormValue } from 'lib/components/form/Form.vue.d';
import { AddTaskChecklistTemplateDTO } from 'lib/dto/taskChecklist.dto';
import { TaskChecklist, TaskDetailData } from 'lib/types/task.type';
import InputText from 'lib/components/inputtext/InputText.vue';

const { setLoading } = useLoadingStore();
const toast = useToast();

const projectId = inject<Ref<string>>('projectId');

const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  checklist?: TaskChecklist;
}>();

const templateOptions = ref<DropdownOption[]>();
const templateLoading = shallowRef<boolean>(false);

const getChecklistTemplates = async (): Promise<void> => {
  try {
    templateLoading.value = true;
    const { data: response } =
      await TaskChecklistServices.getTaskChecklistTemplates(projectId.value);
    if (response) {
      const defaultOption = {
        label: 'Template Baru',
        value: { name: 'Template Baru' },
      };
      templateOptions.value = [
        ...response.data.data.map((d) => ({ label: d.name, value: d })),
        defaultOption,
      ];
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
    const body: AddTaskChecklistTemplateDTO = {
      project: projectId.value,
      checklist: props.checklist._id,
      module: taskDetail.value?.module?.name,
      subModule: taskDetail.value?.subModule?.name,
      task: taskDetail.value?.name,
      name: e.formValues?.name as unknown as string,
      templateReplaced:
        template['name'] === 'new' ? undefined : template['_id'],
    };
    const { data } = await TaskChecklistServices.addTaskChecklistTemplate(body);
    if (data) {
      toast.add({
        message: 'Template ceklis telah disimpan.',
        severity: 'success',
      });
      visible.value = false;
    }
  } catch (error) {
    toast.add({
      message: 'Template ceklis gagal disimpan.',
      error,
    });
  } finally {
    setLoading(false);
  }
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
    data-wv-name="dialog-save-checklist-template"
    header="Simpan Template"
  >
    <template #fields>
      <Dropdown
        :custom-validation="{
          empty: 'Template ceklis harus dipilih.',
        }"
        :loading="templateLoading"
        :options="templateOptions"
        @show="getChecklistTemplates"
        data-key="name"
        field-name="template"
        label="Pilih Template"
        mandatory
        option-label="label"
        option-value="value"
        placeholder="Pilih template ceklis"
        use-validator
        validator-message="Template ceklis harus dipilih."
      >
        <template #option="{ option }">
          <div class="flex flex-col gap-0.5">
            <div class="text-xs font-normal">{{ option.label }}</div>
            <div
              v-if="option.label !== 'Template Baru'"
              class="text-[10px] font-normal"
            >
              {{
                `${option.value.module}. ${option.value.subModule}. ${option.value.task}`
              }}
            </div>
          </div>
        </template>
      </Dropdown>
      <InputText
        :validator-message="{
          empty: 'Nama template harus diisi.',
        }"
        field-name="name"
        label="Nama Template"
        mandatory
        placeholder="Tulis nama template"
        use-validator
      />
    </template>
  </DialogForm>
</template>
