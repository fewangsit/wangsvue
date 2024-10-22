<!-- eslint-disable no-nested-ternary -->
<script setup lang="ts">
import Icon from 'lib/components/icon/Icon.vue';
import MultiSelect from 'lib/components/multiselect/MultiSelect.vue';
import TaskServices from 'lib/services/task.service';
import ProjectProcessServices from 'lib/services/projectProcess.service';
import { TaskDependency, TaskDetail } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import { computed, inject, Ref, ref, watch } from 'vue';
import TaskDependencyServices from 'lib/services/taskDependency.service';
import Button from 'lib/components/button/Button.vue';
import UserName from 'lib/components/username/UserName.vue';
import Badge from 'lib/components/badge/Badge.vue';
import InputCaption from './InputCaption.vue';
import ModuleServices from 'lib/services/module.service';
import { ProjectModule } from 'lib/types/projectModule.type';
import DialogCustomDependency from './Dialog/DialogCustomDependency.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import SubModuleServices from 'lib/services/submodule.service';

const toast = useToast();

const projectId = sessionStorage.getItem('projectId') ?? '';

const whitelistIframeTag = /<\s*\/?\s*(iframe)\b.*?>/;

const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetail>>('taskDetail');
const isNewTask = inject<Ref<boolean>>('isNewTask');

const projectModules = ref<ProjectModule[]>();

const processDependencies = ref<TaskDependency[]>();
const taskDependencies = ref<TaskDependency[]>();
const dependencies = ref<TaskDependency[]>();

const loadingData = ref(false);
const showDialogCustomDependency = ref(false);

const taskProcess = computed(() => taskDetail.value?.process ?? undefined);

const customProcessOptions = computed(() =>
  processDependencies.value
    .filter((processDep) => {
      const isConcept = processDep.process.name === 'Pengonsepan';
      const isComponent = [
        'Komponen Web',
        'Komponen Mobile',
        'Slicing Komponen Web',
        'Slicing Komponen Mobile',
      ].includes(processDep.process.name);
      return !isConcept && !isComponent;
    })
    .map((processDep) => ({
      label: processDep.process.name,
      value: processDep.process,
    })),
);

const getTaskOptions = async (args: {
  index: number;
  processId: string;
  moduleId: string;
  subModuleId?: string;
}): Promise<void> => {
  try {
    dependencies.value[args.index].loading = true;

    const params = {
      project: JSON.stringify([projectId]),
      process: JSON.stringify([args.processId]),
      module: JSON.stringify([args.moduleId]),
      subModule: args.subModuleId
        ? JSON.stringify([args.subModuleId])
        : undefined,
      taskOptions: true,
    };
    const { data: response } = await TaskServices.getTaskOptions(params);
    if (response) {
      dependencies.value[args.index].options = response.data.taskOptions;
    }
  } catch (error) {
    toast.add({
      message: 'Opsi untuk task gagal dimuat.',
      error,
    });
  } finally {
    dependencies.value[args.index].loading = false;
  }
};

const loadData = async (): Promise<void> => {
  try {
    loadingData.value = true;

    projectModules.value = await getProjectModules();

    processDependencies.value = await getProcessDependencies();
    taskDependencies.value = await getTaskDependencies();

    // Create a new array based on processDependencies and taskDependencies
    dependencies.value = processDependencies.value.map((process) => {
      // Find the corresponding task from taskDependencies based on process id
      const taskData = taskDependencies.value.find(
        (task) =>
          task.process._id === process.process._id &&
          task.module._id === process.module._id,
      );

      // If taskData exists, assign the tasks to this process
      return taskData
        ? {
            ...process,
            task: taskData.task,
            selectedOptions: taskData.task.map((task) => task._id),
            subModuleVisibility: !!taskData.subModule,
          }
        : { ...process, subModuleVisibility: !!process.subModule };
    });

    // Iterate through taskDependencies and add new processes that don't exist in processDependencies
    taskDependencies.value.forEach((task) => {
      // Check if the task's process id exists in dependencies
      const processExists = dependencies.value.some(
        (process) =>
          process.process._id === task.process._id &&
          process.module._id === task.module._id,
      );

      // If it doesn't exist, add it to dependencies
      if (!processExists) {
        dependencies.value.push({
          processOptions: customProcessOptions.value,
          process: { _id: task.process?._id, name: task.process?.name },
          module: { _id: task.module?._id, name: task.module?.name },
          subModule: task.subModule
            ? { _id: task.subModule?._id, name: task.subModule?.name }
            : undefined,
          task: task.task,
          options: [],
          loading: false,
          custom: true,
          key: 0,
        });
      }
    });

    /*
     * Loop through each dependency and get the task options for each dependency
     * if the selectedOptions array is not empty
     */
    await Promise.all(
      dependencies.value.map(async (dep, index) => {
        // If the selectedOptions array is not empty, get the task options
        if (dep.selectedOptions?.length) {
          // Call the getTaskOptions function with the current index, processId, moduleId and subModuleId
          await getTaskOptions({
            index,
            processId: dep.process._id,
            moduleId: dep.module._id,
            subModuleId: dep.subModule?._id,
          });
        }
      }),
    );
  } catch (error) {
    console.error(error);
  } finally {
    loadingData.value = false;
  }
};

