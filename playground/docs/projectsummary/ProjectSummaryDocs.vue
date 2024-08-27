<script setup lang="ts">
import ProjectSummaryAccordion from 'lib/components/summaryaccordion/SummaryAccordion.vue';
import { Summary } from 'lib/components/summaryaccordion/SummaryAccordion.vue.d';
import { reactive } from 'vue';

const summary = reactive<Summary>({
  name: 'Fixed Asset',
  initialName: 'FA',
  priority: 10,
  status: 'Sprint',
  progress: 40,
  totalModule: 10,
  totalCompletedModule: 4,
  totalSprintTask: 250,
  totalCompletedTask: 200,
  totalSprintPoint: 5000,
  totalBacklogTask: 50,
  totalBugHistories: 20,
});

const moduleSummary = reactive<Summary>({
  name: 'Modul Transfer',
  initialName: 'TRF',
  priority: 10,
  status: 'Sprint',
  progress: 40,
  totalModule: 10,
  totalCompletedModule: 4,
  totalSprintTask: 250,
  totalCompletedTask: 200,
  totalSprintPoint: 5000,
  totalBacklogTask: 50,
  totalBugHistories: 20,
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <ProjectSummaryAccordion :summary="summary" type="project" />
    <ProjectSummaryAccordion :summary="moduleSummary" type="module" />
  </div>
</template>
