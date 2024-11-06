<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Editor from 'lib/components/editor/Editor.vue';
import { EditorState, JSONContent } from 'lib/components/editor/Editor.vue.d';
import Icon from 'lib/components/icon/Icon.vue';
import UserName from 'lib/components/username/UserName.vue';
import { EditDescriptionTaskDTO } from 'lib/dto/task.dto';
import eventBus from 'lib/event-bus';
import TaskServices from 'lib/services/task.service';
import { TaskDescription, TaskDetail } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import { formatDateReadable } from 'lib/utils/date.util';
import { computed, inject, onMounted, Ref, ref, toRaw, watch } from 'vue';

const toast = useToast();

onMounted(async () => {
  if (!taskId.value) return;

  await getDescription();
});

const taskDetail = inject<Ref<TaskDetail>>('taskDetail');
const taskId = inject<Ref<string>>('taskId');

const taskDescription = ref<TaskDescription>();

const editorState = ref<EditorState>('readonly');
const isCurrentlyFocused = ref<boolean>(false);

const content = ref();
const initialContent = ref<JSONContent>();

const insideContent = computed(() => content.value?.content ?? []);

const anyContent = computed<boolean>(() => {
  if (insideContent.value.length) {
    const hasContent = Object.hasOwn(insideContent.value[0], 'content');
    return hasContent;
  }
  return false;
});

const bindEditorState = computed(() =>
  anyContent.value ? editorState.value : 'editable',
);

const getDescription = async (): Promise<void> => {
  try {
    const { data } = await TaskServices.getTaskDescription(taskId.value);

    if (data?.data?.description) {
      content.value = JSON.parse(data?.data?.description);

      taskDescription.value = data.data;
    }
  } catch (error) {
    toast.add({
      message: 'Data Task Description gagal dimuat.',
      severity: 'error',
      error,
    });
  }
};

const handleOnFocus = (): void => {
  editorState.value = 'editable';
  isCurrentlyFocused.value = true;

  initialContent.value = toRaw(content.value);
};

const handleOnBlur = (): void => {
  editorState.value = 'readonly';
  isCurrentlyFocused.value = false;

  initialContent.value = undefined;
};

const handleSave = async (): Promise<void> => {
  try {
    const dataDTO: EditDescriptionTaskDTO = {
      description: JSON.stringify(content.value),
    };

    await TaskServices.putTaskDescription(taskId.value, dataDTO);

    eventBus.emit('detail-task:update', { taskId: taskId.value });

    handleOnBlur();
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Deskripsi Task gagal disimpan.',
      severity: 'error',
      error,
    });
  }
};

const handleCancel = (): void => {
  content.value = toRaw(initialContent.value);

  handleOnBlur();
};

watch(taskDetail, async () => {
  if (!taskId.value) return;

  await getDescription();
});
</script>

<template>
  <div
    class="flex flex-col gap-2"
    data-wv-section="detailtask-task-description"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon class="w-6 h-6" icon="file-list-2" />
        <div class="text-xs font-semibold">Deskripsi</div>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="taskDescription?.updatedAt">
          {{ formatDateReadable(new Date(taskDescription.updatedAt), 86400) }}
        </span>
        <UserName
          v-if="taskDescription?.updatedBy"
          :user="taskDescription.updatedBy"
          type="icon"
        />
      </div>
    </div>
    <div class="pl-8 flex flex-col gap-2">
      <template v-if="bindEditorState === 'readonly'">
        <div @click="handleOnFocus" class="cursor-pointer">
          <Editor
            v-model="content"
            @focus="handleOnFocus"
            border-less
            editor-state="readonly"
            placeholder="Tulis deskripsi"
          />
        </div>
      </template>
      <template v-else>
        <div class="">
          <Editor
            v-model="content"
            @focus="handleOnFocus"
            editor-state="editable"
            is-image-upload-base64
            placeholder="Tulis deskripsi"
          />
        </div>
      </template>
      <div v-if="isCurrentlyFocused" class="flex items-center gap-1">
        <Button @click="handleSave" label="Simpan" severity="success" />
        <Button @click="handleCancel" label="Batal" severity="secondary" text />
      </div>
    </div>
  </div>
</template>
