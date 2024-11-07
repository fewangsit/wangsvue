<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue';
import { useToast } from 'lib/utils';
import { MultiSelectOption } from 'lib/types/options.type';
import { FormPayload } from '../form/Form.vue.d';
import { MemberAdminRole, Role } from './DetailMember.vue.d';
import eventBus from 'lib/event-bus';
import MemberAdminServices from 'lib/services/memberAdmin.service';
import RoleServices from 'lib/services/role.service';
import DialogForm from '../dialogform/DialogForm.vue';
import MultiSelect from '../multiselect/MultiSelect.vue';

const toast = useToast();

const props = defineProps<{
  memberId: string;
  memberAdmin?: MemberAdminRole[];
}>();

onMounted(() => {
  getOptions();
});

const visible = defineModel<boolean>('visible', { required: true });
const loadingMultiselect = shallowRef<boolean>(false);
const multiselectOptions = shallowRef<MultiSelectOption[]>([]);

const roleIdList = computed(() => {
  return props.memberAdmin?.map((role) => role.role._id);
});

const actionDialog = async (payload: FormPayload): Promise<void> => {
  const roleFormValues = payload.formValues.role as unknown as string[];

  /*
   * If the initial amount of roles is less than the selected amount,
   * show the 'Assigned' toast instead of 'Unassigned'
   */
  const assignMore: boolean =
    (props.memberAdmin?.length ?? 0) <= roleFormValues.length;

  const success = await applyRoles(roleFormValues, assignMore);
  if (success) {
    eventBus.emit('data-table:clear-selected-data', {
      tableName: 'member-roles',
    });
    eventBus.emit('data-table:update', {
      tableName: 'member-roles',
    });
    visible.value = false;
  }
};

const applyRoles = async (
  roleIds: string[],
  assignMore: boolean,
): Promise<boolean> => {
  try {
    await MemberAdminServices.updateMemberAdmin(props.memberId ?? '', {
      roleId: roleIds,
    });
    toast.add({
      message: assignMore ? 'Role telah di-assign.' : 'Role telah di-unassign.',
      severity: 'success',
    });
    return true;
  } catch (error) {
    console.error(error);
    toast.add({
      error,
      message: assignMore ? 'Role gagal di-assign.' : 'Role gagal di-unassign.',
    });
    return false;
  }
};

const getOptions = async (): Promise<void> => {
  try {
    loadingMultiselect.value = true;
    const { data } = await RoleServices.getRoles({});
    multiselectOptions.value = data.data
      .filter(function (role: Role) {
        return role.name !== 'Super Admin';
      })
      .map((role) => ({
        label: role.name,
        value: role._id,
      }));
  } catch (error) {
    multiselectOptions.value = [];
    console.error(error);
  } finally {
    loadingMultiselect.value = false;
  }
};
</script>

<template>
  <DialogForm
    v-model:visible="visible"
    :buttons-template="['cancel', 'submit']"
    :closable="false"
    :close-on-submit="false"
    :reset-after-submit="false"
    @submit="actionDialog"
    header="Assign Role"
  >
    <template #fields>
      <MultiSelect
        :initial-value="roleIdList"
        :loading="loadingMultiselect"
        :options="multiselectOptions"
        :show-optional-text="false"
        field-name="role"
        label="Role"
        option-label="label"
        option-value="value"
        placeholder="Pilih Role"
        use-validator
      />
    </template>
  </DialogForm>
</template>
