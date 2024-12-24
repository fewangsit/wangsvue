<script setup lang="ts">
import {
  computed,
  ComputedRef,
  inject,
  Ref,
  ref,
  shallowRef,
  watch,
} from 'vue';

import { DropdownOption } from 'lib/types/options.type';
import LiteDropdown from 'lib/components/litedropdown/LiteDropdown.vue';
import Button from 'lib/components/button/Button.vue';
import Badge from 'lib/components/badge/Badge.vue';
import {
  ProjectProcessServices,
  ModuleServices,
  SubModuleServices,
  TaskServices,
  TaskChecklistServices,
} from 'wangsit-api-services';
import { useToast } from 'lib/utils';
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
import DialogFinishReview from '../sections/Review/DialogFinishReview.vue';
import DialogConfirmFinishTask from './DialogConfirmFinishTask.vue';
import DialogConfirmEdit from './DialogConfirmEdit.vue';
import { WangsitStatus } from 'lib/types/wangsStatus.type';
import DialogReportBug from 'lib/components/dialogreportbug/DialogReportBug.vue';
import SonarQubeSummary from './SonarQubeSummary.vue';
import DialogConfirmApproval from './DialogConfirmApproval.vue';

const toast = useToast();
const { setLoading } = useLoadingStore();

const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');
const isNewTask = inject<Ref<boolean>>('isNewTask');
const legendForm = inject<Ref<TaskLegendForm>>('legendForm');
const loadingTask = inject<Ref<boolean>>('loadingTask');
const userType =
  inject<ComputedRef<'member' | 'admin' | 'pm' | 'teamLeader' | 'guest'>>(
    'userType',
  );
const isProcessTeamLeader = inject<ComputedRef<boolean>>('isProcessTeamLeader');
const isMember = inject<ComputedRef<boolean>>('isMember');
const isApproverHasAccess = inject<ComputedRef<boolean>>('isApproverHasAccess');

const props = defineProps<{
  initialModule?: {
    _id: string;
    name?: string;
  };
  initialSubModule?: {
    _id: string;
    name?: string;
    repository?: string;
  };
  productBacklogItemId?: string;
  approvalId?: string;
  isAllChecklistDone?: boolean;
  isAllDependencyDone?: boolean;
  hasRequestedChecklist?: boolean;
  isAllEndpointChecked?: boolean;
}>();

const emit = defineEmits<{
  processChange: [
    process: Pick<ProjectProcess, '_id' | 'name' | 'team' | 'processPosition'>,
  ];
  create: [];
}>();

const projectId = inject<Ref<string>>('projectId');

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

const defaultProcesses = [
  {
    name: 'Pengonsepan',
    hasSubModule: false,
    hasRepository: false,
  },
  {
    name: 'Diagram',
    hasSubModule: false,
    hasRepository: false,
  },
  {
    name: 'Wireframe',
    hasSubModule: false,
    hasRepository: false,
  },
  {
    name: 'Komponen Web',
    hasSubModule: false,
    hasRepository: false,
  },
  {
    name: 'Komponen Mobile',
    hasSubModule: false,
    hasRepository: false,
  },
  {
    name: 'API Spec',
    hasSubModule: true,
    hasRepository: false,
  },
  {
    name: 'Database',
    hasSubModule: true,
    hasRepository: false,
  },
  {
    name: 'Create API',
    hasSubModule: true,
    hasRepository: true,
  },
  {
    name: 'Slicing Komponen Web',
    hasSubModule: false,
    hasRepository: false,
  },
  {
    name: 'Slicing Web',
    hasSubModule: true,
    hasRepository: true,
  },
  {
    name: 'Slicing Komponen Mobile',
    hasSubModule: false,
    hasRepository: false,
  },
  {
    name: 'Slicing Mobile',
    hasSubModule: true,
    hasRepository: true,
  },
  {
    name: 'IOT',
    hasSubModule: true,
    hasRepository: false,
  },
  {
    name: 'Dokumentasi API',
    hasSubModule: false,
    hasRepository: false,
  },
  {
    name: 'User Manual Web',
    hasSubModule: false,
    hasRepository: false,
  },
  {
    name: 'User Manual Mobile',
    hasSubModule: false,
    hasRepository: false,
  },
  {
    name: 'Detailing',
    hasSubModule: false,
    hasRepository: false,
  },
  {
    name: 'Connect API Web',
    hasSubModule: true,
    hasRepository: true,
  },
  {
    name: 'Connect API Mobile',
    hasSubModule: true,
    hasRepository: true,
  },
];

