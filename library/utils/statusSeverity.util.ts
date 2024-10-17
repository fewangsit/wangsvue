import { BadgeProps } from 'lib/components/badge/Badge.vue.d';
import { WangsitStatus } from 'lib/types/wangsStatus.type';

export default function getStatusSeverity(
  status: WangsitStatus,
): BadgeProps['severity'] {
  switch (status) {
    case 'Backlog':
    case 'Waiting Approval':
    case 'Not Ready Yet':
      return 'dark';

    case 'Sprint':
    case 'Penyesuaian':
    case 'On Deployment':
      return 'warning';

    case 'Pending Review Leader':
    case 'Ready to Deploy':
    case 'Pending E2E Testing Dev':
    case 'Selesai Dev':
    case 'Pending E2E Testing Staging':
    case 'Selesai Staging':
    case 'Pending E2E Testing':
    default:
      return 'primary';

    case 'Fixing Bug':
    case 'Reported Bug':
    case 'Overdue':
      return 'danger';

    case 'Finish Deployment':
    case 'Selesai':
      return 'success';
  }
}
