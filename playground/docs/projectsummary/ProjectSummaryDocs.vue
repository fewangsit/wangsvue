<script setup lang="ts">
import { reactive, ref, shallowRef } from 'vue';
import ProjectSummaryAccordionClass, {
  ModuleSummary,
  ProjectSummary,
  SubModuleSummary,
  UserProfileSummary,
} from 'lib/components/summaryaccordion/SummaryAccordion.vue.d';
import FormClass, { FormPayload } from 'lib/components/form/Form.vue.d';
import { useToast } from 'lib/utils';
import ProjectSummaryAccordion from 'lib/components/summaryaccordion/SummaryAccordion.vue';
import ProgressBar from 'lib/components/progressbar/ProgressBar.vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import Toast from 'lib/components/toast/Toast.vue';
import Form from 'lib/components/form/Form.vue';

const toast = useToast();

const userProfileSummary = reactive<UserProfileSummary>({
  type: 'profile',
  nickName: 'Kur',
  fullName: 'Zain Kurnia',
  initial: 'ZK',
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

const userAccordionRef = ref<ProjectSummaryAccordionClass>();
const userAccordionFormRef = ref<FormClass>();
const delImageFn = shallowRef<(index?: number) => void>();
const showConfirmDelete = shallowRef(false);
const updatingImage = shallowRef(false);

const submitImage = (e: FormPayload): void => {
  if (e.formValues.profilePicture) {
    updatingImage.value = false;
    console.error(e.formValues);
    setTimeout(() => {
      userAccordionRef.value?.assignPreviewImagesFromProp();
      userProfileSummary.useInitial = false;
      toast.add({
        severity: 'error',
        message: 'Profile picture gagal dihapus.',
      });
    }, 1000);
  }
};
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Project Summary" /> </template>
    <template #content>
      <span>Progress Bar</span>
      <ProgressBar :value="2" severity="dark" show-value />
      <div class="flex flex-col gap-3 mt-4">
        <div class="flex flex-col gap-4">
          <span>Summary Profile</span>
          <Form
            ref="userAccordionFormRef"
            :reset-after-submit="false"
            @submit="submitImage"
            class="!gap-0"
            hide-stay-checkbox
          >
            <template #fields>
              <ProjectSummaryAccordion
                ref="userAccordionRef"
                :summary="{
                  ...userProfileSummary,
                  completeProfile: true,
                }"
                @apply="userAccordionFormRef?.submit()"
                @apply-prop="if (updatingImage) userAccordionFormRef?.submit();"
                @delete="
                  (deleteFn, index) => {
                    delImageFn = deleteFn;
                    if (deleteFn) showConfirmDelete = true;
                    else {
                      userProfileSummary.useInitial = true;
                      updatingImage = true;
                    }
                  }
                "
                field-name="profilePicture"
              />
            </template>
          </Form>
          <span>Shortened Summary Profile</span>
          <ProjectSummaryAccordion
            :summary="{
              ...userProfileSummary,
              editedEmail: 'zainkurnia2@mailnesia.com',
            }"
            @edit="console.log('edit')"
          />
          <span>Shortened Summary Profile, Editable</span>
          <ProjectSummaryAccordion
            :summary="{
              ...userProfileSummary,
              editable: true,
              editedEmail: 'zainkurnia2@mailnesia.com',
            }"
            @cancel-edit-email="console.log('cancel edit email')"
            @edit="console.log('edit')"
          />
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
  </Card>

  <DialogConfirm
    v-model:visible="showConfirmDelete"
    @confirm="if (delImageFn) delImageFn();"
    header="Hapus Profile Picture"
    message="Apakah anda yakin ingin menghapus profile picture?"
    severity="danger"
  />

  <Toast />
</template>
