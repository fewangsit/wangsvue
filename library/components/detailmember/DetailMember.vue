<script setup lang="ts">
import { DetailMemberProps } from './DetailMember.vue.d';
import DetailMemberAdmin from './DetailMemberAdmin.vue';
import DetailMemberLeader from './DetailMemberLeader.vue';
import DetailMemberLog from './DetailMemberLog.vue';

defineProps<DetailMemberProps>();
</script>

<template>
  <DetailMemberLeader v-if="activeIndex === 1" :member-id="memberId" />
  <DetailMemberAdmin
    v-if="activeIndex === 2"
    :access="access"
    :member-id="memberId"
  />
  <DetailMemberLog v-if="activeIndex === 3" :member-id="memberId" />
</template>
