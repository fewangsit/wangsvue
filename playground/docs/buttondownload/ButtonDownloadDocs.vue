<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DataTable from 'lib/components/datatable/DataTable.vue';
import { FetchResponse } from 'lib/components/datatable/DataTable.vue.d';
import DocTitle from '../DocTitle.vue';

import ButtonDownload from 'lib/components/buttondownload/ButtonDownload.vue';
import MemberServices from '../../../library/services/member.service';

const tableColumns = [
  {
    field: 'fullName',
    header: 'Nama Lengkap',
    sortable: true,
    fixed: true,
    bodyTemplate: (data: { fullName: any }): string => {
      return data.fullName ?? '-';
    },
  },
  {
    field: 'email',
    header: 'Email',
    sortable: true,
    fixed: true,
    bodyTemplate: (data: { email: any }): string => {
      return data.email ?? '-';
    },
  },
  {
    field: 'employeeType',
    header: 'Jenis Karyawan',
    sortable: true,
    fixed: true,
    bodyTemplate: (data: { employeeType: any }): string => {
      return data.employeeType ?? '-';
    },
  },
  {
    field: 'division',
    header: 'Division',
    sortable: true,
    bodyTemplate: (data: { division: any }): string => {
      return data.division ?? '-';
    },
  },
  {
    field: 'position',
    header: 'Posisi',
    sortable: true,
    bodyTemplate: (data: { position: any }): string => {
      return data.position ?? '-';
    },
  },
  {
    field: 'projectCount',
    header: 'Jumlah Proyek',
    sortable: true,
    bodyTemplate: (data: { projectCount: any }): string => {
      return data.projectCount ? data.projectCount?.toString() : '0';
    },
  },
  {
    field: 'teams',
    header: 'Tim',
    sortable: true,
    bodyTemplate: (data: { teams: any }): string => {
      return data.teams?.length ? data.teams.join(', ') : '-';
    },
  },
];

const getTableData = async (
  params?: any,
): Promise<FetchResponse | undefined> => {
  try {
    const { data } = await MemberServices.getMemberList(params);
    return data;
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Table" />
    </template>
    <template #title> Button download </template>
    <template #content>
      <div class="flex justify-between gap-4">
        <span>Single Table</span>
        <ButtonDownload
          file-name="Download single table"
          table-name="first-table"
        />
      </div>

      <DataTable
        :columns="tableColumns"
        :fetch-function="getTableData"
        :total-disabled-rows="1"
        :use-option="false"
        data-key="_id"
        highlight-key="isItEverOverdue"
        lazy
        selection-type="single"
        table-name="first-table"
        use-paginator
      />

      <div class="flex justify-between gap-4">
        <span>Multi Table</span>
        <ButtonDownload
          :multi-table-names="['second-table', 'third-table']"
          file-name="Download multi tables"
        />
      </div>

      <DataTable
        :columns="tableColumns"
        :fetch-function="getTableData"
        :total-disabled-rows="1"
        :use-option="false"
        data-key="_id"
        highlight-key="isItEverOverdue"
        lazy
        selection-type="single"
        table-name="second-table"
        use-paginator
      />

      <DataTable
        :columns="
          tableColumns.filter(
            (col) => !['division', 'position'].includes(col.field),
          )
        "
        :fetch-function="getTableData"
        :total-disabled-rows="1"
        :use-option="false"
        data-key="_id"
        highlight-key="isItEverOverdue"
        lazy
        selection-type="single"
        table-name="third-table"
        use-paginator
      />
    </template>
  </Card>
</template>
