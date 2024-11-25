<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { AxiosError } from 'axios';
import { getUserPermission, useToast } from 'lib/utils';
import { DropdownOption } from 'lib/types/options.type';
import {
  DetailSprintProps,
  IntervalPut,
  SprintDetail,
} from './DetailSprint.vue.d';
import { Pbi } from '../dialogdetailpbi/DialogDetailPbi.vue.d';
import { FormPayload } from '../form/Form.vue.d';
import SprintServices from 'lib/services/sprint.service';
import DialogConfirmSprint from './DialogConfirmSprint.vue';
import DialogAddPbi from './DialogAddPbi.vue';
import DialogForm from '../dialogform/DialogForm.vue';
import Dropdown from '../dropdown/Dropdown.vue';
import InputNumber from '../inputnumber/InputNumber.vue';
import TaskDetailPbi from '../dialogdetailpbi/TaskDetailPbi.vue';
import Button from '../button/Button.vue';
import Badge from '../badge/Badge.vue';
import Calendar from '../calendar/Calendar.vue';
import DialogDetailPbi from '../dialogdetailpbi/DialogDetailPbi.vue';
import updateSprintStatus from './helpers/updateSprintStatus.util';
import SprintSummary from './SprintSummary.vue';

const toast = useToast();

const props = defineProps<DetailSprintProps>();

onMounted(() => {
  getSprint();
});

const projectId = sessionStorage.getItem('projectId') as string;

const intervalOptions: DropdownOption[] = [
  { label: '1 Minggu', value: 1 },
  { label: '2 Minggu', value: 2 },
  { label: '3 Minggu', value: 3 },
  { label: '4 Minggu', value: 4 },
  { label: 'Custom', value: 0 },
];

const visibleConfirmApprove = shallowRef<boolean>(false);
const visibleUpdateInterval = shallowRef<boolean>(false);
const visibleUpdateStartDate = shallowRef<boolean>(false);
const visibleAddPbi = shallowRef<boolean>(false);
const currentSprint = shallowRef<SprintDetail>();
const currentProductBacklogItems = shallowRef<Pbi[]>([]);
const inputInterval = shallowRef<number>();
const inputIntervalUnit = shallowRef<string>();
const errorMessage = shallowRef<string>();
const expandedSummary = shallowRef<boolean>(false);

const visibleDialogDetail = ref<boolean[]>([]);
const expanded = ref<boolean[]>([]);

const isApproved = computed<boolean>(() =>
  ['Sprint', 'Selesai'].includes(currentSprint.value?.status ?? ''),
);

const initInterval = (): void => {
  if (currentSprint.value) {
    inputInterval.value = currentSprint.value.sprintInterval;
    inputIntervalUnit.value = currentSprint.value.sprintIntervalUnit;
  }
};

const epochToDate = (date: number): string => {
  if (date) {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    });
  }
  return '-';
};

const approveSprint = (): void => {
  if (currentProductBacklogItems.value.length === 0) {
    errorMessage.value = 'Product backlog item harus dipilih.';
  } else if (!currentSprint.value?.startAt) {
    errorMessage.value = 'Tanggal mulai harus diisi.';
  } else {
    errorMessage.value = undefined;
    if (currentSprint.value?.isNeedApproval) {
      visibleConfirmApprove.value = true;
    } else {
      updateSprintStatus(getSprint, toast, projectId, props.sprintId);
    }
  }
};

const updateInterval = async (payload: FormPayload): Promise<void> => {
  try {
    const formValues = payload.formValues as unknown as IntervalPut;
    await SprintServices.updateSprintInterval(projectId, props.sprintId, {
      ...formValues,
      periodUnit: inputIntervalUnit.value ?? 'Minggu',
    });
    await getSprint();

    visibleUpdateInterval.value = false;
  } catch (error) {
    console.error(error);
  }
};

const updateStartDate = async (payload: FormPayload): Promise<void> => {
  try {
    const formValues = payload.formValues as unknown as {
      startAt: number;
    };
    await SprintServices.updateSprintStartDate(
      projectId,
      props.sprintId,
      formValues,
    );
    await getSprint();
    errorMessage.value = undefined;

    visibleUpdateStartDate.value = false;
  } catch (error) {
    console.error(error);
  }
};