const legendOptions = ref<TaskLegendOptions>({});
const legendLoading = ref<TaskLegendLoading>({
  process: false,
  module: false,
  submodule: false,
});

const approvalId = ref(props.approvalId);

const dialogPriorityValue = shallowRef<boolean>(false);
const dialogReview = shallowRef<boolean>(false);
const dialogFinishReview = shallowRef<boolean>(false);
const dialogConfirmFinishTask = shallowRef<boolean>(false);
const dialogConfirmEdit = shallowRef<boolean>(false);
const dialogConfirmApproval = shallowRef<boolean>(false);
const dialogReportBug = shallowRef<boolean>(false);

const isApproved = shallowRef<boolean>(false);

const subModuleVisibility = shallowRef<boolean>(true);
const repositoryVisibility = shallowRef<boolean>(true);

const bindProcess = computed(() => legendForm.value.process);
const bindModule = computed(() => legendForm.value.module);
const bindSubModule = computed(() => legendForm.value.submodule);

/**
 * The condition for isLegendEditable is as follows:
 * - The task's status is 'Backlog' or 'Waiting for Approval' (i.e., the task is in the backlog and has not been started yet).
 * - The user is not a guest (i.e., 'admin' | 'pm' | 'teamLeader' | 'member').
 *
 * If both conditions are true or the task is new, then the legend is editable.
 */
const isLegendEditable = computed(() => {
  const isBacklog = taskDetail.value?.status
    ? taskDetail.value?.status === 'Backlog'
    : true;

  return (
    (isBacklog && userType.value !== 'guest') ||
    isNewTask.value ||
    isApproverHasAccess.value
  );
});

/**
 * Determines if the priority value input should be disabled based on the task's status and user type.
 *
 * Conditions for disabling the input should include at least one of the following conditions:
 * - The task is new.
 * - The user is a guest and does not have approver access for the task.
 * - The task is one of the following statuses: 'Selesai', 'Reported Bug', 'Pending Review Leader'.
 *
 * @returns {boolean} True if the priority value input should be disabled, false otherwise.
 */
const isPriorityValueDisabled = computed(() => {
  return (
    isNewTask.value ||
    (userType.value === 'guest' && !isApproverHasAccess.value) ||
    (
      ['Selesai', 'Reported Bug', 'Pending Review Leader'] as WangsitStatus[]
    ).includes(taskDetail.value?.status)
  );
});

/**
 * Disable Rules:
 * 1. If the process hasn't been selected.
 * 2. If the props.initialModule is defined.
 * 3. If the legend is not editable.
 */
const isModuleDropdownDisabled = computed<boolean>(() => {
  return (
    !isLegendEditable.value ||
    !legendForm.value.process ||
    !!props.initialModule
  );
});

/**
 * Disable Rules:
 * 1. If the process hasn't been selected.
 * 2. If the module hasn't been selected.
 * 3. If the props.initialSubModule is defined.
 * 4. If the legend is not editable..
 * 5. If the submodule visibility is set to false.
 */
const isSubmoduleDropdownDisabled = computed<boolean>(() => {
  const { process, module } = legendForm.value;
  if (subModuleVisibility.value) {
    return (
      !isLegendEditable.value || !process || !module || !!props.initialSubModule
    );
  }
  return true;
});

/**
 * Determines if the repository dropdown should be disabled.
 *
 * The dropdown is disabled if:
 * 1. The process hasn't been selected.
 * 2. The module hasn't been selected.
 * 3. The current user is a guest and does not have approver access for the task.
 * 4. The task status is either 'Selesai', 'Reported Bug', or 'Pending Review Leader'.
 *
 * If repository visibility is false, the dropdown is always disabled.
 */
const isRepositoryDropdownDisabled = computed<boolean>(() => {
  const { process, module } = legendForm.value;
  if (repositoryVisibility.value) {
    return (
      !process ||
      !module ||
      (userType.value === 'guest' && !isApproverHasAccess.value) ||
      (
        ['Selesai', 'Reported Bug', 'Pending Review Leader'] as WangsitStatus[]
      ).includes(taskDetail.value?.status)
    );
  }
  return true;
});

/**
 * Condition to disable the title input field :
 *
 * 1. The process hasn't been selected.
 * 2. The module hasn't been selected.
 * 3. The submodule hasn't been selected (if the submodule is visible).
 * 4. The task status is either 'Selesai' or 'Reported Bug'.
 * 5. It is not a new task and the user is a guest
 *    without approver access, or not an admin, pm, team leader, or member assigned to the task.
 */
