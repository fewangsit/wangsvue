<script setup lang="ts">
import ProjectSummaryAccordion from 'lib/components/summaryaccordion/SummaryAccordion.vue';
import {
  ModuleSummary,
  ProjectSummary,
  SubModuleSummary,
} from 'lib/components/summaryaccordion/SummaryAccordion.vue.d';
import { reactive } from 'vue';

const summary = reactive<ProjectSummary>({
  type: 'project',
  name: 'Fixed Asset',
  initialName: 'FA',
  priority: 10,
  status: 'Sprint',
  totalModule: 10,
  totalCompletedModule: 4,
  totalSprintTask: 250,
  totalCompletedTask: 200,
  totalSprintPoint: 5000,
  totalBacklogTask: 50,
  totalBugHistories: 20,
});

const moduleSummary = reactive<ModuleSummary>({
  type: 'module',
  name: 'Transfer',
  initialName: 'TRF',
  priority: 10,
  status: 'Sprint',
  totalSubModule: 10,
  totalSprintTask: 250,
  totalCompletedTask: 200,
  totalSprintPoint: 5000,
  totalBacklogTask: 50,
  totalBugHistories: 20,
});

const subModuleSummary = reactive<SubModuleSummary>({
  type: 'submodule',
  name: 'Transaction',
  initialName: 'TRX',
  priority: 10,
  status: 'Sprint',
  totalSprintTask: 250,
  totalCompletedTask: 200,
  totalSprintPoint: 5000,
  totalBacklogTask: 50,
  totalBugHistories: 20,
  moduleName: 'Transfer',
  progressWeb: 100,
  progressMobile: 70,
  statusWeb: 'Pending E2E Testing',
  statusMobile: 'Reported Bug',
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <ProjectSummaryAccordion :summary="summary" />
    <ProjectSummaryAccordion :summary="moduleSummary" />
    <ProjectSummaryAccordion :summary="subModuleSummary" />
  </div>
</template>
