export enum PERMISSIONS {
  normal = 'isNormal',
  professional = 'isProfessional',
  featured = 'isFeatured',
  visibility = 'visibility',
}

export const DEFAULT_PERMISSIONS: PERMISSIONS[] = [PERMISSIONS.visibility];
