import { BadgeProps } from 'lib/components/badge/Badge.vue.d';
import { WangsitStatus } from 'lib/types/wangsStatus.type';

export default function getStatusSeverity(
  status: WangsitStatus,
): BadgeProps['severity'] {
  if (['Backlog', 'Waiting Approval', 'Not Ready Yet'].includes(status)) {
    return 'dark';
  }
  if (
    ['Sprint', 'Penyesuaian', 'On Deployment', 'Waiting for Approval'].includes(
      status,
    )
  ) {
    return 'warning';
  }
  if (
    [
      'Pending Review Leader',
      'Ready to Deploy',
      'Pending E2E Testing Dev',
      'Selesai Dev',
      'Pending E2E Testing Staging',
      'Selesai Staging',
      'Pending E2E Testing',
    ].includes(status)
  ) {
    return 'primary';
  }
  if (['Fixing Bug', 'Reported Bug', 'Overdue', 'Nonaktif'].includes(status)) {
    return 'danger';
  }
  if (['Finish Deployment', 'Selesai', 'Aktif'].includes(status)) {
    return 'success';
  }
  return 'primary';
}
