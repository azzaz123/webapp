export enum PUBLIC_PATHS {
  LOGIN = 'login',
  REGISTER = 'register',
  WALL = 'wall',
  ITEM_DETAIL = 'item',
  SEARCH = 'search',
  USER_DETAIL = 'user',
  PROCESS_COMPLETE = 'process-complete',
  NOT_FOUND = '404',
  MEMBER_GET_MEMBER = 'member-get-member',
}

export const NON_PARITY_URLS = [PUBLIC_PATHS.MEMBER_GET_MEMBER];

export enum PUBLIC_PATH_PARAMS {
  ID = 'id',
  WEBSLUG = 'webSlug',
}
