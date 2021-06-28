export enum PERMISSIONS {
  normal = 'isNormal',
  professional = 'isProfessional',
  featured = 'isFeatured',
  bumps = 'bumps',
  subscriptions = 'subscriptions',
}

export const DEFAULT_PERMISSIONS: PERMISSIONS[] = [PERMISSIONS.bumps, PERMISSIONS.subscriptions];
