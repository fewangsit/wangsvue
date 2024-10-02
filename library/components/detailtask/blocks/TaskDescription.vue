<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Editor from 'lib/components/editor/Editor.vue';
import { EditorState, JSONContent } from 'lib/components/editor/Editor.vue.d';
import Icon from 'lib/components/icon/Icon.vue';
import eventBus from 'lib/event-bus';
import { useToast } from 'lib/utils';
import { computed, inject, Ref, ref, toRaw } from 'vue';

const toast = useToast();

const taskId = inject<Ref<string>>('taskId');

const editor = ref<typeof Editor>();

const editorState = ref<EditorState>('readonly');
const isCurrentlyFocused = ref<boolean>(false);

const content = ref<JSONContent>();
const initialContent = ref<JSONContent>();

const isContentEmpty = computed<boolean>(() => {
  return !(content.value && content.value.content[0].content);
});

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

// TODO: Handle save description changes
const handleSave = async (): Promise<void> => {
  try {
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
        <!-- TODO: Handle chat icon click -->
        <Button
          icon="chat-1-line"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <!-- TODO: Handle description changelog on click -->
        <Button
          icon="file-history"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <Button
          :disabled="isCurrentlyFocused"
          @click="handleOnFocus"
          label="Edit"
          severity="secondary"
        />
      </div>
    </div>
    <div class="pl-8 flex flex-col gap-2">
      <Editor
        ref="editor"
        v-model="content"
        :class="[
          {
            'cursor-pointer': editorState === 'readonly',
          },
        ]"
        :editor-state="!isContentEmpty ? editorState : 'editable'"
        @focus="handleOnFocus"
        placeholder="Tulis deskripsi"
      />
      <div v-if="isCurrentlyFocused" class="flex items-center gap-1">
        <Button @click="handleSave" label="Simpan" severity="success" />
        <Button @click="handleCancel" label="Batal" severity="secondary" text />
      </div>
    </div>
  </div>
</template>
