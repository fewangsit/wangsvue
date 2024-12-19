<script setup lang="ts">
import { computed, inject, Ref, ref, shallowRef, watch } from 'vue';
import { useToast } from 'lib/utils';
import SonarQubeServices from 'lib/services/sonarQube.service';
import Button from 'lib/components/button/Button.vue';
import Icon from 'lib/components/icon/Icon.vue';
import ProgressBar from 'lib/components/progressbar/ProgressBar.vue';
import ProjectApiServerServices from 'lib/services/projectApiServer.service';

const toast = useToast();

const props = defineProps<{
  name: string;
  processTeam: string;
}>();

interface Summary {
  key: string;
  name: string;
  measures: Measures;
}

interface Measures {
  coverage: MeasureItem;
  bugs: MeasureItem;
  vulnerabilities: MeasureItem;
  security_hotspots: MeasureItem;
  code_smells: MeasureItem;
  duplicated_lines_density: MeasureItem;
}

interface MeasureItem {
  metric: string;
  name: string;
  value: number;
  grade: string;
}

const projectId = inject<Ref<string>>('projectId');

const summaryData = ref<Summary>();
const isExpanded = shallowRef<boolean>(false);

const reachMinCoverage = computed(
  () => summaryData.value?.measures?.coverage?.value >= 75,
);

const getCoverageGrade = (value: number): string => {
  if (value >= 80) return 'A';
  if (value >= 60) return 'B';
  if (value >= 40) return 'C';
  if (value >= 20) return 'D';
  return 'E';
};

const getBugsVulnerabilitiesDuplicationsGrade = (value: number): string => {
  if (value < 1) return 'A';
  if (value <= 5) return 'B';
  if (value <= 10) return 'C';
  if (value <= 20) return 'D';
  return 'E';
};

const getCodeSmellsGrade = (value: number): string => {
  if (value < 1) return 'A';
  if (value <= 10) return 'B';
  if (value <= 20) return 'C';
  if (value <= 50) return 'D';
  return 'E';
};

const getSecurityHotspotsGrade = (value: number): string => {
  if (value === 0) return 'A'; // No security hotspots to review
  if (value >= 90) return 'A';
  if (value >= 80) return 'B';
  if (value >= 70) return 'C';
  if (value >= 50) return 'D';
  if (value > 0) return 'E';
  return 'F';
};

const getName = (metric: keyof Measures): string => {
  switch (metric) {
    case 'bugs':
      return 'Bugs';
    case 'vulnerabilities':
      return 'Vulnerabilities';
    case 'security_hotspots':
      return 'Hotspots Reviewed';
    case 'code_smells':
      return 'Code Smells';
    case 'duplicated_lines_density':
      return 'Duplications';
    default:
      return 'Coverage';
  }
};

const convertToGrade = (metric: keyof Measures, value: string): string => {
  switch (metric) {
    case 'coverage':
      return getCoverageGrade(parseInt(value));
    case 'bugs':
    case 'vulnerabilities':
    case 'duplicated_lines_density':
      return getBugsVulnerabilitiesDuplicationsGrade(parseInt(value));
    case 'code_smells':
      return getCodeSmellsGrade(parseInt(value));
    case 'security_hotspots':
      return getSecurityHotspotsGrade(parseInt(value));
    default:
      return 'F';
  }
};

const getMetricsWithGrades = (
  metricsArray: { metric: keyof Measures; value: string }[],
): Measures => {
  return metricsArray.reduce((acc: Measures, { metric, value }) => {
    const grade = convertToGrade(metric, value);
    acc[metric] = {
      metric,
      name: getName(metric),
      value: parseInt(value),
      grade,
    };
    return acc;
  }, {} as Measures);
};

const getClassesByGrade = (grade: string): string => {
  switch (grade) {
    case 'A':
      return 'text-success-700 bg-success-100';
    case 'B':
      return 'text-lime-700 bg-lime-100';
    case 'C':
      return 'text-warning-700 bg-warning-100';

    default:
      return 'text-danger-700 bg-danger-100';
  }
};

const getSonarQubeMetrics = async (
  username: string,
  password: string,
): Promise<void> => {
  try {
    const payload = {
      name: props.name,
      username: username,
      password: password,
    };
    const { data } = await SonarQubeServices.getComponentMetrics(payload);

    summaryData.value = {
      key: data.component.key,
      name: data.component.name,
      measures: getMetricsWithGrades(data.component.measures),
    };
  } catch (error) {
    toast.add({
      message:
        error?.response?.status === 404
          ? 'SonarQube tidak ditemukan.'
          : 'Gagal memuat sonarqube.',
      error,
    });
  }
};

