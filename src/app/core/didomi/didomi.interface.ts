export interface DidomiLibrary {
  getUserConsentStatusForPurpose(purpouseKey: string): boolean;
  getUserConsentStatusForVendor(vendorKey: string): boolean;
  getUserConsentStatusForAll(): DidomiUserConsents;
}

export interface DidomiUserConsents {
  purposes: {
    enabled: string[];
    disabled: string[];
  };
}
