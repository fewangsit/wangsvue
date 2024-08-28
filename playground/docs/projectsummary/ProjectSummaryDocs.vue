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
  statusWeb: 'Pending E2E Testing Dev',
  statusMobile: 'Reported Bug',
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-4">
      <span>Project</span>
      <ProjectSummaryAccordion
        :summary="{
          ...summary,
          status: 'Backlog',
          totalCompletedTask: 0,
          totalSprintTask: 0,
          totalBacklogTask: 500,
        }"
      />
      <ProjectSummaryAccordion :summary="summary" />
      <ProjectSummaryAccordion
        :summary="{
          ...summary,
          status: 'Selesai',
          totalCompletedTask: 500,
          totalSprintTask: 0,
          totalBacklogTask: 0,
        }"
      />
    </div>

    <div class="mt-10 flex flex-col gap-4">
      <span>Module</span>
      <ProjectSummaryAccordion
        :summary="{
          ...moduleSummary,
          status: 'Backlog',
          totalCompletedTask: 0,
          totalSprintTask: 0,
          totalBacklogTask: 500,
        }"
      />
      <ProjectSummaryAccordion :summary="moduleSummary" />
      <ProjectSummaryAccordion
        :summary="{
          ...moduleSummary,
          status: 'Selesai',
          totalCompletedTask: 500,
          totalSprintTask: 0,
          totalBacklogTask: 0,
        }"
      />
    </div>

    <div class="mt-10 flex flex-col gap-4">
      <span>Sub Module</span>
      <ProjectSummaryAccordion
        :summary="{
          ...subModuleSummary,
          status: 'Backlog',
          totalCompletedTask: 0,
          totalSprintTask: 0,
          totalBacklogTask: 500,
          progressMobile: 0,
          progressWeb: 0,
          statusWeb: 'Backlog',
          statusMobile: 'Backlog',
        }"
      />
      <ProjectSummaryAccordion :summary="subModuleSummary" />
      <ProjectSummaryAccordion
        :summary="{
          ...subModuleSummary,
          status: 'Selesai',
          totalCompletedTask: 500,
          totalSprintTask: 0,
          totalBacklogTask: 0,
          progressMobile: 100,
          progressWeb: 100,
          statusMobile: 'Selesai',
          statusWeb: 'Selesai',
        }"
      />
    </div>
  </div>
</template>