const isTitleInputDisabled = computed<boolean>(() => {
  const { process, module, submodule } = legendForm.value;
  const isProcessSelected = !!process;
  const isModuleSelected = !!module;
  const isSubmoduleSelected = subModuleVisibility.value ? !!submodule : true;
  const isUserAuthorized =
    isNewTask.value || // If it's a new task, the user is automatically authorized
    ['admin', 'pm', 'teamLeader'].includes(userType.value) ||
    isApproverHasAccess.value ||
    isMember.value;

  return (
    !(isProcessSelected && isModuleSelected && isSubmoduleSelected) ||
    (['Selesai', 'Reported Bug'] as WangsitStatus[]).includes(
      taskDetail.value?.status,
    ) ||
    !isUserAuthorized
  );
});

/**
 * Computed property to determine if the "Mark as Done" button should be disabled.
 *
 * The button is disabled if:
 * - The repository is visible but not selected in the legend form.
 * - Not all dependencies are done.
 * - Not all checklists are done.
 * - There's any requested checklist (waiting for approval).
 * - The task process is 'API Spec' and does not have any task API / endpoint.
 *
 * @returns {boolean} - True if the button should be disabled, false otherwise.
 */
const isMarkAsDoneDisabled = computed(
  () =>
    (repositoryVisibility.value && !legendForm.value.repository) ||
    !props.isAllDependencyDone ||
    !props.isAllChecklistDone ||
    props.hasRequestedChecklist ||
    (taskDetail.value?.process?.name === 'API Spec' &&
      !props.isAllEndpointChecked),
);

