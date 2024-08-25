import { Ref, ref } from 'vue';

export interface LoadingStore {
  loading: Ref<boolean>;
  setLoading: (state: boolean) => void;
}

const loading = ref<boolean>(false);

const useLoadingStore = (): LoadingStore => {
  const setLoading = (state: boolean): void => {
    loading.value = state;
    document.body.classList[state ? 'add' : 'remove']('loading');
  };

  return {
    loading,
    setLoading,
  };
};

export default useLoadingStore;
