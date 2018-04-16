export interface PrivacyPermission {
  version: string;
  allow: boolean;
}

export interface PrivacyPermissionRequestData {
  gdpr_display?: PrivacyPermission;
  privacy_policy?: PrivacyPermission;
}

export interface UserPrivacyPermissions {
  gdpr_display: PrivacyPermission[];
  privacy_policy: PrivacyPermission[];
}
