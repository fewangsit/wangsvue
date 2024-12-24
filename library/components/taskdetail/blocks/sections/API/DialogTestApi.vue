<script setup lang="ts">
import { computed, inject, reactive, Ref, ref, shallowRef } from 'vue';
import { keyValueTableColum } from './TestApi/options/keyValueTableColumn';
import {
  DataTableCellEditedEvent,
  FetchResponse,
  TableCellComponent,
  TableColumn,
} from 'lib/components/datatable/DataTable.vue.d';
import {
  EndpointDetail,
  ExecuteEndpoint,
  FormDataBody,
} from 'lib/types/projectQc.type';
import { TaskAPIFormDataCustom } from 'lib/types/task.type';

import Button from 'lib/components/button/Button.vue';
import Dialog from 'lib/components/dialog/Dialog.vue';
import { ProjectQCServices } from 'wangsit-api-services';
import InputText from 'lib/components/inputtext/InputText.vue';
import ValueFormDataInput from './ValueFormDataInput.vue';
import IsRequiredText from './IsRequiredText.vue';
import CodeSnippet from 'lib/components/codesnippet/CodeSnippet.vue';
import DataTable from 'lib/components/datatable/DataTable.vue';

import wangsitLogo from '../../../../../assets/image/wangsit-logo.png';

const projectId = inject<Ref<string>>('projectId');

const props = defineProps<{
  taskApi?: TaskAPIFormDataCustom;
}>();

const visible = defineModel<boolean>('visible', { required: true });

const detailEndpoint = shallowRef<EndpointDetail>();
const isLoading = shallowRef<boolean>(false);
const executeEndpointResponse = shallowRef<ExecuteEndpoint>();
const pathVariablesData = reactive<Record<string, unknown>>({});
const queryParamsData = reactive<Record<string, unknown>>({});
const requestBodyJson = ref();
const formDataBody = reactive<Record<string, unknown>>({});

const formDataTableColumn: TableColumn[] = [
  {
    field: 'key',
    header: 'Key',
    sortable: false,
  },
  {
    field: 'type',
    header: 'Data Type',
    sortable: false,
  },
  {
    field: 'isMandatory',
    header: 'Required',
    sortable: false,
    bodyComponent: (data: FormDataBody): TableCellComponent => {
      return {
        component: IsRequiredText,
        props: {
          isRequired: data.isMandatory,
        },
      };
    },
  },
  {
    field: '',
    header: 'Value',
    sortable: false,
    bodyComponent: (data: FormDataBody): TableCellComponent => {
      return {
        component: ValueFormDataInput,
        props: {
          typeValue: data.type,
          initialValue: detailEndpoint.value?.savedBody[data.key],
        },
        events: {
          textInput: (value: string | undefined): void => {
            formDataBody[data.key] = value;
          },
          fileInput: (value: File): void => {
            formDataBody[data.key] = value;
          },
        },
      };
    },
  },
];

const getBodyExecute = computed<string | FormData>(() => {
  if (detailEndpoint.value.type === 'json') {
    return requestBodyJson.value;
  }
  const formData = new FormData();
  Object.entries(formDataBody).forEach((item) => {
    if (item[1] === undefined) {
      return;
    }
    formData.append(item[0], item[1] as string | File);
  });
  return formData;
});

