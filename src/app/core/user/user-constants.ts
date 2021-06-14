export enum PERMISSIONS {
  normal = 'isNormal',
  professional = 'isProfessional',
  featured = 'isFeatured',
  bumps = 'bumps',
}

export const DEFAULT_PERMISSIONS: PERMISSIONS[] = [PERMISSIONS.bumps];
