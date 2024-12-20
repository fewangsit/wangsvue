import { ToastMethod } from 'lib/utils/toast.util';
import { SprintServices } from 'wangsit-api-services';

const updateSprintStatus = async (
  fetchData: () => Promise<void> | void,
  toast: ToastMethod,
  projectId: string,
  sprintId?: string,
): Promise<void> => {
  try {
    await SprintServices.updateSprintStatus(projectId, sprintId);
    await fetchData();
    toast.add({
      severity: 'success',
      message: 'Sprint telah ditandai ready to sprint.',
    });
  } catch (error) {
    console.error(error);
    toast.add({
      error,
      message: 'Sprint gagal ditandai ready to sprint.',
    });
  }
};

export default updateSprintStatus;
