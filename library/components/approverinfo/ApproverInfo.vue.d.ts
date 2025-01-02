import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers.d';

export interface ApproverDetail {
  _id?: string;
  level: number;
  type: 'and' | 'or';
  status: 'selesai' | 'menunggu approval';
  approvers: {
    _id: string;
    fullName: string;
    actionAt?: string;
    action?: 'menyetujui' | 'menolak' | null;
  }[];
}

export interface ApproverInfoProps {
  approvals?: ApproverDetail[];
  /**
   * To determine whether this component show short information about approval or not
   * @default true
   */
  showShortInfo?: boolean;
  /**
   * To set label text when showShortInfo is false
   */
  label?: string;
  /**
   * To format date in list approver
   * @default true
   */
  useFormatDate?: boolean;
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
