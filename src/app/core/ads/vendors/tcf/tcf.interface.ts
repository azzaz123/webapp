export interface TcfApi {
  (command: TCF_API_COMMAND, version: TCF_API_VERSION, callback: tcfApiCallback): void;
}

export enum TCF_API_COMMAND {
  ADD_EVENT_LISTENER = 'addEventListener',
  REMOVE_EVENT_LISTENER = 'removeEventListener',
}

export interface tcfApiCallback {
  (tcdata: TcdData, success: boolean): void;
}

export interface TcdData {
  eventStatus: TCF_EVENT_STATUS;
  tcString: string;
}

export enum TCF_EVENT_STATUS {
  USER_ACTION_COMPLETE = 'useractioncomplete',
  TC_LOADED = 'tcloaded',
  CMPU_IS_SHOWN = 'cmpuishown',
}

export enum TCF_API_VERSION {
  V1 = 1,
  V2 = 2,
}
