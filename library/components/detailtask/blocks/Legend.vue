<script setup lang="ts">
import { computed, inject, Ref, ref, shallowRef, watch } from 'vue';

import { DropdownOption } from 'lib/types/options.type';
import LiteDropdown from 'lib/components/litedropdown/LiteDropdown.vue';
import Button from 'lib/components/button/Button.vue';
import Badge from 'lib/components/badge/Badge.vue';
import ProcessServices from 'lib/services/process.service';
import { useToast } from 'lib/utils';
import ModuleServices from 'lib/services/module.service';
import SubModuleServices from 'lib/services/submodule.service';
import DialogNilaiPrioritas from './Dialog/DialogNilaiPrioritas.vue';
import TaskServices from 'lib/services/task.service';
import { CreateTaskDTO } from 'lib/dto/task.dto';
import { ProjectProcess } from 'lib/types/projectProcess.type';
import { ProjectModule } from 'lib/types/projectModule.type';
import { ProjectSubModule } from 'lib/types/projectSubmodule.type';
import Textarea from 'primevue/textarea';

const toast = useToast();

const isNewTask = inject<Ref<boolean>>('isNewTask');

// TODO: Remove the fallback project id when it's no longer needed.
const projectId =
  localStorage.getItem('projectId') ?? '66e901c165b533fbe0c72c03';

export type TaskLegend = {
  process: Pick<ProjectProcess, '_id' | 'name' | 'default'>;
  module?: Pick<ProjectModule, '_id' | 'name'>;
  submodule?: Pick<ProjectSubModule, '_id' | 'name'>;
  title: string;
  priorityValue?: number;
};

export type TaskLegendForm = Partial<Omit<TaskLegend, 'priorityValue'>>;

export type TaskLegendOptions = {
  process?: DropdownOption[];
  module?: DropdownOption[];
  submodule?: DropdownOption[];
};

export type TaskLegendLoading = {
  process?: boolean;
  module?: boolean;
  submodule?: boolean;
};

const legendForm = ref<TaskLegendForm>({});
/**
 * Necessary to watch old and new value changes.
 *
 * @see <https://github.com/vuejs/vue/issues/2164>
 */
const computedLegendForm = computed<TaskLegendForm>(() =>
  Object.assign({}, legendForm.value),
);
const legendOptions = ref<TaskLegendOptions>({});
const legendLoading = ref<TaskLegendLoading>({
  process: false,
  module: false,
  submodule: false,
});

const showDialogNilaiPrioritas = shallowRef<boolean>(false);

const getProcessOptions = async (): Promise<void> => {
  if (!projectId) return;
  try {
    legendLoading.value.process = true;

    const { data } = await ProcessServices.getProcessList(projectId);

    legendOptions.value.process = data.data.processProjects.map((d) => ({
      label: d.name,
      value: d,
    }));
  } catch (error) {
    toast.add({
      message: 'Data Proses gagal diambil.',
      severity: 'error',
      error,
    });
  } finally {
    legendLoading.value.process = false;
  }
};

const getModuleOptions = async (): Promise<void> => {
  if (!projectId) return;
  try {
    legendLoading.value.module = true;

    const { data } = await ModuleServices.getModuleList(projectId);

    legendOptions.value.module = data.data.map((d) => ({
      label: d.name,
      value: d,
    }));
  } catch (error) {
    toast.add({
      message: 'Data Modul gagal diambil.',
      severity: 'error',
      error,
    });
  } finally {
    legendLoading.value.module = false;
  }
};

const getSubmoduleOptions = async (): Promise<void> => {
  if (!projectId) return;
  try {
    legendLoading.value.submodule = true;

    const { data } = await SubModuleServices.getSubmoduleList(projectId, {
      module: JSON.stringify([legendForm.value.module._id]),
    });

    legendOptions.value.submodule = data.data.map((d) => ({
      label: d.name,
      value: d,
    }));
  } catch (error) {
    toast.add({
      message: 'Data Sub Modul gagal diambil.',
      severity: 'error',
      error,
    });
  } finally {
    legendLoading.value.submodule = false;
  }
};

/**
 * Disable Rules:
 * 1. If the selected process is unique (the default process, eg. Pengonsepan, Komponen Web, etc), set module dropdown to disabled.
 * 2. If the selected process is NOT unique, set process dropdown to NOT disabled.
 */
const isModuleDropdownDisabled = computed<boolean>(() => {
  return (
    (legendForm.value.process && legendForm.value.process.default) ||
    !legendForm.value.process
  );
});

/**
 * Disable Rules:
 * 1. If the selected process is unique (the default process, eg. Pengonsepan, Komponen Web, etc), set submodule dropdown to disabled.
 * 2. If the selected process is NOT unique & module has not been selected, set submodule dropdown to disabled.
 */
const isSubmoduleDropdownDisabled = computed<boolean>(() => {
  return (
    (legendForm.value.process && legendForm.value.process.default) ||
    !legendForm.value.module
  );
});

/**
 * Disable Rules:
 * 1. If the selected process is unique (the default process, eg. Pengonsepan, Komponen Web, etc), IMMEDIATELY set title input to NOT disabled.
 * 2. If the selected process is NOT unique & module + submodule has not been selected, set title input to disabled.
 */
