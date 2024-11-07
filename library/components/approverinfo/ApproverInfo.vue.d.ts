import {
  ClassComponent,
  GlobalComponentConstructor,
} from 'lib/components/ts-helpers';

export interface ApproverDetail {
  _id: string;
  level: number;
  type: 'and' | 'or';
  status: 'Selesai' | 'Menunggu Approval';
  approvers: {
    userId: string;
    userFullName: string;
    actionTimeStamp?: string;
    action?: 'approve' | 'reject';
  }[];
}

export interface ApproverInfoProps {
  approvals?: ApproverDetail[];
}

declare class ApproverInfo extends ClassComponent<
  ApproverInfoProps,
  unknown,
  unknown
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    ApproverInfo: GlobalComponentConstructor<ApproverInfo>;
  }
}

export default ApproverInfo;
