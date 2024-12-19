<script setup lang="ts">
import { shallowRef, inject } from 'vue';
import { UpdateTaskApiDTO } from 'lib/dto/taskApi.dto';
import { TaskAPIFormDataCustom } from 'lib/types/task.type';
import { formatDateReadable } from 'lib/utils/date.util';
import { useToast } from 'lib/utils';
import { useLoadingStore } from 'lib/build-entry';
import { FormPayload } from 'lib/components/form/Form.vue.d';

import Button from 'lib/components/button/Button.vue';
import CodeSnippet from 'lib/components/codesnippet/CodeSnippet.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import InputText from 'lib/components/inputtext/InputText.vue';
import UserName from 'lib/components/username/UserName.vue';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import DialogTestApi from './DialogTestApi.vue';
import Form from 'lib/components/form/Form.vue';
import { TaskApiServices } from 'wangsit-api-services';

const updateMentionSectionText = inject<(sectionTitle: string) => void>(
  'updateMentionSectionText',
);

const toast = useToast();
const { setLoading } = useLoadingStore();

const taskApi = defineModel<TaskAPIFormDataCustom>('taskApi', {
  required: true,
});

const props = defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  deleted: [];
  updated: [];
  // eslint-disable-next-line vue/no-unused-emit-declarations
  openEdit: [];
}>();

const methodOptions = shallowRef([
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'HEAD', value: 'HEAD' },
  { label: 'OPTION', value: 'OPTION' },
]);
const contentTypeOptions = shallowRef([
  { label: 'JSON', value: 'json' },
  { label: 'Form Data', value: 'form-data' },
]);
const bodyTypeOptions = shallowRef([
  { label: 'Text', value: 'text' },
  { label: 'File', value: 'file' },
]);
const bodyMandatoryOptions = shallowRef([
  { label: 'Ya', value: 'ya' },
  { label: 'Tidak', value: 'tidak' },
]);

const dialogDeleteConfirm = shallowRef<boolean>(false);
const dialogTestApi = shallowRef<boolean>(false);
const expanded = shallowRef<boolean>(false);

const formKey = shallowRef<number>(0);

const saving = shallowRef<boolean>(false);

const toggleAccordion = (): void => {
  expanded.value = !expanded.value;
};

/**
 * Updates the form key and resets error states for query parameters and form data body keys.
 *
 * @remarks
 * This function iterates over the `query` and `formDataBody` arrays in `taskApi.value`.
 * It sets elements with empty or undefined values to `undefined` to reset their error states.
 * The `formKey` is then incremented to trigger any necessary updates in the form component.
 */
const updateFormKey = (): void => {
  // Reset error state for empty query param fields
  taskApi.value.query = taskApi.value.query.map((q) =>
    !q?.length ? undefined : q,
  );
  // Reset error state for empty body form data key fields
  taskApi.value.formDataBody = taskApi.value.formDataBody.map((body) => ({
    ...body,
    key: !body?.key?.length ? undefined : body.key,
  }));
  formKey.value++;
};

const addQueryParam = (): void => {
  taskApi.value.query.push(undefined);
  makeChanges();
  updateFormKey();
};

const removeQueryParam = (index: number): void => {
  taskApi.value.query.splice(index, 1);
  makeChanges();
  updateFormKey();
};

const addFormDataBody = (): void => {
  taskApi.value.formDataBody.push({
    key: undefined,
    type: 'text',
    isMandatory: 'tidak',
  });
  makeChanges();
  updateFormKey();
};

const removeFormDataBody = (index: number): void => {
  taskApi.value.formDataBody.splice(index, 1);
  makeChanges();
  updateFormKey();
};

const deleteTaskApi = async (): Promise<void> => {
  try {
    setLoading(true);
    const { data } = await TaskApiServices.deleteTaskAPI(taskApi.value._id);
    if (data) {
      emit('deleted');
      dialogDeleteConfirm.value = false;
    }
  } catch (error) {
    toast.add({
      message: 'API gagal dihapus.',
      error,
    });
  } finally {
    setLoading(false);
  }
};