const getProcessDependencies = async (): Promise<TaskDependency[]> => {
  try {
    const { data: response } = await ProjectProcessServices.getProcessList(
      projectId,
      { name: JSON.stringify([taskDetail?.value?.process.name]) },
      'active',
    );
    if (response) {
      const conceptModule = projectModules.value?.find(
        (module) => module.name === 'Konsep',
      );
      const componentModule = projectModules.value?.find(
        (module) => module.name === 'Komponen',
      );
      return response?.data?.processProjects?.[0].dependencies?.map(
        (dep: { name: string; _id: string }) => ({
          process: dep,
          module:
            /*
             * If the process name is "Pengonsepan", use the conceptModule.
             * If the process name is one of the following, use the componentModule.
             * Otherwise, use the module of the current task.
             * This is because the dependency process will have a different module
             * depending on the process name.
             */
            dep.name === 'Pengonsepan'
              ? conceptModule
              : [
                    'Komponen Web',
                    'Komponen Mobile',
                    'Slicing Komponen Web',
                    'Slicing Komponen Mobile',
                  ].includes(dep.name)
                ? componentModule
                : taskDetail.value?.module,
          subModule: taskDetail.value?.subModule,
          task: [],
          options: [],
          loading: false,
        }),
      );
    }
    return undefined;
  } catch (error) {
    toast.add({
      message: 'Proses dependensi gagal dimuat.',
      error,
    });
    return undefined;
  }
};

const getTaskDependencies = async (): Promise<TaskDependency[]> => {
  try {
    if (!taskId.value) return;

    const { data } = await TaskDependencyServices.getTaskDependencies(
      taskId.value,
    );

    if (data) {
      return data.data;
    }
    return undefined;
  } catch (error) {
    toast.add({
      message: 'Task dependensi gagal dimuat.',
      error,
    });
    return undefined;
  }
};

const getProjectModules = async (): Promise<ProjectModule[]> => {
  try {
    const { data } = await ModuleServices.getModuleList(projectId);
    if (data) {
      return data.data;
    }
    return undefined;
  } catch (error) {
    toast.add({
      message: 'Projek modul gagal dimuat.',
      error,
    });
    return undefined;
  }
};

/**
 * Update task dependency based on the selected options.
 *
 * @returns {Promise<boolean>} Whether the update was successful or not.
 */
const updateTaskDependency = async (depIndex: number): Promise<boolean> => {
  /*
   * We don't want to perform update if the data is still being loaded
   * because the dependencies might not be up to date yet.
   */
  const dependency = dependencies.value[depIndex];
  if (loadingData.value || !dependency.process || !dependency.module)
    return false;
  try {
    const body = {
      data: dependencies.value.flatMap((item) =>
        item.selectedOptions
          ? item.selectedOptions.map((option) => {
              const taskIndex = item.task.findIndex(
                (task) => task._id === option,
              );
              const caption =
                taskIndex !== -1 ? item.task[taskIndex].caption : undefined;
              return {
                task: option,
                custom: item.custom,
                caption: caption,
              };
            })
          : [],
      ),
    };
    const { data } = await TaskDependencyServices.updateTaskDependencies(
      taskId.value,
      body,
    );
    if (data) {
      await loadData();
      return true;
    }
    return false;
  } catch (error) {
    toast.add({
      message: 'Task dependensi gagal diubah.',
      error,
    });
    return false;
  }
};

/**
 * Update the caption of a task dependency.
 *
 * @param args - An object containing the caption to update, the index of the task, and the index of the dependency.
 * @param args.caption - The new caption to set.
 * @param args.taskIndex - The index of the task to update.
 * @param args.depIndex - The index of the dependency to update.
 * @returns A promise that resolves once the caption is updated.
 */