const isTitleInputDisabled = computed<boolean>(() => {
  const isProcessDefault =
    !!legendForm.value.process && legendForm.value.process.default;

  const isProcessNotDefault =
    !!legendForm.value.process && !legendForm.value.process.default;

  if (isProcessDefault) {
    return false;
  }

  if (
    isProcessNotDefault &&
    legendForm.value.process &&
    legendForm.value.module &&
    legendForm.value.submodule
  )
    return false;

  return true;
});

// TODO: Get Detail Task API
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDetailTask = async (): Promise<void> => {
  try {
    // PASS
  } catch {
    // PASS
  }
};

const createTask = async (): Promise<void> => {
  if (!legendForm.value.process || !legendForm.value.title) return;
  try {
    const data: CreateTaskDTO = {
      project: projectId,
      process: legendForm.value.process._id,
      module: legendForm.value.module?._id,
      subModule: legendForm.value?.submodule?._id,
      name: legendForm.value.title,
      assignedTo: [],
    };

    await TaskServices.postCreateTask(data);

    isNewTask.value = false;
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Task gagal dibuat.',
      severity: 'error',
      error,
    });
  }
};

// TODO: Edit Task API
const editTask = async (): Promise<void> => {
  try {
    // PASS
  } catch {
    // PASS
  }
};

/**
 * This function is called whenever there will be changes in the detail task. (including create task and edit task)
 *
 */
const handleTaskChange = async (): Promise<void> => {
  if (isNewTask.value) {
    await createTask();
  } else {
    await editTask();
  }
};

const handleTitleInput = (e: KeyboardEvent): void => {
  // Prevent any attempt of newline character.
  if (e.key === 'Enter') {
    e.preventDefault();
  }

  legendForm.value.title = legendForm.value.title?.replace(/\n/g, '');
};

watch(
  computedLegendForm,
  (value, oldValue) => {
    if (value.process !== oldValue.process) {
      legendForm.value.module = undefined;
    }

    if (value.module !== oldValue.module) {
      legendForm.value.submodule = undefined;
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="flex flex-col gap-6 mb-3" data-wv-section="detailtask-legend">
    <DialogNilaiPrioritas
      v-model:visible="showDialogNilaiPrioritas"
      :legend="legendForm as TaskLegend"
      :parent-task="[
        // TODO: Remove and replace this with detail task's data.
        {
          process: {
            _id: '1',
            name: 'Pengonsepan',
            default: true,
          },
          title: 'Process',
          priorityValue: 1,
        },
        {
          process: {
            _id: '2',
            name: 'Detailing',
            default: true,
          },
          title: 'Process',
          priorityValue: 5,
        },
        {
          process: {
            _id: '3',
            name: 'Slicing Komponen Web',
            default: true,
          },
          title: 'Process',
          priorityValue: 10,
        },
      ]"
    />
    <div class="flex justify-between items-center">
      <div
        class="flex items-center w-4/5 overflow-y-hidden overflow-x-auto scrollbar-hide"
      >
        <div class="flex flex-row gap-2 items-center whitespace-nowrap">
          <div>
            <LiteDropdown
              v-model="legendForm.process"
              :loading="legendLoading.process"
              :options="legendOptions.process"
              @change="handleTaskChange"
              @show="getProcessOptions"
              data-wv-section="detailtask-process-input"
              option-label="label"
              option-value="value"
              placeholder="Process"
            />
          </div>
          <div>
            <LiteDropdown
              v-model="legendForm.module"
              :disabled="isModuleDropdownDisabled"
              :loading="legendLoading.module"
              :options="legendOptions.module"
              @change="handleTaskChange"
              @show="getModuleOptions"
              data-wv-section="detailtask-module-input"
              option-label="label"
              option-value="value"
              placeholder="Modul"
            />
          </div>
          <div>
            <LiteDropdown
              v-model="legendForm.submodule"
              :disabled="isSubmoduleDropdownDisabled"
              :loading="legendLoading.submodule"
              :options="legendOptions.submodule"
              @change="handleTaskChange"
              @show="getSubmoduleOptions"
              data-wv-section="detailtask-submodule-input"
              option-label="label"
              option-value="value"
              placeholder="Sub Modul"
            />
          </div>
        </div>
      </div>
      <Button
        :disabled="!legendForm.title && isNewTask"
        @click="showDialogNilaiPrioritas = true"
        data-wv-section="add-nilai-prioritas-button"
        icon="add"
        label="Nilai Prioritas"
        severity="secondary"
      />
    </div>
    <div class="flex justify-between items-start">
      <div class="w-4/5" data-wv-section="detailtask-title-wrapper">
        <Textarea
          v-model="legendForm.title"
          :disabled="isTitleInputDisabled"
          @blur="handleTaskChange"
          @input="handleTitleInput"
          @keypress="handleTitleInput"
          auto-resize
          autocorrect="false"
          class="!border-none !ring-0 !outline-none !text-2xl !min-h-8 !resize-none !font-semibold !w-full !text-wrap disabled:placeholder:!opacity-60 placeholder:!font-semibold placeholder:!text-general-200 dark:placeholder:!text-grayscale-800 !bg-transparent"
          placeholder="Nama Task"
          spellcheck="false"
          unstyled
        />
      </div>
      <Badge label="Backlog" />
    </div>
  </div>
</template>
<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
