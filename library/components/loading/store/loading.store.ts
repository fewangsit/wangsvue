import { Ref, ref, shallowRef } from 'vue';

export interface LoadingStore {
  loading: Ref<boolean>;
  message: Ref<string | undefined>;
  setLoading: (state: boolean, message?: string) => void;
}

const loading = shallowRef<boolean>(false);
const message = ref<string>();

const useLoadingStore = (): LoadingStore => {
  const setLoading = (state: boolean, msg?: string): void => {
    loading.value = state;
    message.value = msg;
    document.body.classList[state ? 'add' : 'remove']('loading');
  };

  return {
    loading,
    message,
    setLoading,
  };
};

export default useLoadingStore;