const updateTaskDependencyCaption = async (args: {
  caption: string;
  taskIndex: number;
  depIndex: number;
}): Promise<void> => {
  try {
    dependencies.value[args.depIndex].task[args.taskIndex].caption =
      args.caption;

    const isUpdated = await updateTaskDependency(args.depIndex);
    if (isUpdated) {
      dependencies.value[args.depIndex].task[args.taskIndex].showCaption =
        false;
    }
  } catch (error) {
    console.error(error);
  }
};

const addCustomDependency = (type: string): void => {
  if (type === 'one-way') {
    dependencies.value.push({
      process: undefined,
      module: undefined,
      subModule: undefined,
      task: [],
      options: [],
      loading: false,
      custom: true,
      processOptions: customProcessOptions.value,
    });
  }
};

/**
 * This function will show or hide submodule based on the process selection.
 * If the process name is inside `noSubModuleProcesses` submodule will be hidden.
 * Otherwise, submodule will be shown.
 */
const showSubModuleByProcess = (depIndex: number): void => {
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

  const haveNoSubModule = noSubModuleProcesses.includes(
    dependencies.value[depIndex].process.name,
  );
  dependencies.value[depIndex].subModuleVisibility = !haveNoSubModule;
  if (haveNoSubModule) {
    dependencies.value[depIndex].subModule = undefined;
  }
};

const getModuleOptions = async (depIndex: number): Promise<void> => {
  if (!projectId) return;
  try {
    const modules = await getProjectModules();
    const currentProcess = dependencies.value[depIndex].process;

    dependencies.value[depIndex].moduleOptions = modules
      ? modules
          .filter((module) => {
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
              ].includes(currentProcess.name) && module.name === 'Komponen';

            const isConcept =
              currentProcess.name === 'Pengonsepan' && module.name === 'Konsep';

            const isOtherModule =
              ![
                'Komponen Web',
                'Komponen Mobile',
                'Slicing Komponen Web',
                'Slicing Komponen Mobile',
                'Pengonsepan',
              ].includes(currentProcess.name) &&
              !['Komponen', 'Konsep'].includes(module.name);

            if (isComponent || isConcept || isOtherModule) {
              return true;
            }
            return false;
          })
          .map((module) => ({
            label: module.name,
            value: {
              _id: module._id,
              name: module.name,
            },
          }))
      : [];
  } catch (error) {
    toast.add({
      message: 'Data modul gagal dimuat.',
      severity: 'error',
      error,
    });
  }
};

const getSubmoduleOptions = async (depIndex: number): Promise<void> => {
  if (!projectId) return;
  try {
    const currentModule = dependencies.value[depIndex].module;
    const { data: response } = await SubModuleServices.getSubmoduleList(
      projectId,
      {
        module: JSON.stringify([currentModule._id]),
      },
    );
    if (response.data) {
      const subModules = response.data.data;
      dependencies.value[depIndex].subModuleOptions = subModules.map(
        (subModule) => ({
          label: subModule.name,
          value: {
            _id: subModule._id,
            name: subModule.name,
          },
        }),
      );
    }
  } catch (error) {
    toast.add({
      message: 'Data sub modul gagal dimuat.',
      severity: 'error',
      error,
    });
  }
};

const onProcessChange = (depIndex: number): void => {
  showSubModuleByProcess(depIndex);
  getModuleOptions(depIndex);
  resetField(depIndex, 'module');
  resetField(depIndex, 'subModule');
  resetField(depIndex, 'selectedOptions');
};

const onModuleChange = (depIndex: number): void => {
  if (dependencies.value[depIndex].subModuleVisibility) {
    getSubmoduleOptions(depIndex);
  }
  resetField(depIndex, 'subModule');
  resetField(depIndex, 'selectedOptions');
};

const resetField = (
  depIndex: number,
  field: 'module' | 'subModule' | 'selectedOptions',
): void => {
  dependencies.value[depIndex][field] = undefined;
};

