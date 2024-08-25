<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { DataTableExpandedRows } from 'primevue/datatable';
import { TreeTableProps } from './TreeTable.vue.d';
import { Data } from '../datatable/DataTable.vue.d';
import { getNestedProperyValue } from 'lib/utils';
import Icon from '../icon/Icon.vue';
import Checkbox from 'primevue/checkbox';
import Preset from './treetable';
import Button from '../button/Button.vue';

const props = defineProps<TreeTableProps>();

const expandedRows = ref<DataTableExpandedRows>({});
const tableData = ref<Data[]>();
const checkboxSelection = ref<Data[]>([]);
const allDataSelected = shallowRef(false);

const isExpandedAll = computed(() => {
  return tableData.value
    ?.filter((d) => d.children?.length)
    .every((data) => expandedRows.value[data[props.dataKey]]);
});

const isRowExpanded = (key: string): boolean => {
  const keys = Object.keys(expandedRows.value);
  return keys.includes(key);
};

const toggleRowExpand = (data: Data, indexOfData: number): void => {
  const isExpanded = isRowExpanded(data[props.dataKey]);
  const isExpandingRow = !isExpanded;

  if (isExpandingRow) {
    expandedRows.value[data[props.dataKey]] = true;
  } else {
    delete expandedRows.value[data[props.dataKey]];
  }

  if (indexOfData >= 0) {
    const { children } = data;

    if (children?.length) {
      const childHeader = props.childTableProps.header
        ? { role: 'childheader', header: props.childTableProps.header }
        : undefined;

      const childrenRows = (childHeader ? [childHeader] : []).concat(
        children.map((child: Data) => ({
          role: 'child',
          ...child,
        })),
      );

      if (isExpandingRow)
        tableData.value.splice(indexOfData + 1, 0, ...childrenRows);
      else tableData.value.splice(indexOfData + 1, childrenRows.length);
    }
  }
};

const toggleAllDataSelection = (e: boolean): void => {
  checkboxSelection.value = e ? tableData.value : [];
};

const toggleExpandAll = (): void => {
  tableData.value.forEach((data, index) => {
    toggleRowExpand(data, index);
  });
};

onMounted(async () => {
  const { data } = (await props.fetchFunction?.({})) ?? {};
  tableData.value = data.data;
});
</script>

<template>
  <table aria-label="Custom Report Table" class="min-w-max w-full">
    <thead>
      <tr class="border-b border-primary-100">
        <th
          v-bind="Preset.headercell"
          class="w-[40px] text-center"
          data-wv-section="headerselection"
        >
          <Checkbox
            v-bind="Preset.headercheckbox"
            v-model="allDataSelected"
            :class="[
              {
                '[&_[data-pc-section=box]]:!border-white [&_[data-pc-section=box]]:!bg-transparent':
                  !allDataSelected,
              },
            ]"
            @update:model-value="toggleAllDataSelection"
            binary
            data-wv-section="headercheckbox"
          />
        </th>

        <th
          class="w-[40px] text-center"
          v-bind="Preset.headercell"
          data-wv-section="headertoggler"
        >
          <Button
            :class="[
              '!p-0 !m-0 !w-auto !h-auto',
              { 'rotate-180': isExpandedAll },
              { 'rotate-0': !isExpandedAll },
            ]"
            @click="toggleExpandAll"
            icon="arrow-down"
            icon-class="w-6 h-6 text-white"
            text
          />
        </th>

        <th :key="col.field" v-for="col in columns" v-bind="Preset.headercell">
          <span class="inline-flex gap-2 items-center cursor-pointer">
            {{ col.header }}

            <Icon v-if="col.sortable" class="text-base" icon="arrow-up-down" />
          </span>
        </th>
      </tr>
    </thead>

    <tbody>
      <template :key="index" v-for="(item, index) in tableData">
        <tr class="border-b border-general-100">
          <td class="w-[40px] text-center">
            <Checkbox
              v-if="!item.role?.includes('child')"
              v-bind="Preset.rowcheckbox"
              v-model="checkboxSelection"
              :value="item"
            />
          </td>

          <td class="w-[40px] text-center">
            <Button
              v-if="item.children?.length"
              :class="[
                '!p-0 !m-0 !w-auto !h-auto',
                { 'rotate-180': isRowExpanded(item[dataKey]) },
                { 'rotate-0': !isRowExpanded(item[dataKey]) },
              ]"
              @click="toggleRowExpand(item, index)"
              icon="arrow-down"
              icon-class="w-6 h-6"
              text
            />
          </td>

          <td
            v-if="item.role === 'childheader'"
            :class="[Preset.bodycell.class, 'font-semibold text-xs']"
            :colspan="props.columns.length"
          >
            {{ item.header }}
          </td>

          <template v-else>
            <td
              :key="col.field"
              v-for="col in item.role == 'child'
                ? (props.childTableProps.columns ?? columns)
                : columns"
              :colspan="col.colspan"
              v-bind="Preset.bodycell"
            >
              <template
                v-if="col.bodyComponent || col.bodyClass || col.bodyTemplate"
              >
                <component
                  :is="col.bodyComponent!(item).component"
                  v-if="col.bodyComponent"
                  v-model="col.bodyComponent!(item).model"
                  :disabled="col.bodyComponent!(item).disabled"
                  v-bind="col.bodyComponent!(item).props"
                  v-on="
                    col.bodyComponent!(item).events
                      ? col.bodyComponent!(item).events
                      : {}
                  "
                  @change="col.bodyComponent!(item).onChange?.(item)"
                  @update:model-value="
                    col.bodyComponent!(item).onChange?.(item)
                  "
                />

                <span
                  v-else
                  :class="
                    typeof col.bodyClass === 'function'
                      ? col.bodyClass(item)
                      : col.bodyClass
                  "
                >
                  <template v-if="col.bodyTemplate">
                    {{ (col.bodyTemplate && col.bodyTemplate(item)) || '-' }}
                  </template>
                  <template v-else>
                    {{ getNestedProperyValue(item, col.field) || '-' }}
                  </template>
                </span>
              </template>

              <template v-else>
                {{ getNestedProperyValue(item, col.field) ?? '-' }}
              </template>
            </td>
          </template>
        </tr>
      </template>
    </tbody>
  </table>
</template>
