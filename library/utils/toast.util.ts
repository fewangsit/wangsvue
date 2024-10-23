import eventBus from 'lib/event-bus';
import { useToast as usePrimevueToast } from 'primevue/usetoast';
import { WangsIcons } from 'lib/components/icon/Icon.vue.d';

export interface ToastParams {
  message: string;
  severity?: 'success' | 'error' | 'info';
  /**
   * @default emotion-happy-fill
   */
  icon?: WangsIcons;
  iconClass?: any;
  /**
   * The error object from catch statement.
   */
  error?: unknown; // Change the error type to unknown
  /**
   * Set the duration of toast in milisecond.
   *
   * @default 3000 - 3s
   */
  life?: number;
  group?: string;
}

export interface ToastMethod {
  add(params: ToastParams): void;

  /**
   * Clears the messages that belongs to the group.
   * @param {string} group - Name of the message group.
   */
  removeGroup(group: string): void;

  removeAllGroups(): void;
}

const useToast = (): ToastMethod => {
  const toast = usePrimevueToast();
  return {
    add: (params: ToastParams): void => {
      const { message, error, severity, life, group } = params;

      const detail = (
        error || severity === 'error'
          ? `Oh tidak! ${message} Silakan coba lagi.`
          : `Berhasil! ${message}`
      ).trim();

      const formattedSeverity = error ? 'error' : (severity ?? 'success');

      toast.add({
        severity: formattedSeverity,
        detail,
        life: life ?? 3000,
        group,
      });

      eventBus.emit('toast:add', { ...params, severity: formattedSeverity });
    },

    removeGroup: (group: string): void => {
      toast.removeGroup(group);
    },

    removeAllGroups: (): void => {
      toast.removeAllGroups();
    },
  };
};

export default useToast;