const updateTaskApi = async (e: FormPayload): Promise<void> => {
  try {
    saving.value = true;

    const body: UpdateTaskApiDTO = {
      name: taskApi.value.name,
      header: taskApi.value.header,
      url: e.formValues?.url as unknown as string,
      method: e.formValues?.method as unknown as string,
      contentType: e.formValues?.contentType as unknown as string,
      jsonBody: taskApi.value.jsonBody,
      query: taskApi.value.query,
      formDataBody: taskApi.value.formDataBody.map((formBody) => ({
        ...formBody,
        isMandatory: formBody?.isMandatory === 'ya',
      })),
      response: taskApi.value.response,
    };
    const { data } = await TaskApiServices.updateTaskAPI(
      taskApi.value._id,
      body,
    );
    if (data) {
      emit('updated');
    }
  } catch (error) {
    toast.add({
      message: 'API gagal diubah.',
      error,
    });
  } finally {
    saving.value = false;
  }
};

const makeChanges = (): void => {
  taskApi.value.anyChanges = true;
};

/**
 * Called when the content type of the task API is changed.
 * If the content type is changed to 'form-data', the JSON body is cleared.
 * If the content type is changed to 'json', the form data body is cleared.
 * The makeChanges function is called to mark the task API as changed.
 */
const contentTypeChange = (): void => {
  if (taskApi.value.contentType === 'form-data') {
    taskApi.value.jsonBody = '';
  } else {
    taskApi.value.formDataBody = [];
  }
  makeChanges();
};
</script>

