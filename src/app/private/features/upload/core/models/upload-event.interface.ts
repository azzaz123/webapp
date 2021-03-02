export interface UploadEvent {
  type: 'create' | 'update';
  values: any;
}

export interface UploadedEvent {
  action: string;
  response: any;
}
