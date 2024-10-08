<script setup lang="ts">
import ProjectSummaryAccordion from 'lib/components/summaryaccordion/SummaryAccordion.vue';
import {
  ModuleSummary,
  ProjectSummary,
  SubModuleSummary,
  UserProfileSummary,
} from 'lib/components/summaryaccordion/SummaryAccordion.vue.d';
import { reactive } from 'vue';
import ProgressBar from 'lib/components/progressbar/ProgressBar.vue';

const userProfileSummary = reactive<UserProfileSummary>({
  type: 'profile',
  nickName: 'Kur',
  fullName: 'Zain Kurnia',
  initialName: 'KUR',
  division: 'RnD',
  position: 'Front End Developer',
  isActive: true,
  profilePicture:
    'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/712020:50961b54-29e8-4a94-8982-6cb6735b6a98/7ae11d7d-18c4-43b7-a63f-fc33fa80efe3/512',
  email: 'zainkurnia@mailnesia.com',
  phoneNumber: '+62 81234567890',
  teams: ['Front End Web', 'Back End'],
  sprintPoint: 4998,
  totalSprintTaskDuration: 288945,
  totalSprintPoint: 5000,
  totalSprintTask: 250,
  totalCompletedTask: 200,
  totalBugHistories: 1,
  totalBacklogTask: 50,
});

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
  <span>Progress Bar</span>
  <ProgressBar severity="dark" show-value value="2" />
  <div class="flex flex-col gap-3 mt-4">
    <div class="flex flex-col gap-4">
      <span>Summary Profile</span>
      <ProjectSummaryAccordion :summary="userProfileSummary" />
    </div>

    <div class="flex flex-col gap-4 mt-4">
      <span>Project</span>
      <ProjectSummaryAccordion
        :summary="{
          ...summary,
          status: 'Backlog',
          totalCompletedTask: 0,
          totalSprintTask: 0,
          totalBacklogTask: 0,
        }"
      />
      <ProjectSummaryAccordion />
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
          progressMobile: undefined,
          progressWeb: 40,
          statusWeb: 'Backlog',
          statusMobile: undefined,
        }"
      />
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
