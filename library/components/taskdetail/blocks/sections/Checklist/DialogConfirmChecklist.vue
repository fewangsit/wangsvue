<script setup lang="ts">
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import { useToast } from 'lib/utils';
import { TaskChecklistServices } from 'wangsit-api-services';
import { TaskChecklist, TaskChecklistItem } from 'lib/types/task.type';
import Icon from 'lib/components/icon/Icon.vue';
import { computed, inject, ref, watch } from 'vue';
import Button from 'lib/components/button/Button.vue';
import Textarea from 'lib/components/textarea/Textarea.vue';
import { ToggleTaskChecklistItemDTO } from 'lib/dto/taskChecklist.dto';

const { setLoading } = useLoadingStore();
const toast = useToast();

const DialogFormPreset = inject<Record<string, any>>('preset', {}).dialogform;

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  checklist?: TaskChecklist;
  type: 'deleteList' | 'deleteItem' | 'uncheckItem';
  item?: TaskChecklistItem;
}>();

const emit = defineEmits<{
  submitted: [];
}>();

const reason = ref('');

const headerLabel = computed(() => {
  switch (props.type) {
    case 'deleteList':
      return 'Hapus Ceklis';
    case 'deleteItem':
      return 'Hapus Item Ceklis';
    default:
      return 'Uncheck Ceklis';
  }
});

const handleSubmit = async (): Promise<void> => {
  switch (props.type) {
    case 'deleteList':
      await deleteChecklist();
      break;
    case 'deleteItem':
      await deleteChecklistItem();
      break;
    default:
      await uncheckChecklistItem();
      break;
  }
};

const deleteChecklist = async (): Promise<void> => {
  try {
    setLoading(true);

    const { data } = await TaskChecklistServices.deleteTaskChecklist(
      props.checklist._id,
      reason.value,
    );
    if (data) {
      const message =
        (data?.data?.isDeleted ?? data?.data?.isUpdated)
          ? 'Ceklis telah dihapus.'
          : 'Hapus ceklis menunggu persetujuan approver.';

      toast.add({
        message,
        severity: 'success',
      });

      emit('submitted');
      visible.value = false;
    }
  } catch (error) {
    toast.add({
      message: 'Ceklis gagal dihapus.',
      error,
    });
  } finally {
    setLoading(false);
  }
};

const deleteChecklistItem = async (): Promise<void> => {
  try {
    setLoading(true);

    const { data } = await TaskChecklistServices.deleteTaskChecklistItem(
      props.item._id,
      reason.value,
    );
    if (data) {
      const message =
        (data?.data?.isDeleted ?? data?.data?.isUpdated)
          ? 'Item ceklis telah dihapus.'
          : 'Hapus item ceklis menunggu persetujuan approver.';

      toast.add({
        message,
        severity: 'success',
      });

      emit('submitted');
      visible.value = false;
    }
  } catch (error) {
    toast.add({
      message: 'Item ceklis gagal dihapus.',
      error,
    });
  } finally {
    setLoading(false);
  }
};

const uncheckChecklistItem = async (): Promise<void> => {
  try {
    const body: ToggleTaskChecklistItemDTO = {
      checked: false,
      reason: reason.value ?? '',
    };
    const { data } = await TaskChecklistServices.toggleTaskChecklistItem(
      props.item._id,
      body,
    );
    if (data) {
      const message = data?.data?.isUpdated
        ? 'Item ceklis telah di-uncheck.'
        : 'Uncheck ceklis menunggu persetujuan approver.';

      toast.add({
        message,
        severity: 'success',
      });

      emit('submitted');
      visible.value = false;
    }
  } catch (error) {
    toast.add({
      message: 'Uncheck ceklis gagal disimpan.',
      error,
    });
  }
};

watch(visible, () => (reason.value = ''));
</script>

<template>
  <DialogForm
    v-model:visible="visible"
    :buttons-template="['cancel', 'submit']"
    :closable="false"
    :close-on-submit="false"
    :header="headerLabel"
    :show-stay-checkbox="false"
    :use-clear-btn="false"
    @submit="handleSubmit"
    data-wv-name="dialog-delete-checklist"
    severity="danger"
  >
    <template #header>
      <Icon
        v-bind="DialogFormPreset?.headericon"
        aria-label="Header Icon"
        icon="error-fill"
        severity="danger"
      />
      <h3 class="text-danger-700">{{ headerLabel }}</h3>
    </template>
    <template #fields>
      <p>{{ checklist.name }}</p>
      <ul v-if="item" class="list-none">
        <li class="before:content-['•'] before:mr-2 before:mt-1.5 font-normal">
          {{ item.name }}
        </li>
      </ul>
      <Textarea
        v-model="reason"
        v-focus
        :validator-message="{
          empty: 'Alasan harus diisi.',
        }"
        field-name="reason"
        label="Alasan"
        mandatory
        placeholder="Tulis alasan"
        use-validator
      />
    </template>
    <template #actionButtons="{ submit }">
      <Button
        @click="visible = false"
        v-bind="DialogFormPreset?.cancelbtn"
        label="Batal"
        severity="dark"
        text
      />
      <Button
        @click="submit(handleSubmit)"
        v-bind="DialogFormPreset?.savesubmitbutton"
        label="Simpan"
        severity="danger"
      />
    </template>
  </DialogForm>
</template>