const getApiServer = async (): Promise<void> => {
  try {
    const { data } = await ProjectApiServerServices.getApiServer(
      projectId.value,
    );
    const accounts = data?.data?.sonarqubeAccounts;
    if (accounts?.length) {
      const teams = {
        FE: 'Frontend',
        BE: 'Backend',
        MOB: 'Mobile',
      };
      const foundAccount = accounts.find(
        (account) => account.division === teams[props.processTeam],
      );
      if (foundAccount) {
        await getSonarQubeMetrics(foundAccount.username, foundAccount.password);
      }
    }
  } catch (error) {
    toast.add({
      message: 'Gagal memuat akun sonar qube.',
      error,
    });
  }
};

watch(
  projectId,
  (val) => {
    if (val) {
      getApiServer();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="summaryData" class="flex flex-col gap-3">
    <div
      class="bg-primary-50 w-full rounded-lg p-3 flex justify-between items-center"
    >
      <div class="flex items-center gap-2.5">
        <span class="font-semibold">{{ summaryData?.name }}</span>
        <div class="flex items-center gap-2">
          <ProgressBar
            :show-value="false"
            :value="summaryData?.measures?.coverage?.value ?? 0"
            class="w-[200px]"
            severity="success"
          />
          <span class="font-medium text-sm">
            Coverage {{ summaryData?.measures?.coverage?.value }}%
          </span>
        </div>
        <Icon
          :icon="
            reachMinCoverage ? 'checkbox-circle-fill' : 'close-circle-fill'
          "
          :severity="reachMinCoverage ? 'success' : 'danger'"
          class="!w-5 !h-5"
        />
      </div>
      <Button
        :icon="isExpanded ? 'arrow-up-s' : 'arrow-down'"
        @click="isExpanded = !isExpanded"
        class="!w-6 !min-w-6 !h-6"
        icon-class="!w-6 !h-6"
        severity="secondary"
        text
      />
    </div>

    <div v-if="isExpanded" class="flex gap-8 items-center justify-center">
      <div class="flex flex-col gap-1.5 items-center justify-center">
        <div class="flex gap-1.5">
          <div
            :class="[
              'rounded-full w-6 h-6 flex items-center justify-center',
              getClassesByGrade(summaryData?.measures?.bugs?.grade),
            ]"
          >
            <span class="mx-auto my-auto">{{
              summaryData?.measures?.bugs?.grade
            }}</span>
          </div>
          <span class="font-semibold text-base">{{
            summaryData?.measures?.bugs?.value
          }}</span>
        </div>
        <div class="text-center">Bugs</div>
      </div>
      <div class="flex flex-col gap-1.5 items-center justify-center">
        <div class="flex gap-1.5">
          <div
            :class="[
              'rounded-full w-6 h-6 flex items-center justify-center',
              getClassesByGrade(summaryData?.measures?.vulnerabilities?.grade),
            ]"
          >
            <span class="mx-auto my-auto">{{
              summaryData?.measures?.vulnerabilities?.grade
            }}</span>
          </div>
          <span class="font-semibold text-base">{{
            summaryData?.measures?.vulnerabilities?.value
          }}</span>
        </div>
        <div class="text-center">Vulnerabilities</div>
      </div>
      <div class="flex flex-col gap-1.5 items-center justify-center">
        <div class="flex gap-1.5">
          <div
            :class="[
              'rounded-full w-6 h-6 flex items-center justify-center',
              getClassesByGrade(
                summaryData?.measures?.security_hotspots?.grade,
              ),
            ]"
          >
            <span class="mx-auto my-auto">{{
              summaryData?.measures?.security_hotspots?.grade
            }}</span>
          </div>
          <span class="font-semibold text-base">
            {{ summaryData?.measures?.security_hotspots?.value }}%
          </span>
        </div>
        <div class="text-center">Hotspots Reviewed</div>
      </div>
      <div class="flex flex-col gap-1.5 items-center justify-center">
        <div class="flex gap-1.5">
          <div
            :class="[
              'rounded-full w-6 h-6 flex items-center justify-center',
              getClassesByGrade(summaryData?.measures?.code_smells?.grade),
            ]"
          >
            <span class="mx-auto my-auto">{{
              summaryData?.measures?.code_smells?.grade
            }}</span>
          </div>
          <span class="font-semibold text-base">{{
            summaryData?.measures?.code_smells?.value
          }}</span>
        </div>
        <div class="text-center">Code Smells</div>
      </div>
      <div class="flex flex-col gap-1.5 items-center justify-center">
        <div class="flex gap-1.5">
          <div
            :class="[
              'rounded-full w-6 h-6 flex items-center justify-center',
              getClassesByGrade(
                summaryData?.measures?.duplicated_lines_density?.grade,
              ),
            ]"
          >
            <span class="mx-auto my-auto">{{
              summaryData?.measures?.duplicated_lines_density?.grade
            }}</span>
          </div>
          <span class="font-semibold text-base">
            {{ summaryData?.measures?.duplicated_lines_density?.value }}%
          </span>
        </div>
        <div class="text-center">Duplications</div>
      </div>
    </div>
  </div>
</template>