<template>
  <div class="grid grid-cols-[1fr,auto] gap-2.5 items-center">
    <div
      class="w-full flex justify-between items-center px-3 py-3 bg-primary-50 rounded-lg"
    >
      <span class="text-xs font-semibold">{{ taskApi.name }}</span>
      <div class="flex gap-1">
        <Button
          :disabled="props.disabled"
          @click="emit('openEdit')"
          class="!w-6 !min-w-6 !h-6"
          icon="edit"
          severity="secondary"
          text
        />
        <Button
          @click="toggleAccordion"
          class="!w-6 !min-w-6 !h-6"
          icon="arrow-down"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
      </div>
    </div>
    <Button
      :disabled="props.disabled"
      @click="dialogDeleteConfirm = true"
      icon="close"
      severity="danger"
      text
    />
    <transition name="slide-fade">
      <div v-show="expanded" class="grid grid-cols-subgrid col-span-2">
        <Form
          :key="formKey"
          @submit="updateTaskApi"
          class=""
          hide-footer
          hide-stay-checkbox
        >
          <template #fields>
            <div class="col-start-1 flex flex-col gap-3">
              <div class="w-full flex gap-2 justify-end items-center">
                <span class="font-normal">{{
                  formatDateReadable(new Date(taskApi.updatedAt), 86400)
                }}</span>
                <UserName :user="taskApi.updatedBy" type="icon" />
                <Button
                  @click="updateMentionSectionText(taskApi.name)"
                  class="!p-1"
                  icon="chat-1-line"
                  icon-class="!w-6 !h-6"
                  severity="secondary"
                  text
                  type="button"
                />
                <Button
                  @click="dialogTestApi = true"
                  label="Tes API"
                  severity="secondary"
                  type="button"
                />
              </div>
              <div class="">
                <div class="w-full flex justify-between items-center">
                  <span class="pl-3 font-semibold">Request</span>
                  <Button
                    v-if="taskApi.anyChanges"
                    :disabled="saving"
                    :loading="saving"
                    icon="add"
                    label="Simpan"
                    severity="secondary"
                    type="submit"
                  />
                </div>
                <div class="pl-8 pt-3 flex flex-col gap-2">
                  <Dropdown
                    v-model="taskApi.method"
                    :disabled="props.disabled"
                    :initial-value="taskApi.method"
                    :options="methodOptions"
                    @update:model-value="makeChanges"
                    field-name="method"
                    label="Method"
                    mandatory
                    option-label="label"
                    option-value="value"
                    placeholder="Pilih method"
                    use-validator
                  />
                  <InputText
                    v-model="taskApi.url"
                    :disabled="props.disabled"
                    :validator-message="{
                      empty: 'Endpoint harus diisi.',
                    }"
                    :value="taskApi.url"
                    @input="makeChanges"
                    field-name="url"
                    label="Endpoint"
                    mandatory
                    placeholder="Tulis endpoint"
                    use-validator
                  />
                  <div class="flex flex-col gap-2">
                    <span class="font-normal">Header</span>
                    <CodeSnippet
                      v-model:code="taskApi.header"
                      :readonly="props.disabled"
                      @update:code="makeChanges"
                      class="max-h-[306px] overflow-y-auto"
                      lang="json"
                    />
                  </div>
                  <Dropdown
                    v-model="taskApi.contentType"
                    :disabled="props.disabled"
                    :initial-value="taskApi.contentType"
                    :options="contentTypeOptions"
                    @update:model-value="contentTypeChange"
                    field-name="contentType"
                    label="Content Type"
                    mandatory
                    option-label="label"
                    option-value="value"
                    placeholder="Pilih content type"
                    use-validator
                  />
                  <div class="flex flex-col gap-2 items-start">
                    <span class="font-normal">Query Param</span>
                    <div
                      :key="index"
                      v-for="(query, index) in taskApi.query"
                      class="w-full grid grid-cols-[1fr,auto] gap-2 items-start"
                    >
                      <InputText
                        v-model="taskApi.query[index]"
                        :disabled="props.disabled"
                        :field-name="`query-${index}`"
                        :validator-message="{
                          empty: 'Query param harus diisi.',
                        }"
                        :value="taskApi.query[index]"
                        @input="makeChanges"
                        mandatory
                        placeholder="Tulis query param"
                        use-validator
                      />
                      <Button
                        :disabled="props.disabled"
                        @click="removeQueryParam(index)"
                        icon="delete-bin"
                        outlined
                        severity="danger"
                        type="button"
                      />
                    </div>
                    <Button
                      :disabled="props.disabled"
                      @click="addQueryParam"
                      icon="add"
                      label="Query Param"
                      severity="secondary"
                      type="button"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <span class="font-normal">Body</span>
                    <div
                      v-if="taskApi.contentType === 'form-data'"
                      class="flex flex-col gap-2 items-start"
                    >
                      <div
                        :key="index"
                        v-for="(param, index) in taskApi.formDataBody"
                        class="w-full grid grid-cols-[1fr,1fr,1fr,auto] gap-2 items-end"
                      >
                        <InputText
                          v-model="taskApi.formDataBody[index].key"
                          :disabled="props.disabled"
                          :field-name="`body-key-${index}`"
                          :validator-message="{
                            empty: 'Key harus diisi.',
                          }"
                          :value="taskApi.formDataBody[index].key"
                          @input="makeChanges"
                          label="Key"
                          mandatory
                          placeholder="Tulis key"
                          use-validator
                        />
                        <Dropdown
                          v-model="taskApi.formDataBody[index].type"
                          :disabled="props.disabled"
                          :field-name="`body-type-${index}`"
                          :initial-value="taskApi.formDataBody[index].type"
                          :options="bodyTypeOptions"
                          @update:model-value="makeChanges"
                          label="Type"
                          mandatory
                          option-label="label"
                          option-value="value"
                          placeholder="Pilih type"
                          use-validator
                        />
                        <Dropdown
                          v-model="taskApi.formDataBody[index].isMandatory"
                          :disabled="props.disabled"
                          :field-name="`body-mandatory-${index}`"
                          :initial-value="
                            taskApi.formDataBody[index].isMandatory
                          "
                          :options="bodyMandatoryOptions"
                          @update:model-value="makeChanges"
                          label="Required"
                          mandatory
                          option-label="label"
                          option-value="value"
                          placeholder="Pilih required"
                          use-validator
                        />
                        <Button
                          :disabled="props.disabled"
                          @click="removeFormDataBody(index)"
                          icon="delete-bin"
                          outlined
                          severity="danger"
                          type="button"
                        />
                      </div>
                      <Button
                        :disabled="props.disabled"
                        @click="addFormDataBody"
                        icon="add"
                        label="Body"
                        severity="secondary"
                        type="button"
                      />
                    </div>
                    <CodeSnippet
                      v-else
                      v-model:code="taskApi.jsonBody"
                      :readonly="props.disabled"
                      @update:code="makeChanges"
                      class="max-h-[306px] overflow-y-auto"
                      lang="json"
                    />
                  </div>
                </div>
              </div>
              <div class="">
                <span class="pl-3 font-semibold">Response</span>
                <div class="pl-8 pt-3">
                  <CodeSnippet
                    v-model:code="taskApi.response"
                    :readonly="props.disabled"
                    @update:code="makeChanges"
                    class="max-h-[306px] overflow-y-auto"
                    lang="json"
                  />
                </div>
              </div>
            </div>
          </template>
        </Form>
      </div>
    </transition>
  </div>

  <DialogConfirm
    v-model:visible="dialogDeleteConfirm"
    :list="[taskApi.name]"
    @confirm="deleteTaskApi"
    confirm-label="Hapus"
    header="Hapus API"
    message="Apakah kamu yakin ingin menghapusnya?"
    severity="danger"
  />

  <DialogTestApi v-model:visible="dialogTestApi" :task-api="taskApi" />
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-15px);
  opacity: 0;
}
</style>
