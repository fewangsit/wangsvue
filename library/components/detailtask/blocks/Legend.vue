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
import eventBus from 'lib/event-bus';
import { TaskDetail } from 'lib/types/task.type';

const toast = useToast();

const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetail>>('taskDetail');
const isNewTask = inject<Ref<boolean>>('isNewTask');

// TODO: Remove the fallback project id when it's no longer needed.
const projectId =
  sessionStorage.getItem('projectId') ?? '66fa406bdff16ba7dd2382fa';

export type TaskLegend = {
  process: Pick<ProjectProcess, '_id' | 'name' | 'team'>;
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
      value: {
        _id: d._id,
        name: d.name,
        team: d.team.map((team) => ({ initial: team.initial })),
      },
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
      value: {
        _id: d._id,
        name: d.name,
      },
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

    legendOptions.value.submodule = data.data?.data.map((d) => ({
      label: d.name,
      value: {
        _id: d._id,
        name: d.name,
      },
    }));
  } catch (error) {
    console.error(error);
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
 * 1. If the process hasn't been selected.
 */
const isModuleDropdownDisabled = computed<boolean>(() => {
  return !legendForm.value.process;
});

/**
 * Disable Rules:
 * 1. If the selected process is for UIUX, set submodule dropdown to disabled.
 * 2. If the selected process is NOT for UIUX & module has not been selected, set submodule dropdown to disabled.
 */
const isSubmoduleDropdownDisabled = computed<boolean>(() => {
  return (
    (legendForm.value.process &&
      legendForm.value.process.team[0].initial === 'UIUX') ||
    !legendForm.value.module
  );
});

/**
 * Disable Rules:
 * 1. If the selected process is for UIUX, IMMEDIATELY set title input to NOT disabled.
 * 2. If the selected process is NOT for UIUX & module + submodule has not been selected, set title input to disabled.
 */
const isTitleInputDisabled = computed<boolean>(() => {
  const isProcessUIUX =
    !!legendForm.value.process &&
    legendForm.value.process.team[0].initial === 'UIUX';

  const isProcessNotUIUX =
    !!legendForm.value.process &&
    legendForm.value.process.team[0].initial !== 'UIUX';

  if (isProcessUIUX) {
    return !legendForm.value.module;
  }

  if (
    isProcessNotUIUX &&
    legendForm.value.process &&
    legendForm.value.module &&
    legendForm.value.submodule
  )
    return false;

  return true;
});

const createTask = async (): Promise<void> => {
  if (!legendForm.value.process || !legendForm.value.title) return;
  try {
    const dataDTO: CreateTaskDTO = {
      project: projectId,
      process: legendForm.value.process._id,
      module: legendForm.value.module?._id,
      subModule: legendForm.value?.submodule?._id,
      name: legendForm.value.title,
      team: legendForm.value.process.team.map((team) => team.initial),
    };

    await TaskServices.postCreateTask(dataDTO);

    // TODO: Replace with _id from create task
    taskId.value = '66fb6b394374e14b8768debf';

    eventBus.emit('detail-task:create', { taskId: taskId.value });

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
    eventBus.emit('detail-task:update', { taskId: taskId.value });
  } catch {
    // PASS
  }
};

/**
 * This function is called whenever there will be changes in the detail task. (including create task and edit task)
 */
const handleTaskChange = async (): Promise<void> => {
  // Skip this function when title input is disabled.
  if (isTitleInputDisabled.value) return;

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
  taskDetail,
  () => {
    // Fill the initial legend options values
    legendOptions.value = {
      process: [
        {
          label: taskDetail.value.process.name,
          value: taskDetail.value.process,
        },
      ],
      module: [
        {
          label: taskDetail.value.module.name,
          value: taskDetail.value.module,
        },
      ],
    };

    if (taskDetail.value.subModule) {
      legendOptions.value.submodule = [
        {
          label: taskDetail.value.subModule.name,
          value: taskDetail.value.subModule,
        },
      ];
    }

    // Fill the initial legend form values
    legendForm.value = {
      process: taskDetail.value.process,
      module: taskDetail.value.module,
      title: taskDetail.value.name,
    };

    if (taskDetail.value.subModule) {
      legendForm.value.submodule = taskDetail.value.subModule;
    }
  },
  { deep: true },
);

watch(
  computedLegendForm,
  (value, oldValue) => {
    if (oldValue.process !== undefined && value.process !== oldValue.process) {
      legendForm.value.module = undefined;
    }

    if (oldValue.process !== undefined && value.module !== oldValue.module) {
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
      :tasks="[
        // TODO: Remove and replace this with detail task's data.
        {
          process: {
            _id: '1',
            name: 'Pengonsepan',
            team: [],
          },
          title: 'Process',
          priorityValue: 1,
        },
        {
          process: {
            _id: '2',
            name: 'Detailing',
            team: [],
          },
          title: 'Process',
          priorityValue: 5,
        },
        {
          process: {
            _id: '3',
            name: 'Slicing Komponen Web',
            team: [],
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
        v-if="taskDetail && taskDetail.priority"
        :disabled="isNewTask"
        :label="taskDetail.priority.toString()"
        @click="showDialogNilaiPrioritas = true"
        class="!min-w-8"
        data-wv-section="add-nilai-prioritas-button"
      />
      <Button
        v-else
        :disabled="isNewTask"
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
      <Badge :label="taskDetail?.status ?? 'Backlog'" />
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