watch(
  taskProcess,
  (value) => {
    if (value) {
      loadData();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div data-wv-section="detailtask-task-dependency">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon class="w-6 h-6" icon="link" />
        <div class="text-xs font-semibold">Task Dependensi</div>
      </div>
      <Button
        :disabled="isNewTask || (taskDetail && taskDetail.status === 'Selesai')"
        @click="showDialogCustomDependency = true"
        icon="add"
        label="Custom"
        severity="secondary"
      />
    </div>
    <div v-if="dependencies?.length" class="pl-8 flex flex-col gap-2">
      <div :key="index" v-for="(dep, index) in dependencies" class="">
        <div class="flex gap-2">
          <div class="flex items-center gap-1">
            <span class="text-xs font-semibold">Proses: </span>
            <span @click="dep.key++">click {{ dep.key }}</span>
            <Dropdown
              :key="dep.key"
              v-if="dep.custom"
              v-model="dep.process"
              :initial-value="dep.process"
              :options="[
                {
                  label: 'Diagram',
                  value: {
                    _id: '6706205a9bdcad72db25711c',
                    name: 'Diagram',
                  },
                },
              ]"
              @update:model-value="onProcessChange(index)"
              class="!w-[140px]"
              data-key="name"
              option-label="label"
              option-value="value"
              placeholder="Pilih proses"
              use-validator
            />
            <span v-else>{{ dep.process?.name }}</span>
            <pre>{{ dep.process }}</pre>
            <pre>{{ dep.processOptions }}</pre>
          </div>
          <div v-if="dep.process" class="flex items-center gap-1">
            <span class="text-xs font-semibold">Modul: </span>
            <Dropdown
              v-if="dep.custom"
              v-model="dep.module"
              :options="dep.moduleOptions"
              @update:model-value="onModuleChange(index)"
              class="!w-[140px]"
              option-label="label"
              option-value="value"
              placeholder="Pilih modul"
              use-validator
            />
            <span v-else>{{ dep.module?.name }}</span>
          </div>
          <div v-if="dep.subModuleVisibility" class="flex items-center gap-1">
            <span class="text-xs font-semibold">Sub Modul: </span>
            <Dropdown
              v-if="dep.custom"
              v-model="dep.subModule"
              :options="dep.options"
              class="!w-[140px]"
              option-label="label"
              option-value="value"
              placeholder="Pilih task"
              use-validator
            />
            <span v-else>{{ dep.subModule?.name }}</span>
          </div>
          <div v-if="dep.module" class="flex items-center gap-1">
            <span class="text-xs font-semibold">Task: </span>
            <MultiSelect
              v-model="dep.selectedOptions"
              :initial-value="dep.selectedOptions"
              :loading="dep.loading"
              :options="dep.options"
              @show="
                getTaskOptions({
                  index: index,
                  processId: dep.process._id,
                  moduleId: dep.module._id,
                  subModuleId: dep.subModule?._id,
                })
              "
              @update:model-value="updateTaskDependency(index)"
              class="w-[140px]"
              option-label="label"
              option-value="value"
              placeholder="Pilih task"
              use-validator
            />
          </div>
        </div>
        <ul class="list-none pt-2">
          <li
            :key="taskIndex"
            v-for="(task, taskIndex) in dep.task"
            class="flex pt-1 pb-1 first:!pt-0 first:!pb-1 last:!pt-1 last:!pb-0 before:content-['•'] before:mr-2 before:mt-1.5"
          >
            <div class="w-full flex flex-col gap-1.5 overflow-auto">
              <div class="flex justify-between w-full">
                <div class="flex items-center gap-2">
                  <span>{{ task.name }}</span>
                  <div v-if="task.assignedTo?.length" class="flex">
                    <UserName
                      :key="userIndex"
                      v-for="(user, userIndex) in task.assignedTo"
                      :user="user"
                      type="icon"
                    />
                  </div>
                  <Badge :label="task.status" />
                  <Button
                    v-if="task.status === 'Selesai'"
                    label="Report Bug"
                    severity="danger"
                    text
                  />
                </div>
                <Button
                  @click="task.showCaption = !task.showCaption"
                  icon="chat-new-line"
                  severity="secondary"
                  text
                />
              </div>
              <div v-if="task.taskLink" class="">
                <a
                  v-if="task.taskLink.linkType === 'url'"
                  :href="task.taskLink.link"
                  class="text-link"
                  target="_blank"
                >
                  {{ task.taskLink.link }}
                </a>
                <template v-else-if="task.taskLink.linkType === 'embedded'">
                  <div
                    v-if="whitelistIframeTag.test(task.taskLink.link)"
                    v-html="task.taskLink.link"
                    class="[&_iframe]:flex-grow flex w-full h-full"
                  />
                  <div v-else>
                    <span class="font-bold text-lg">
                      Oh Tidak! kode embed tidak valid.
                    </span>
                  </div>
                </template>
              </div>
              <div v-if="task.showCaption || task.caption?.length">
                <InputCaption
                  v-if="task.showCaption"
                  :value="task.caption"
                  @cancel="task.showCaption = false"
                  @submit="
                    updateTaskDependencyCaption({
                      caption: $event,
                      taskIndex: taskIndex,
                      depIndex: index,
                    })
                  "
                />
                <span v-else class="text-xs text-grayscale-700">{{
                  task.caption
                }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <DialogCustomDependency
    v-model:visible="showDialogCustomDependency"
    @submit="addCustomDependency"
  />
</template>
