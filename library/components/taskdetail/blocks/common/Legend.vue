<script setup lang="ts">
import { computed, ComputedRef, inject, Ref, ref, watch } from 'vue';

import { DropdownOption } from 'lib/types/options.type';
import LiteDropdown from 'lib/components/litedropdown/LiteDropdown.vue';
import Button from 'lib/components/button/Button.vue';
import Badge from 'lib/components/badge/Badge.vue';
import ProjectProcessServices from 'lib/services/projectProcess.service';
import { useToast } from 'lib/utils';
import ModuleServices from 'lib/services/module.service';
import SubModuleServices from 'lib/services/submodule.service';
import TaskServices from 'lib/services/task.service';
import { CreateTaskDTO, EditTaskDTO } from 'lib/dto/task.dto';
import { ProjectProcess } from 'lib/types/projectProcess.type';
import { ProjectModule } from 'lib/types/projectModule.type';
import { ProjectSubModule } from 'lib/types/projectSubmodule.type';
import Textarea from 'primevue/textarea';
import eventBus from 'lib/event-bus';
import { TaskDetailData } from 'lib/types/task.type';
import { useLoadingStore } from 'lib/build-entry';
import DialogPriorityValue from './DialogPriorityValue.vue';
import DialogReviewLeader from '../sections/Review/DialogReviewLeader.vue';
import TaskChecklistServices from 'lib/services/taskChecklist.service';
import DialogFinishReview from '../sections/Review/DialogFinishReview.vue';
import DialogConfirmFinishTask from './DialogConfirmFinishTask.vue';

const toast = useToast();
const { setLoading } = useLoadingStore();

const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');
const isNewTask = inject<Ref<boolean>>('isNewTask');
const legendForm = inject<Ref<TaskLegendForm>>('legendForm');
const loadingTask = inject<Ref<boolean>>('loadingTask');
const userType =
  inject<ComputedRef<'member' | 'admin' | 'pm' | 'teamLeader'>>('userType');

const emit = defineEmits<{
  processChange: [
    process: Pick<ProjectProcess, '_id' | 'name' | 'team' | 'processPosition'>,
  ];
}>();

const projectId = sessionStorage.getItem('projectId');

export type TaskLegend = {
  process: Pick<ProjectProcess, '_id' | 'name' | 'team' | 'processPosition'>;
  module?: Pick<ProjectModule, '_id' | 'name'>;
  submodule?: Pick<ProjectSubModule, '_id' | 'name' | 'repository'>;
  subModule?: Pick<ProjectSubModule, '_id' | 'name' | 'repository'>;
  repository?: string;
  title?: string;
  name?: string;
  priorityValue?: number;
  priority?: number;
  _id?: string;
};

export type TaskLegendForm = Partial<Omit<TaskLegend, 'priorityValue'>>;

export type TaskLegendOptions = {
  process?: DropdownOption[];
  module?: DropdownOption[];
  submodule?: DropdownOption[];
  repository?: DropdownOption[];
};

export type TaskLegendLoading = {
  process?: boolean;
  module?: boolean;
  submodule?: boolean;
};

/**
 * Necessary to watch old and new value changes.
 *
 * @see <https://github.com/vuejs/vue/issues/2164>
 */
/*
 * Const computedLegendForm = computed<TaskLegendForm>(() =>
 *   Object.assign({}, legendForm.value),
 * );
 */
const legendOptions = ref<TaskLegendOptions>({});
const legendLoading = ref<TaskLegendLoading>({
  process: false,
  module: false,
  submodule: false,
});

const dialogPriorityValue = ref<boolean>(false);
const dialogReview = ref<boolean>(false);
const dialogFinishReview = ref<boolean>(false);
const dialogConfirmFinishTask = ref<boolean>(false);

const subModuleVisibility = ref(true);
const repositoryVisibility = ref(true);

const bindProcess = computed(() => legendForm.value.process);
const bindModule = computed(() => legendForm.value.module);
const bindSubModule = computed(() => legendForm.value.submodule);

