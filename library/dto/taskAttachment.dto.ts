export interface AddTaskAttachmentFileDTO {
  file: any;
  type: string;
}

export interface AddTaskAttachmentUrlDTO {
  url: string;
  displayName?: string;
}

export interface UpdateTaskAttachmentCaptionDTO {
  caption?: string;
}
