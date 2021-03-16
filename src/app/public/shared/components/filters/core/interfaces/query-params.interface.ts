export type QueryParams<Required extends string = string, Optional extends string = string> = {
  [P in Required]: string;
} &
  {
    [P in Optional]?: string;
  };