const getProcessOptions = async (): Promise<void> => {
  if (!projectId) return;
  try {
    legendLoading.value.process = true;

    const { data } = await ProjectProcessServices.getProcessesByUser(projectId);

    legendOptions.value.process = data.data
      .filter((d) => {
        /*
         * Do not show 'API Spec' on the detail task legend page
         * because it is not used in the detail task page.
         */
        const isApiSpec = d.name === 'API Spec';
        return !isApiSpec;
      })
      .map((d) => ({
        label: d.name,
        value: {
          _id: d._id,
          name: d.name,
          team: d.team.map((team) => ({ initial: team.initial })),
          processPosition: d.processPosition,
        },
      }));

    if (legendForm.value.process) {
      const indexFound = legendOptions.value.process.findIndex(
        (d) => d.value?.['_id'] === legendForm.value.process._id,
      );
      if (indexFound !== -1) {
        // Update the process in the form with the matching process from the options
        legendForm.value.process = legendOptions.value.process[indexFound]
          .value as Pick<
          ProjectProcess,
          '_id' | 'name' | 'team' | 'processPosition'
        >;
      }
    }
  } catch (error) {
    toast.add({
      message: 'Data Proses gagal dimuat.',
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

    legendOptions.value.module = data.data
      .filter((d) => {
        /*
         * Filter out modules that are not supposed to be used for the current process.
         * The following modules are only used for their respective processes:
         * - Komponen module is only used for Komponen Web/Mobile process.
         * - Konsep module is only used for Pengonsepan process.
         * - Other modules are used for other processes.
         */
        const isComponent =
          [
            'Komponen Web',
            'Komponen Mobile',
            'Slicing Komponen Web',
            'Slicing Komponen Mobile',
          ].includes(legendForm.value.process.name) && d.name === 'Komponen';

        const isConcept =
          legendForm.value.process.name === 'Pengonsepan' &&
          d.name === 'Konsep';

        const isOtherModule =
          ![
            'Komponen Web',
            'Komponen Mobile',
            'Slicing Komponen Web',
            'Slicing Komponen Mobile',
            'Pengonsepan',
          ].includes(legendForm.value.process.name) &&
          !['Komponen', 'Konsep'].includes(d.name);

        if (isComponent || isConcept || isOtherModule) {
          return true;
        }
        return false;
      })
      .map((d) => ({
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
        repository: d.repository,
      },
    }));

    if (legendForm.value.submodule) {
      const indexFound = legendOptions.value.submodule.findIndex(
        (d) => d.value?.['_id'] === legendForm.value.submodule._id,
      );
      if (indexFound !== -1) {
        // Update the submodule in the form with the matching submodule from the options
        legendForm.value.submodule = legendOptions.value.submodule[indexFound]
          .value as Pick<ProjectSubModule, '_id' | 'name' | 'repository'>;
      }
    }
  } catch (error) {
    toast.add({
      message: 'Data Sub Modul gagal dimuat.',
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
 * 1. If the process hasn't been selected.
 * 2. If the module hasn't been selected.
 * 3. If the submodule visibility is set to false.
 */
const isSubmoduleDropdownDisabled = computed<boolean>(() => {
  const { process, module } = legendForm.value;
  if (subModuleVisibility.value) {
    return !process || !module;
  }
  return true;
});

/**
 * Disable Rules:
 * 1. If the process hasn't been selected.
 * 2. If the module hasn't been selected.
 * 3. If the submodule visibility is set to true and submodule hasn't been selected.
 */
const isTitleInputDisabled = computed<boolean>(() => {
  const { process, module, submodule } = legendForm.value;
  const isProcessSelected = !!process;
  const isModuleSelected = !!module;
  const isSubmoduleSelected = subModuleVisibility.value ? !!submodule : true;
  return !(isProcessSelected && isModuleSelected && isSubmoduleSelected);
});

const focusTitleInput = (): void => {
  const titleInputEl = document.querySelector(
    '[placeholder="Nama Task"]',
  ) as HTMLInputElement;
  setTimeout(() => {
    titleInputEl.focus();
  }, 100);
};

const createTask = async (): Promise<void> => {
  if (!legendForm.value.process || !legendForm.value.title) return;
  try {
    const user = JSON.parse(localStorage.getItem('user') as string) ?? {};
    const dataDTO: CreateTaskDTO = {
      project: projectId,
      process: legendForm.value.process._id,
      module: legendForm.value.module?._id,
      subModule: legendForm.value?.submodule?._id,
      repository: legendForm.value?.repository,
      name: legendForm.value.title,
      team: legendForm.value.process.team.map((team) => team.initial),
      assignedTo: ['member', 'teamLeader'].includes(userType.value)
        ? [user._id]
        : undefined,
    };

    const { data } = await TaskServices.postCreateTask(dataDTO);

    taskId.value = data.data;

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

const editTask = async (): Promise<void> => {
  try {
    const dataDTO: EditTaskDTO = {
      project: projectId,
      process: legendForm.value.process._id,
      module: legendForm.value.module?._id,
      subModule: legendForm.value?.submodule?._id,
      name: legendForm.value.title,
    };

    await TaskServices.putEditTask(taskId.value, dataDTO);

    eventBus.emit('detail-task:update', { taskId: taskId.value });
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Data Task gagal diubah.',
      severity: 'error',
      error,
    });
  }
};

/**
 * This function is called whenever there will be changes in the detail task. (including create task and edit task)
 */
const handleTaskChange = async (): Promise<void> => {
  showSubModuleByProcess();
  showRepositoryByProcess();
  emit('processChange', legendForm.value.process);

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

/**
 * This function will show or hide submodule based on the process selection.
 * If the process name is inside `noSubModuleProcesses` or the process position is
 * 'di luar deployment', submodule will be hidden.
 * Otherwise, submodule will be shown.
 */
const showSubModuleByProcess = (): void => {
  const noSubModuleProcesses = [
    'Pengonsepan',
    'Diagram',
    'Wireframe',
    'Komponen Web',
    'Komponen Mobile',
    'Dokumentasi API',
    'User Manual Web',
    'User Manual Mobile',
    'Slicing Komponen Web',
    'Slicing Komponen Mobile',
    'Detailing',
  ];

  const outsideDeploymentProcess =
    legendForm.value?.process?.processPosition?.toLowerCase() ===
    'di luar deployment';

  if (
    noSubModuleProcesses.includes(legendForm.value?.process?.name) ||
    outsideDeploymentProcess
  ) {
    subModuleVisibility.value = false;
    legendForm.value.submodule = undefined;
    legendOptions.value.submodule = [];
  } else {
    subModuleVisibility.value = true;
  }
};

const showRepositoryByProcess = (): void => {
  const noRepositoryProcesses = [
    'Repositori BE',
    'Repositori FE',
    'Repositori Mobile',
    'IOT',
    'Database',
  ];
  if (
    legendForm.value.submodule &&
    !noRepositoryProcesses.includes(legendForm.value.process.name)
  ) {
    repositoryVisibility.value = true;
  } else {
    repositoryVisibility.value = false;
    legendForm.value.repository = undefined;
  }
};

/**
 * Get repository options based on the selected process team.
 *
 * This function will assign repository option based on the selected process team
 * into legendOptions.repository
 *
 * @returns {void}
 */
const getRepositoryOptions = (): void => {
  const selectedProcessTeam = legendForm.value?.process?.team[0]?.initial;
  if (selectedProcessTeam && legendForm.value?.submodule?.repository) {
    const teams = {
      BE: 'backend',
      FE: 'frontend',
      MOB: 'mobile',
    };
    const teamKeys = Object.keys(teams);
    if (teamKeys.includes(selectedProcessTeam)) {
      legendOptions.value.repository =
        legendForm.value?.submodule?.repository[teams[selectedProcessTeam]];
    }
  }
};

const onBlurTitleInput = (): void => {
  if (legendForm.value.title !== taskDetail.value?.name) {
    handleTaskChange();
  }
};

const openReviewDialog = async (): Promise<void> => {
  const checklists = await getChecklists();
  if (checklists.length) {
    dialogReview.value = true;
  } else {
    dialogFinishReview.value = true;
  }
};

const getChecklists = async (): Promise<any[]> => {
  try {
    setLoading(true);
    const { data } = await TaskChecklistServices.getTaskChecklists(
      taskId.value,
    );
    return data?.data;
  } catch (error) {
    toast.add({
      message: 'Gagal memuat data ceklis.',
      error,
    });
    return [];
  } finally {
    setLoading(false);
  }
};

watch(
  taskDetail,
  () => {
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

    showSubModuleByProcess();
    showRepositoryByProcess();
  },
  { deep: true },
);

/*
 * Watch(
 *   computedLegendForm,
 *   (value, oldValue) => {
 *     if (!isNewTask.value) return;
 *     if (oldValue.process !== undefined && value.process !== oldValue.process) {
 *       legendForm.value.module = undefined;
 *       legendOptions.value.module = [];
 *     }
 */

/*
 *     If (oldValue.process !== undefined && value.module !== oldValue.module) {
 *       legendForm.value.submodule = undefined;
 *       legendOptions.value.submodule = [];
 *     }
 *   },
 *   { deep: true },
 * );
 */

watch(bindProcess, (value, oldValue) => {
  if (loadingTask.value || !oldValue || value?._id === oldValue?._id) return;
  legendForm.value.module = undefined;
});

watch(bindModule, (value, oldValue) => {
  if (loadingTask.value || !oldValue || value?._id === oldValue?._id) return;
  legendForm.value.submodule = undefined;
});

watch(bindSubModule, (value, oldValue) => {
  if (loadingTask.value || !oldValue || value?._id === oldValue?._id) return;
  legendForm.value.repository = undefined;
});

watch(isTitleInputDisabled, (value) => {
  if (!value) focusTitleInput();
});
</script>

<template>
  <div class="flex flex-col gap-6 mb-3" data-wv-section="detailtask-legend">
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
              v-if="subModuleVisibility"
              v-model="legendForm.submodule"
              :disabled="isSubmoduleDropdownDisabled"
              :loading="legendLoading.submodule"
              :options="legendOptions.submodule"
              @change="getRepositoryOptions(), handleTaskChange()"
              @show="getSubmoduleOptions"
              data-wv-section="detailtask-submodule-input"
              option-label="label"
              option-value="value"
              placeholder="Sub Modul"
            />
          </div>
          <div>
            <LiteDropdown
              v-if="repositoryVisibility"
              v-model="legendForm.repository"
              :disabled="isSubmoduleDropdownDisabled"
              :options="legendOptions.repository"
              data-wv-section="detailtask-repository-input"
              option-label="name"
              option-value="name"
              placeholder="Repository"
            />
          </div>
        </div>
      </div>
      <Button
        v-if="taskDetail && taskDetail.priority"
        :disabled="isNewTask"
        :label="taskDetail.priority.toString()"
        @click="dialogPriorityValue = true"
        class="!min-w-8"
        data-wv-section="add-nilai-prioritas-button"
      />
      <Button
        v-else
        :disabled="isNewTask"
        @click="dialogPriorityValue = true"
        data-wv-section="add-nilai-prioritas-button"
        icon="add"
        label="Nilai Prioritas"
        severity="secondary"
      />
    </div>

    <div class="flex justify-between items-start">
      <div class="w-8/10" data-wv-section="detailtask-title-wrapper">
        <Textarea
          ref="titleInput"
          v-model="legendForm.title"
          :disabled="isTitleInputDisabled"
          @blur="onBlurTitleInput"
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
      <div class="flex items-center gap-2">
        <Badge :label="taskDetail?.status ?? 'Backlog'" format="nowrap" />
        <Button
          v-if="['Sprint', 'Fixing Bug'].includes(taskDetail?.status)"
          @click="dialogConfirmFinishTask = true"
          label="Tandai Selesai"
          severity="secondary"
        />
        <Button
          v-if="taskDetail?.status === 'Pending Review Leader'"
          @click="openReviewDialog"
          label="Review"
          severity="secondary"
        />
      </div>
    </div>
  </div>
  <DialogPriorityValue
    v-model:visible="dialogPriorityValue"
    :priority-value="taskDetail?.priority"
  />
  <DialogReviewLeader
    v-model:visible="dialogReview"
    @saved="eventBus.emit('detail-task:update', { taskId: taskId })"
  />
  <DialogFinishReview
    v-model:visible="dialogFinishReview"
    @saved="eventBus.emit('detail-task:update', { taskId: taskId })"
  />
  <DialogConfirmFinishTask
    v-model:visible="dialogConfirmFinishTask"
    :task-detail="taskDetail"
    @saved="eventBus.emit('detail-task:update', { taskId: taskId })"
  />
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
