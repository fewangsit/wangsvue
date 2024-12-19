<script setup lang="ts">
import { shallowRef } from 'vue';
import {
  FetchResponse,
  QueryParams,
  TableColumn,
} from '../datatable/DataTable.vue.d';
import { MemberAdminRole } from './DetailMember.vue.d';
import { useToast } from 'lib/utils';
import { MenuItem } from '../menuitem';
import { RoleMemberPermission } from 'lib/types/roleDetailAccess.type';
import { FilterField } from '../filtercontainer/FilterContainer.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import ButtonFilter from '../buttonfilter/ButtonFilter.vue';
import DataTable from '../datatable/DataTable.vue';
import { MemberAdminServices } from 'wangsit-api-services';
import DialogMemberAdmin from './DialogMemberAdmin.vue';
import Button from '../button/Button.vue';
import eventBus from 'lib/event-bus';
import DialogConfirm from '../dialogconfirm/DialogConfirm.vue';
import ButtonBulkAction from '../buttonbulkaction/ButtonBulkAction.vue';
import FilterContainer from '../filtercontainer/FilterContainer.vue';

const toast = useToast();

const props = defineProps<{
  memberId: string;
  access?: RoleMemberPermission;
}>();

const singleAction: MenuItem[] = [
  {
    label: 'Unassign Role',
    icon: 'user-unfollow-line',
    command: (): void => {
      isSingleSelect.value = true;
      visibleDialogConfirm.value = true;
    },
  },
];

const bulkAction: MenuItem[] = [
  {
    label: 'Aktifkan',
    icon: 'check',
    command: (): void => {
      activateRoles(true);
    },
  },
  {
    label: 'Nonaktifkan',
    icon: 'close',
    command: (): void => {
      activateRoles(false);
    },
  },
  {
    label: 'Unassign Role',
    icon: 'user-unfollow-line',
    command: (): void => {
      isSingleSelect.value = false;
      visibleDialogConfirm.value = true;
    },
  },
];

const roleColumns: TableColumn[] = [
  {
    field: 'isActive',
    header: 'Aktif',
    sortable: true,
    bodyClass: 'w-16',
    preset: {
      type: 'toggle',
      disabled: !props.access.update,
      onToggle: async (state, data: MemberAdminRole, revert): Promise<void> => {
        activateRoles(state, data.role._id, revert);
      },
    },
  },
  {
    field: 'role.name',
    header: 'Role',
    sortable: true,
  },
];

const adminFilterField: FilterField[] = [
  {
    label: 'Aktif',
    field: 'isActive',
    type: 'multiselect',
    placeholder: 'Pilih status',
    fetchOptionFn: (): MultiSelectOption[] => [
      { label: 'Aktif', value: true },
      { label: 'Tidak Aktif', value: false },
    ],
  },
  {
    label: 'Role',
    field: 'roleId',
    type: 'multiselect',
    placeholder: 'Pilih role',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      try {
        const { data } = await MemberAdminServices.getMemberRolesOptions(
          props.memberId,
        );
        return data.data.roles;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
];

const currentMemberAdmins = shallowRef<MemberAdminRole[]>();
const selectedMemberAdmin = shallowRef<MemberAdminRole>();
const selectedMemberAdmins = shallowRef<MemberAdminRole[]>([]);
const visibleDialogAssign = shallowRef<boolean>(false);
const visibleDialogConfirm = shallowRef<boolean>(false);
const isSingleSelect = shallowRef<boolean>(false);

const clearTable = (): void => {
  eventBus.emit('data-table:clear-selected-data', {
    tableName: 'member-roles',
  });
  eventBus.emit('data-table:update', {
    tableName: 'member-roles',
  });
};

const activateRoles = async (
  state: boolean,
  roleId?: string,
  revertFunction?: () => void,
): Promise<void> => {
  try {
    await MemberAdminServices.activateRoles(props.memberId, {
      roleIds: roleId
        ? [roleId]
        : selectedMemberAdmins.value.map((role) => role.role._id),
      isActive: state,
    });

    if (!roleId) clearTable();
    toast.add({
      severity: 'success',
      message: state ? 'Role telah diaktifkan.' : 'Role telah dinonaktifkan.',
    });
  } catch (error) {
    console.error(error);
    toast.add({
      error,
      message: state ? 'Role gagal diaktifkan.' : 'Role gagal dinonaktifkan.',
    });
    revertFunction?.();
  }
};

const unassignRole = async (): Promise<void> => {
  try {
    const unassignIds = isSingleSelect.value
      ? [selectedMemberAdmin.value.role._id]
      : selectedMemberAdmins.value.map((role) => role.role._id);
    await MemberAdminServices.updateMemberAdmin(props.memberId, {
      roleId: currentMemberAdmins.value
        .map((role) => role.role._id)
        .filter((id) => !unassignIds.includes(id)),
    });

    clearTable();
    visibleDialogConfirm.value = false;
    toast.add({
      message: 'Role telah di-unassign.',
      severity: 'success',
    });
  } catch (error) {
    console.error(error);

    toast.add({
      error,
      message: 'Role gagal di-unassign.',
    });
  }
};

const getMemberRoles = async (
  query: QueryParams,
): Promise<FetchResponse | undefined> => {
  try {
    const { data } = await MemberAdminServices.getMemberRoles(
      props.memberId,
      query,
    );
    currentMemberAdmins.value = data.data.data;
    return data;
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="flex justify-between" data-wv-section="tabletoolbars">
    <div>
      <ButtonBulkAction
        v-model:selected-data="selectedMemberAdmins"
        :options="bulkAction"
        table-name="member-roles"
      />
    </div>
    <div class="flex gap-4">
      <ButtonSearch class="ml-auto" table-name="member-roles" />
      <ButtonFilter table-name="member-roles" />
      <Button
        v-if="access.create || access.update"
        @click="visibleDialogAssign = true"
        label="+ Admin Role"
        severity="secondary"
      />
    </div>
  </div>
  <FilterContainer :fields="adminFilterField" table-name="member-roles" />
  <DataTable
    :columns="roleColumns"
    :custom-column="false"
    :fetch-function="getMemberRoles"
    :options="singleAction"
    :selection-type="props.access.update ? 'checkbox' : 'none'"
    :use-option="props.access.update"
    @toggle-option="selectedMemberAdmin = $event"
    data-key="_id"
    lazy
    table-name="member-roles"
  />
  <DialogMemberAdmin
    v-model:visible="visibleDialogAssign"
    :member-admin="currentMemberAdmins"
    :member-id="props.memberId"
  />
  <DialogConfirm
    v-model:visible="visibleDialogConfirm"
    :close-after-confirm="false"
    :list="isSingleSelect ? [selectedMemberAdmin] : selectedMemberAdmins"
    @confirm="unassignRole"
    actionable
    confirm-label="Unassign"
    header="Unassign Role"
    list-label="role.name"
    message="Apakah kamu yakin ingin menghapusnya dari member?"
    severity="danger"
  />
</template>