const getEndpointDetail = async (): Promise<void> => {
  try {
    const { data } = await ProjectQCServices.getEndpointDetail(
      projectId.value,
      props.taskApi._id,
    );
    detailEndpoint.value = data.data;

    data.data?.pathVariables?.forEach((item) =>
      Object.assign(pathVariablesData, {
        [item]: data.data?.savedPathVariables?.[item] ?? undefined,
      }),
    );

    data.data?.query?.forEach((item) =>
      Object.assign(queryParamsData, {
        [item]: data.data?.savedQueryParams?.[item] ?? undefined,
      }),
    );

    if (data.data.type === 'json' && data.data.jsonBody) {
      requestBodyJson.value = JSON.stringify(
        JSON.parse(data.data?.jsonBody),
        null,
        8,
      );
    } else if (data.data.type === 'form-data') {
      data.data.formDataBody.forEach((item) => {
        Object.assign(formDataBody, {
          [item?.key]: data.data.savedBody?.[item?.key],
        });
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const postExecuteEndpoint = async (): Promise<void> => {
  try {
    const { data } = await ProjectQCServices.postExecuteEndpoint(
      projectId.value,
      props.taskApi._id,
      detailEndpoint.value.type,
      {
        pathVariables: JSON.stringify(
          excludeEmptyValueObject(pathVariablesData),
        ),
        queryParams: JSON.stringify(excludeEmptyValueObject(queryParamsData)),
      },
      getBodyExecute.value,
    );

    try {
      executeEndpointResponse.value = {
        ...data.data,
        response: JSON.stringify(
          JSON.parse((data?.data?.response ?? '{}') as string),
          null,
          8,
        ),
      };
    } catch (error) {
      console.error(error);
      executeEndpointResponse.value = {
        ...data.data,
        response: data.data?.response,
      };
    }
  } catch (error) {
    console.error(error);
  }
};

const getTableDataQueryParams = async (): Promise<FetchResponse> => {
  const queryParamsList = Object.entries(queryParamsData);
  return {
    data: {
      data: queryParamsList.map((item) => {
        const [key, value] = item;
        return {
          keys: key,
          values: value,
        };
      }),
      totalRecords: queryParamsList.length,
    },
    message: '',
  };
};

const getTableDataPathVariable = async (): Promise<FetchResponse> => {
  const pathVariableList = Object.entries(pathVariablesData);
  return {
    data: {
      data: pathVariableList.map((item) => {
        const [key, value] = item;
        return {
          keys: key,
          values: value,
        };
      }),
      totalRecords: pathVariableList.length,
    },
    message: '',
  };
};

const getTableDataFormDataTable = async (): Promise<FetchResponse> => {
  const data = {
    data: {
      data: detailEndpoint.value?.formDataBody,
      totalRecords: 0,
    },
    message: '',
  };

  return data;
};

const queryParamsCellEdited = (event: DataTableCellEditedEvent): void => {
  const { keys } = event.item;
  if (event.value !== '-') {
    Object.assign(queryParamsData, { [keys]: event.value });
  }
};

const pathVariableCellEdited = (event: DataTableCellEditedEvent): void => {
  const { keys } = event.item;
  if (event.value !== '-') {
    Object.assign(pathVariablesData, { [keys]: event.value });
  }
};

const excludeEmptyValueObject = (
  data: Record<string, unknown>,
): Record<string, unknown> => {
  const temporaryData = {};

  Object.keys(data).forEach((item) => {
    if (data[item] !== '') {
      Object.assign(temporaryData, {
        [item]: data[item],
      });
    }
  });

  if (Object.keys(temporaryData).length > 0) return temporaryData;
};
</script>

<!-- eslint-disable vue/html-indent -->
<template>
  <Dialog
    v-model:visible="visible"
    :closable="false"
    @show="getEndpointDetail"
    class="w-[800px]"
    header="Tes API"
    modal
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <span class="text-lg font-semibold leading-4">Performance Testing</span>
        <Button
          @click="visible = false"
          class="!p-0.5 !text-general-200 dark:!text-general-200"
          data-wv-section="closebutton"
          icon="close"
          icon-class="w-[22px] h-[22px]"
          severity="secondary"
          text
        />
      </div>
    </template>
    <template #default>
      <div class="flex flex-row gap-2">
        <div>Modul: {{ detailEndpoint?.module?.name }}</div>
        <div>Sub Modul: {{ detailEndpoint?.subModule?.name }}</div>
        <div>API: {{ detailEndpoint?.api }}</div>
      </div>
      <div class="flex gap-3">
        <InputText
          :value="detailEndpoint?.endpoint?.url"
          class="flex-1 !text-black"
          disabled
          field-name="endpoint-url"
          placeholder="Masukkan url atau tempel teks"
        >
          <template #addon-left>
            <span>{{ detailEndpoint?.endpoint?.method }}</span>
          </template>
        </InputText>
        <Button
          :disabled="isLoading"
          @click="() => postExecuteEndpoint()"
          class="flex-none"
          label="Jalankan Pengetesan"
          severity="secondary"
        />
      </div>
      <div class="bg-[#F8F7EE] p-3 rounded-lg">
        <span class="font-semibold">Parameter</span>
      </div>
      <div class="flex flex-col gap-3">
        <span class="font-semibold">Query Params</span>
        <template v-if="detailEndpoint?.query?.length <= 0">
          <span class="text-center">Tidak ada parameter.</span>
        </template>
        <template v-else>
          <DataTable
            :columns="keyValueTableColum"
            :custom-column="false"
            :fetch-function="getTableDataQueryParams"
            :use-option="false"
            @cell-edited="queryParamsCellEdited"
            data-key="key"
            lazy
            selection-type="none"
            table-name="query-params"
          />
        </template>
      </div>
      <div class="flex flex-col gap-3">
        <span class="font-semibold">Path Variable</span>
        <template v-if="detailEndpoint?.pathVariables?.length <= 0">
          <span class="text-center">Tidak ada parameter.</span>
        </template>
        <template v-else>
          <DataTable
            :columns="keyValueTableColum"
            :custom-column="false"
            :fetch-function="getTableDataPathVariable"
            :use-option="false"
            @cell-edited="pathVariableCellEdited"
            data-key="key"
            lazy
            selection-type="none"
            table-name="path-variables"
          />
        </template>
      </div>

      <div class="bg-[#F8F7EE] p-3 rounded-lg">
        <span class="font-semibold">Request Body</span>
      </div>
      <template v-if="detailEndpoint?.type === 'json'">
        <CodeSnippet v-model:code="requestBodyJson" :readonly="false" />
      </template>
      <template v-else-if="detailEndpoint?.formDataBody">
        <DataTable
          :columns="formDataTableColumn"
          :custom-column="false"
          :fetch-function="getTableDataFormDataTable"
          :use-option="false"
          selection-type="none"
        />
      </template>
      <template v-else>
        <span class="text-center">Tidak ada parameter.</span>
      </template>

      <div
        class="bg-[#F8F7EE] p-3 rounded-lg flex flex-row items-center justify-between"
      >
        <span class="font-semibold">Response</span>

        <div
          v-if="executeEndpointResponse !== undefined"
          class="flex flex-row gap-2 items-center"
        >
          <span>
            Status:
            <span
              :class="
                parseInt(executeEndpointResponse.statusString.split(' ')[0]) >=
                400
                  ? 'text-danger-500'
                  : 'text-success-500'
              "
            >
              {{ executeEndpointResponse.statusString }}
            </span>
          </span>
          <span>
            Response Time:
            <span class="text-[#009384]">
              {{ executeEndpointResponse.responseTimeMs }} ms
            </span>
          </span>
          <span>
            Average Ping Server:
            <span class="text-[#009384]">
              {{ executeEndpointResponse.pingServerMs }} ms
            </span>
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-5 items-center">
        <template v-if="isLoading">
          <img alt="Wangsit Logo" class="opacity-50 w-24" src="" />
          <span>Memuat response...</span>
        </template>

        <template v-if="!isLoading && executeEndpointResponse === undefined">
          <img :src="wangsitLogo" alt="Wangsit Logo" class="opacity-50 w-24" />
          <span>
            Masukkan URL dan klik Lakukan Pengetesan untuk melihat response
          </span>
        </template>

        <div
          v-if="!isLoading && executeEndpointResponse !== undefined"
          class="flex w-full gap-4"
        >
          <div class="flex-1 overflow-hidden">
            <p class="!font-semibold text-xs mb-3">API Spec</p>
            <CodeSnippet
              :code="detailEndpoint?.apiSpecResponse"
              lang="json"
              readonly
            />
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="!font-semibold text-xs mb-3">Response</p>
            <CodeSnippet :code="executeEndpointResponse?.response" readonly />
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>
