import { FilterField } from 'lib/components/filtercontainer/FilterContainer.vue.d';
import { QuickFilterField } from 'lib/components/quickfilter/QuickFilter.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';

export const quickFilterField: QuickFilterField[] = [
  {
    field: 'category.key',
    type: 'multiselect',
    placeholder: 'Pilih category',
    fetchOptionFn(): MultiSelectOption[] {
      return [
        {
          label: 'Category new',
          value: 1,
        },
      ];
    },
  },
  {
    field: 'status',
    type: 'multiselect',
    placeholder: 'Pilih Status',
    fetchOptionFn(): Promise<MultiSelectOption[]> {
      return new Promise<MultiSelectOption[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { label: 'Missing', value: 'Missing' },
            { label: 'Not Paired Yet', value: 'Not Paired Yet' },
          ]);
        }, 300);
      });
    },
  },
  {
    field: 'brand.key',
    type: 'multiselect',
    placeholder: 'Pilih brand',
    fetchOptionFn(): Promise<MultiSelectOption[]> {
      return new Promise<MultiSelectOption[]>((resolve) => {
        setTimeout(() => {
          resolve([{ label: 'JHG-90', value: 370 }]);
        }, 300);
      });
    },
  },
  {
    field: 'assetValue',
    type: 'rangenumber',
    placeholder: '0',
    tooltip: 'Asset Value',
  },
];

export const filterFields: FilterField[] = [
  {
    label: 'Caetegory',
    field: 'category',
    type: 'multiselect',
    placeholder: 'Pilih category',
    fetchOptionFn(): MultiSelectOption[] {
      return [
        {
          label: 'Category new',
          value: 1,
        },
      ];
    },
  },
  {
    label: 'Status',
    field: 'status',
    type: 'multiselect',
    placeholder: 'Pilih Status',
    fetchOptionFn(): Promise<MultiSelectOption[]> {
      return new Promise<MultiSelectOption[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { label: 'Missing', value: 'Missing' },
            { label: 'Not Paired Yet', value: 'Not Paired Yet' },
          ]);
        }, 300);
      });
    },
  },
  {
    label: 'Brand/Model',
    field: 'brand',
    type: 'multiselect',
    placeholder: 'Pilih brand',
    fetchOptionFn(): Promise<MultiSelectOption[]> {
      return new Promise<MultiSelectOption[]>((resolve) => {
        setTimeout(() => {
          resolve([{ label: 'JHG-90', value: 370 }]);
        }, 300);
      });
    },
  },
  {
    label: 'Asset Value',
    field: 'assetValue',
    type: 'rangenumber',
    placeholder: '0',
  },
];
