<script setup lang="ts">
import { computed, inject, Ref, ref, shallowRef } from 'vue';
import { useToast } from 'lib/utils';
import TaskChecklistServices from 'lib/services/taskChecklist.service';
import Dialog from 'lib/components/dialog/Dialog.vue';
import ButtonSearch from 'lib/components/buttonsearch/ButtonSearch.vue';
import DataTable from 'lib/components/datatable/DataTable.vue';
import { FilterMatchMode } from 'lib/components/datatable/helpers/filter.helper';
import {
  FetchResponse,
  QueryParams,
  TableColumn,
} from 'lib/components/datatable/DataTable.vue.d';
import { MenuItem } from 'lib/components/menuitem';
import Button from 'lib/components/button/Button.vue';
import { TaskChecklistTemplate } from 'lib/types/task.type';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';

const toast = useToast();

const projectId = inject<Ref<string>>('projectId');

const DialogPreset = inject<Record<string, any>>('preset', {}).dialog;

const visible = defineModel<boolean>('visible', { required: true });

const tableOptions = shallowRef<MenuItem[]>([
  {
    icon: 'file-copy-2-line',
    label: 'Detail',
    command: (): void => {
      dialogDetail.value = true;
    },
  },
  {
    icon: 'delete-bin',
    label: 'Hapus',
    danger: true,
    command: (): void => {
      dialogConfirmDelete.value = true;
    },
  },
]);

const dialogDetail = shallowRef<boolean>(false);
const dialogConfirmDelete = shallowRef<boolean>(false);

const filters = ref<any>({
  global: { value: undefined, matchMode: FilterMatchMode.CONTAINS },
});

const selectedTemplate = ref<TaskChecklistTemplate>();

const tableKey = shallowRef<number>(0);

const tableColumns = computed<TableColumn[]>(() => {
  return [
    {
      field: 'name',
      header: 'Nama Template',
      sortable: true,
      fixed: true,
    },
    {
      field: 'module',
      header: 'Modul',
      sortable: true,
      fixed: true,
    },
    {
      field: 'subModule',
      header: 'Sub Module',
      sortable: true,
      fixed: true,
    },
    {
      field: 'task',
      header: 'Task',
      sortable: true,
      fixed: true,
    },
    {
      field: 'createdBy.nickName',
      header: 'Dibuat Oleh',
      sortable: true,
    },
  ];
});

const getChecklistTemplates = async (
  params?: QueryParams,
): Promise<FetchResponse> => {
  try {
    const { data } = await TaskChecklistServices.getTaskChecklistTemplates(
      projectId.value,
      params,
    );
    return data;
  } catch (error) {
    toast.add({
      message: 'Template ceklis gagal dimuat.',
      error,
    });
  }
};

const toggleMenu = (template: TaskChecklistTemplate): void => {
  selectedTemplate.value = template;
};

const deleteChecklistTemplate = async (): Promise<void> => {
  try {
    const { data } = await TaskChecklistServices.deleteTaskChecklistTemplate(
      selectedTemplate.value?._id,
    );
    if (data) {
      toast.add({
        message: 'Template ceklis telah dihapus.',
      });
      dialogDetail.value = false;
      dialogConfirmDelete.value = false;
      tableKey.value++;
    }
  } catch (error) {
    toast.add({
      message: 'Template ceklis gagal dihapus.',
      error,
    });
  }
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :pt="{
      root: () => ({
        class: [...DialogPreset.root({ state: {} }).class, 'w-[800px]'],
      }),
      header: {
        class: [...DialogPreset.header.class],
      },
      content: {
        class: [...DialogPreset.content({ state: {}, instance: {} }).class],
      },
      footer: {
        class: [...DialogPreset.footer.class],
      },
    }"
    data-wv-name="dialog-detail-checklist-template"
    header="Detail Template"
  >
    <template #header>
      <div class="flex items-center w-full">
        <span class="text-base font-semibold leading-4">Detail Template</span>
      </div>
    </template>
    <div class="flex flex-col gap-2">
      <ButtonSearch
        @search="filters.global.value = $event"
        class="ml-auto pr-2"
      />
      <DataTable
        :key="tableKey"
        :columns="tableColumns"
        :fetch-function="getChecklistTemplates"
        :filters="filters"
        :options="tableOptions"
        :total-disabled-rows="1"
        @toggle-option="toggleMenu"
        data-key="_id"
        disable-key="isDefault"
        lazy
        selection-type="single"
        use-option
        use-paginator
      />
    </div>
  </Dialog>

  <Dialog
    v-model:visible="dialogDetail"
    :pt="{
      root: () => ({
        class: [...DialogPreset.root({ state: {} }).class, 'w-[400px]'],
      }),
      header: {
        class: [...DialogPreset.header.class],
      },
      content: {
        class: [...DialogPreset.content({ state: {}, instance: {} }).class],
      },
      footer: {
        class: [...DialogPreset.footer.class],
      },
    }"
    data-wv-name="dialog-detail-checklist-template"
    header="Detail Template"
  >
    <template #header>
      <div class="flex items-center w-full">
        <span class="text-base font-semibold leading-4">Detail Template</span>
      </div>
    </template>
    <div class="flex flex-col gap-3">
      <span>{{ selectedTemplate.name }}</span>
      <ul class="list-none">
        <li
          :key="index"
          v-for="(item, index) in selectedTemplate.items"
          class="flex pt-1 pb-1 first:!pt-0 first:!pb-1 last:!pt-1 last:!pb-0 before:content-['•'] before:mr-2"
        >
          {{ item }}
        </li>
      </ul>
      <Button
        @click="dialogConfirmDelete = true"
        class="ml-auto"
        data-wv-section="deletebutton"
        label="Hapus"
        outlined
        severity="danger"
      />
    </div>
  </Dialog>

  <DialogConfirm
    v-model:visible="dialogConfirmDelete"
    :list="[selectedTemplate?.name]"
    @confirm="deleteChecklistTemplate"
    confirm-label="Hapus"
    header="Hapus Template"
    message="Apakah kamu yakin ingin menghapusnya?"
    severity="danger"
  />
</template>
