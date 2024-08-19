import {
  FilterOptions,
  LoadingFilters,
  MultiSelectFilterField,
} from '../FilterContainer.vue.d';

const getOptions = async (
  fn: MultiSelectFilterField['fetchOptionFn'],
  field: string,
  filterOption: FilterOptions,
  loading: LoadingFilters,
): Promise<void> => {
  try {
    loading[field] = true;
    filterOption[field] = [];
    const option = await fn?.();

    if (option) filterOption[field] = option;
  } catch (error) {
    console.error(error);
  } finally {
    loading[field] = false;
  }
};

export default getOptions;