const getProcessOptions = async (): Promise<void> => {
  try {
    legendLoading.value.process = true;

    const { data } = await ProjectProcessServices.getProcessesByUser(
      projectId.value,
    );

    legendOptions.value.process = data.data
      .filter((d) => {
        /*
         * Conditions for process options in the detail task legend section:
         *
         * 1. If the initial submodule is defined, only show the default processes that have submodules
         *    and all custom processes by user.
         * 2. If the initial module is defined, then :
         *    a. If the initial module is 'Komponen', only show default processes that have 'Komponen' in their names.
         *    b. If the initial module is 'Konsep', only show 'Pengonsepan' process.
         *    c. Otherwise show all processes by user EXCEPT 'API Spec', 'Create API', 'Pengonsepan' and processes that have 'Komponen' in their names.
         * 3. Otherwise show all processes by user EXCEPT 'API Spec', 'Create API'.
         */
        const isApiTaskBE = ['API Spec', 'Create API'].includes(d.name);

        const componentModuleProcess = defaultProcesses
          .filter((process) => process.name.includes('Komponen'))
          .map((process) => process.name)
          .includes(d.name);

        if (props.initialSubModule) {
          const hasSubModuleProcess = !defaultProcesses
            .filter((process) => !process.hasSubModule)
            .map((process) => process.name)
            .includes(d.name);
          return hasSubModuleProcess && !isApiTaskBE;
        } else if (props.initialModule) {
          const initialModuleConcept =
            legendForm.value.module?.name === 'Konsep';
          const initialModuleComponent =
            legendForm.value.module?.name === 'Komponen';
          if (initialModuleComponent) {
            return componentModuleProcess;
          } else if (initialModuleConcept) {
            return d.name === 'Pengonsepan';
          }
          return (
            !isApiTaskBE && !componentModuleProcess && d.name !== 'Pengonsepan'
          );
        }
        return !isApiTaskBE;
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

/**
 * Asynchronously fetches and sets module options for the task legend.
 *
 * Filters the modules based on the current process:
 *   1. If the process involves components, only the 'Komponen' module is shown.
 *   2. If the process is 'Pengonsepan', only the 'Konsep' module is shown.
 *   3. Otherwise, excludes 'Komponen' and 'Konsep' from the options.
 */
const getModuleOptions = async (): Promise<void> => {
  try {
    legendLoading.value.module = true;

    const { data } = await ModuleServices.getModuleList(projectId.value);

    legendOptions.value.module = data.data
      .filter((d) => {
        const isProcessComponent = defaultProcesses
          .filter((process) => process.name.includes('Komponen'))
          .map((process) => process.name)
          .includes(legendForm.value.process.name);
        const isProcessConcept =
          legendForm.value.process.name === 'Pengonsepan';

        if (isProcessComponent) {
          return d.name === 'Komponen';
        }
        if (isProcessConcept) {
          return d.name === 'Konsep';
        }

        return !['Komponen', 'Konsep'].includes(d.name);
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
  try {
    legendLoading.value.submodule = true;

    const { data } = await SubModuleServices.getSubmoduleList(projectId.value, {
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

const getRepositoryOptions = async (): Promise<void> => {
  try {
    await getSubmoduleOptions();
    assignRepository();
  } catch (error) {
    toast.add({
      message: 'Data repository gagal dimuat.',
      error,
    });
  }
};

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
      project: projectId.value,
      process: legendForm.value.process._id,
      module: legendForm.value.module?._id,
      subModule: legendForm.value?.submodule?._id,
      productBacklogItem: props.productBacklogItemId,
      repository: legendForm.value?.repository,
      name: legendForm.value.title,
      team: legendForm.value.process.team.map((team) => team.initial),
      assignedTo: ['member', 'teamLeader', 'guest'].includes(userType.value)
        ? [user._id]
        : undefined,
    };

    const { data } = await TaskServices.postCreateTask(dataDTO);

    taskId.value = data.data;

    emit('create');

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
      project: projectId.value,
      process: legendForm.value.process._id,
      module: legendForm.value.module?._id,
      subModule: legendForm.value?.submodule?._id,
      name: legendForm.value.title,
      repository: legendForm.value?.repository ?? '',
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

  if (legendForm.value?.process && legendForm.value?.submodule) {
    assignRepository();
  }

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
  const noSubModuleProcesses = defaultProcesses
    .filter((process) => !process.hasSubModule)
    .map((process) => process.name);

  const outsideDeploymentProcess =
    legendForm.value?.process?.processPosition?.toLowerCase() ===
    'di luar deployment';

  if (
    ['Komponen', 'Konsep'].includes(legendForm.value?.module?.name) ||
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
  const noRepositoryProcesses = defaultProcesses
    .filter((process) => !process.hasRepository)
    .map((process) => process.name);
  if (
    legendForm.value.submodule &&
    !noRepositoryProcesses.includes(legendForm.value?.process?.name)
  ) {
    repositoryVisibility.value = true;
  } else {
    repositoryVisibility.value = false;
    legendForm.value.repository = undefined;
  }
};

/**
 * This function will assign repository based on the selected process team and submodule.
 * If the selected process team is 'BE', 'FE', or 'MOB', the repository will be filtered
 * based on the selected process team and submodule repository.
 * The repository will be assigned to the legendForm.value.repository immediately.
 */
const assignRepository = (): void => {
  const selectedProcessTeam = legendForm.value?.process?.team[0]?.initial;
  if (selectedProcessTeam && legendForm.value?.submodule?.repository) {
    const teams = {
      BE: 'backend',
      FE: 'frontend',
      MOB: 'mobile',
    };
    const teamKeys = Object.keys(teams);
    if (teamKeys.includes(selectedProcessTeam)) {
      const repos =
        legendForm.value?.submodule?.repository[teams[selectedProcessTeam]];
      legendOptions.value.repository = repos.map((repo) => ({
        label: repo.name,
        value: repo.name,
      }));

      legendForm.value.repository =
        legendOptions.value?.repository?.length && repositoryVisibility.value
          ? (legendOptions.value?.repository?.[0]?.value as string)
          : undefined;
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
  const checklistItems = checklists.flatMap((item) => item.checklistItems);
  if (checklistItems.length) {
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

const loadInitialModule = async (): Promise<void> => {
  try {
    const { data } = await ModuleServices.getModuleList(projectId.value, {
      name: JSON.stringify([props.initialModule._id]),
    });
    if (data?.data?.length) {
      const module = data.data[0];
      legendForm.value.module = {
        _id: module._id,
        name: module.name,
      };
      legendOptions.value.module = [
        { label: module.name, value: legendForm.value.module },
      ];
    }
  } catch (error) {
    toast.add({
      message: 'Gagal memuat data modul.',
      error,
    });
  }
};

const loadInitialSubModule = async (): Promise<void> => {
  try {
    const { data } = await SubModuleServices.getSubmoduleList(projectId.value, {
      name: JSON.stringify([props.initialSubModule._id]),
    });
    if (data?.data?.data?.length) {
      const subModule = data?.data?.data[0];
      legendForm.value.submodule = {
        _id: subModule._id,
        name: subModule.name,
        repository: subModule.repository,
      };
      legendOptions.value.submodule = [
        { label: subModule.name, value: legendForm.value.submodule },
      ];
    }
  } catch (error) {
    toast.add({
      message: 'Gagal memuat data sub modul.',
      error,
    });
  }
};

const loadInitialData = async (): Promise<void> => {
  try {
    setLoading(true);
    if (props.initialModule && !props.initialModule?.name) {
      await loadInitialModule();
    }
    if (props.initialSubModule && !props.initialSubModule?.name) {
      await loadInitialSubModule();
    }
    showSubModuleByProcess();
    showRepositoryByProcess();
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const reportBugTask = async (note?: string): Promise<void> => {
  try {
    setLoading(true);
    const { data } = await TaskServices.reportBugTask(taskId.value, {
      note: note,
    });
    if (data) {
      toast.add({
        message: 'Task telah direport bug.',
        severity: 'success',
      });
      dialogReportBug.value = false;
      eventBus.emit('detail-task:update', { taskId: taskId.value });
    }
  } catch (error) {
    toast.add({
      message: 'Task gagal direport bug.',
      error,
    });
  } finally {
    setLoading(false);
  }
};

const openApprovalDialogConfirm = (approvalState: boolean): void => {
  isApproved.value = approvalState;
  dialogConfirmApproval.value = true;
};

const onSubmitApproval = (): void => {
  if (
    taskDetail.value?.status === 'Waiting for Approval' &&
    !isApproved.value
  ) {
    eventBus.emit('detail-task:delete', { taskId: taskId.value });
  } else {
    approvalId.value = null;
    eventBus.emit('detail-task:update', { taskId: taskId.value });
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
      if (taskDetail.value.repository) {
        legendOptions.value.repository = [
          {
            label: taskDetail.value.repository,
            value: taskDetail.value.repository,
          },
        ];
      }
    }

    // Fill the initial legend form values
    legendForm.value = {
      process: taskDetail.value.process,
      module: taskDetail.value.module,
      title: taskDetail.value.name,
    };

    if (taskDetail.value.subModule) {
      legendForm.value.submodule = taskDetail.value.subModule;
      if (taskDetail.value.repository) {
        legendForm.value.repository = taskDetail.value.repository;
      }
    }

    showSubModuleByProcess();
    showRepositoryByProcess();
  },
  { deep: true },
);

/**
 * Watches for changes in the `bindProcess` object and performs specific actions
 * on the `legendForm` module based on the transition of `name` values
 * between the old and new process states.
 *
 * Conditions handled:
 * 1. Leaving the "Pengonsepan" process: Clears the module when transitioning
 *    from "Pengonsepan" to any other process.
 * 2. Leaving a default component process: Clears the module when transitioning
 *    from a process included in `defaultComponentProcesses` to one that is not.
 * 3. Entering a special process: Clears the module when transitioning from
 *    a non-"Pengonsepan" and non-default component process to either "Pengonsepan"
 *    or a process included in `defaultComponentProcesses`.
 *
 * Skips execution if:
 * - The `loadingTask` is active.
 * - The `bindProcess` value is unchanged.
 * - The new process `_id` matches the old process `_id`.
 *
 * @param {Object} value - The new value of `bindProcess`.
 * @param {Object} oldValue - The previous value of `bindProcess`.
 * @property {string} value._id - Unique identifier of the new process.
 * @property {string} oldValue._id - Unique identifier of the old process.
 * @property {string} value.name - Name of the new process.
 * @property {string} oldValue.name - Name of the old process.
 *
 * @requires legendForm - A reactive object whose `module` property is updated based on process transitions.
 * @requires loadingTask - A reactive boolean that halts execution when `true`.
 * @requires defaultProcesses - A collection of process objects used to derive `defaultComponentProcesses`,
 *                              which lists all processes containing "Komponen" in their names.
 */
watch(bindProcess, (value, oldValue) => {
  if (loadingTask.value || !oldValue || value?._id === oldValue?._id) return;

  const oldProcess = oldValue?.name || '';
  const newProcess = value?.name || '';

  const defaultComponentProcesses = defaultProcesses
    .filter((process) => process.name.includes('Komponen'))
    .map((process) => process.name);

  const isLeavingPengonsepan =
    oldProcess === 'Pengonsepan' && newProcess !== 'Pengonsepan';
  const isLeavingKomponen =
    defaultComponentProcesses.includes(oldProcess) &&
    !defaultComponentProcesses.includes(newProcess);
  const isEnteringSpecialProcess =
    oldProcess !== 'Pengonsepan' &&
    !defaultComponentProcesses.includes(oldProcess) &&
    (newProcess === 'Pengonsepan' ||
      defaultComponentProcesses.includes(newProcess));

  if (isLeavingPengonsepan || isLeavingKomponen || isEnteringSpecialProcess) {
    legendForm.value.module = undefined;
  }
});

watch(bindModule, (value, oldValue) => {
  if (loadingTask.value || !oldValue || value?._id === oldValue?._id) return;
  legendForm.value.submodule = undefined;
});

watch(bindSubModule, (value, oldValue) => {
  if (loadingTask.value || !oldValue || value?._id === oldValue?._id) return;
  if (legendForm.value?.process && value) {
    assignRepository();
    return;
  }
  legendForm.value.repository = undefined;
});

watch(isTitleInputDisabled, (value) => {
  if (!value) focusTitleInput();
});

watch(
  projectId,
  (value) => {
    if (value && props.initialModule) {
      loadInitialData();
    }
  },
  { immediate: true },
);
</script>

<!-- eslint-disable vue/html-indent -->
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
              :disabled="!isLegendEditable"
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
              @change="handleTaskChange()"
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
              :disabled="isRepositoryDropdownDisabled"
              :options="legendOptions.repository"
              @change="handleTaskChange()"
              @show="getRepositoryOptions"
              @update:model-value="handleTaskChange()"
              data-wv-section="detailtask-repository-input"
              option-label="label"
              option-value="value"
              placeholder="Repository"
            />
          </div>
        </div>
      </div>
      <Button
        v-if="taskDetail && taskDetail.priority"
        :disabled="isPriorityValueDisabled"
        :label="taskDetail.priority.toString()"
        @click="dialogPriorityValue = true"
        class="!min-w-8"
        data-wv-section="add-nilai-prioritas-button"
      />
      <Button
        v-else
        :disabled="isPriorityValueDisabled"
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
        <Badge
          :label="taskDetail?.status ?? 'Backlog'"
          :severity="
            taskDetail?.status === 'Waiting for Approval'
              ? 'warning'
              : undefined
          "
          format="nowrap"
        />
        <Button
          v-if="
            taskDetail?.status === 'Selesai' &&
            taskDetail?.process?.name === 'API Spec' &&
            userType !== 'guest'
          "
          @click="dialogConfirmEdit = true"
          label="Edit"
          severity="secondary"
        />
        <Button
          v-if="
            ['Sprint', 'Fixing Bug', 'Penyesuaian'].includes(
              taskDetail?.status,
            ) && isMember
          "
          :disabled="isMarkAsDoneDisabled"
          @click="dialogConfirmFinishTask = true"
          label="Tandai Selesai"
          severity="secondary"
        />
        <Button
          v-if="
            taskDetail?.status === 'Pending Review Leader' &&
            isProcessTeamLeader
          "
          @click="openReviewDialog"
          label="Review"
          severity="secondary"
        />
        <Button
          v-if="taskDetail?.status === 'Selesai' && !isMember"
          @click="dialogReportBug = true"
          label="Report Bug"
          severity="danger"
        />
        <template v-if="isApproverHasAccess && approvalId">
          <Button
            @click="openApprovalDialogConfirm(false)"
            label="Tolak"
            severity="danger"
          />
          <Button
            @click="openApprovalDialogConfirm(true)"
            label="Setuju"
            severity="success"
          />
        </template>
      </div>
    </div>

    <SonarQubeSummary
      v-if="!isNewTask && taskDetail?.sonarqube"
      :name="taskDetail?.sonarqube"
      :process-team="legendForm.process?.team?.[0]?.initial"
    />
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
    @report-bug="dialogReportBug = true"
    @saved="eventBus.emit('detail-task:update', { taskId: taskId })"
  />

  <DialogConfirmFinishTask
    v-model:visible="dialogConfirmFinishTask"
    :task-detail="taskDetail"
    @saved="eventBus.emit('detail-task:update', { taskId: taskId })"
  />

  <DialogConfirmEdit
    v-model:visible="dialogConfirmEdit"
    :task-detail="taskDetail"
    @saved="eventBus.emit('detail-task:update', { taskId: taskId })"
  />

  <DialogConfirmApproval
    v-model:visible="dialogConfirmApproval"
    :approval-id="approvalId"
    :is-approved="isApproved"
    :status="taskDetail?.status"
    @saved="onSubmitApproval"
  />

  <DialogReportBug v-model:visible="dialogReportBug" @submit="reportBugTask" />
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