const deletePbi = async (pbiId: string): Promise<void> => {
  try {
    await SprintServices.deleteSprintPbi(projectId, props.sprintId, { pbiId });
    await getSprint();
  } catch (error) {
    console.error(error);
  }
};

const getSprint = async (): Promise<void> => {
  try {
    const { data } = await SprintServices.getSprintDetail(
      projectId,
      props.sprintId,
    );
    errorMessage.value = undefined;

    visibleDialogDetail.value = new Array(
      data.data.productBacklogItems.length,
    ).fill(false);
    currentSprint.value = data.data;

    initInterval();
    getPbis();
  } catch (error) {
    console.error(error);
    // If user is not allowed to access this project, replace URL with 404
    if (error instanceof AxiosError && error.response?.status === 403) {
      window.history.replaceState(null, '', '/404');
    }
  }
};

const getPbis = async (): Promise<void> => {
  try {
    const { data } = await SprintServices.getListPbis(projectId, {
      productBacklogItem: `[${currentSprint.value?.productBacklogItems
        .map((pbi) => `"${pbi._id}"`)
        .toString()}]`,
    });
    currentProductBacklogItems.value = data.data.data;
  } catch (error) {
    console.error(error);
  }
};
</script>

<!-- eslint-disable vue/html-indent -->
<template>
  <!-- Header -->
  <div class="flex justify-between h-[30px] place-items-center">
    <h2>Detail Sprint</h2>
    <div class="flex gap-2 place-items-center">
      <span class="text-danger-500">
        {{ errorMessage }}
      </span>
      <template v-if="isApproving">
        <Button
          @click="console.error('reject')"
          label="Tolak"
          severity="danger"
        />
        <Button
          @click="console.error('approve')"
          label="Setuju"
          severity="success"
        />
      </template>
      <Button
        v-else-if="!isApproved"
        :disabled="
          ['Ready to Sprint', 'Waiting for Approval'].includes(
            currentSprint?.status ?? '',
          )
        "
        :label="
          currentSprint?.isNeedApproval
            ? 'Kirim Ke Approver'
            : 'Tandai Ready to Sprint'
        "
        @click="approveSprint"
        severity="success"
      />
    </div>
  </div>

  <!-- Detail -->
  <div class="flex justify-between place-items-end">
    <div class="flex flex-col gap-2">
      <div class="flex gap-3 h-6 place-items-center">
        <span> Sprint : Sprint {{ currentSprint?.sprintNumber }} </span>
        <span>
          Status :
          <Badge :label="currentSprint?.status ?? ''" format="nowrap" />
        </span>
        <span class="flex place-items-center gap-1">
          Periode Sprint :
          {{
            currentSprint?.sprintInterval
              ? currentSprint?.sprintInterval +
                ' ' +
                currentSprint?.sprintIntervalUnit
              : '-'
          }}
          <Button
            v-if="!isApproved"
            @click="visibleUpdateInterval = true"
            class="!size-6"
            data-wv-section="update-interval"
            icon="edit"
            severity="secondary"
            text
          />
        </span>
      </div>
      <div class="flex gap-3 h-6 place-items-center">
        <span class="flex place-items-center gap-1">
          Tanggal Mulai : {{ epochToDate(currentSprint?.startAt ?? 0) }}
          <Button
            v-if="!isApproved"
            @click="visibleUpdateStartDate = true"
            class="!size-6"
            data-wv-section="update-start-date"
            icon="edit"
            severity="secondary"
            text
          />
        </span>
        <span>
          Tanggal Selesai :
          {{ epochToDate(currentSprint?.finishAt ?? 0) }}
        </span>
      </div>
    </div>
    <Button
      v-if="!isApproved && getUserPermission().update"
      @click="visibleAddPbi = true"
      label="+ Product Backlog Item"
      severity="secondary"
    />
  </div>

  <!-- Sprint Summary -->
  <div
    v-if="currentSprint?.status === 'Selesai'"
    class="bg-primary-50 rounded-lg p-3 w-full text-grayscale-900"
  >
    <div
      @click="expandedSummary = !expandedSummary"
      class="flex justify-between items-center cursor-pointer"
    >
      <span class="font-semibold text-normal leading-4"> Sprint Summary </span>
      <Button
        :class="['!p-0 !size-auto', { 'rotate-180': expandedSummary }]"
        data-wv-section="expand-pbi"
        icon="arrow-down"
        icon-class="w-6 h-6"
        severity="secondary"
        text
      />
    </div>
  </div>
  <SprintSummary v-if="expandedSummary" :sprint-id="currentSprint?._id" />

  <!-- PBI List -->
  <template
    :key="pbi._id"
    v-for="(pbi, index) in currentSprint?.productBacklogItems"
  >
    <div class="bg-primary-50 rounded-lg p-3 w-full text-grayscale-900">
      <div
        @click="expanded[index] = !expanded[index]"
        class="flex justify-between cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <span class="font-semibold text-normal leading-4">
            PBI {{ index + 1 }}. {{ pbi.name }}
          </span>
          <Badge :label="pbi.status" format="nowrap" />
        </div>
        <div class="flex items-center gap-3">
          <Button
            @click.stop="visibleDialogDetail[index] = true"
            class="!py-0.5 !px-1.5 text-primary-400"
            label="Detail PBI >"
            text
          />
          <Button
            v-if="getUserPermission().delete && !isApproved"
            @click.stop="deletePbi(pbi._id)"
            class="!p-0 !size-auto'"
            data-wv-section="delete-pbi"
            icon="close"
            icon-class="w-6 h-6"
            severity="danger"
            text
          />
          <Button
            :class="['!p-0 !size-auto', { 'rotate-180': expanded[index] }]"
            data-wv-section="expand-pbi"
            icon="arrow-down"
            icon-class="w-6 h-6"
            severity="secondary"
            text
          />
        </div>
      </div>
    </div>
    <TaskDetailPbi
      v-if="expanded[index]"
      :project="project"
      :selected-pbi="
        currentProductBacklogItems.find((pbi) => pbi._id === pbi._id)
      "
      editable
    />
    <DialogDetailPbi
      v-model:visible="visibleDialogDetail[index]"
      :selected-pbi="
        currentProductBacklogItems.find((pbi) => pbi._id === pbi._id)
      "
    />
  </template>

  <!-- Update Interval -->
  <DialogForm
    v-model:visible="visibleUpdateInterval"
    :buttons-template="['cancel', 'submit']"
    :closable="false"
    :close-on-submit="false"
    :reset-after-submit="false"
    @hide="initInterval"
    @submit="updateInterval"
    header="Periode Sprint"
  >
    <template #fields>
      <InputNumber
        v-if="inputIntervalUnit === 'Hari'"
        :allow-empty-value="false"
        :min="5"
        :value="
          currentSprint?.sprintIntervalUnit === 'Hari'
            ? inputInterval
            : undefined
        "
        field-name="period"
        label="Periode Sprint"
        mandatory
        use-validator
      >
        <template #addon-right>
          <span>Hari</span>
        </template>
      </InputNumber>
      <Dropdown
        v-else
        :initial-value="inputInterval"
        :options="intervalOptions"
        @update:model-value="
          // If 'Custom' option is chosen, change interval unit to 'Hari'
          $event === 0 ? (inputIntervalUnit = 'Hari') : null
        "
        field-name="period"
        label="Periode Sprint"
        mandatory
        option-label="label"
        option-value="value"
        use-validator
      />
    </template>
  </DialogForm>

  <!-- Update Start Date -->
  <DialogForm
    v-model:visible="visibleUpdateStartDate"
    :buttons-template="['cancel', 'submit']"
    :closable="false"
    :close-on-submit="false"
    :reset-after-submit="false"
    @submit="updateStartDate"
    header="Tanggal Mulai"
  >
    <template #fields>
      <Calendar
        :date-value="currentSprint?.startAt"
        :min-date="new Date()"
        field-name="startAt"
        label="Tanggal Mulai"
        mandatory
        placeholder="Pilih tanggal"
        use-validator
      />
    </template>
  </DialogForm>

  <!-- Add PBI -->
  <DialogAddPbi
    v-model:visible="visibleAddPbi"
    :selected-sprint="currentSprint"
    @add="getSprint"
  />

  <!-- Confirm Approve -->
  <DialogConfirmSprint
    v-model:visible="visibleConfirmApprove"
    :sprint="
      currentSprint
        ? { ...currentSprint, finishedAt: currentSprint.finishAt }
        : undefined
    "
    @create-approval="getSprint"
  />
</template>
