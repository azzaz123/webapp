export interface DidomiLibrary {
  getUserConsentStatusForPurpose(purpouseKey: string): boolean;
  getUserConsentStatusForVendor(vendorKey: string): boolean;
  getUserConsentStatusForAll(): DidomiUserConsents;
  on(event: string, callback: (event: any) => any): void;
}

export interface DidomiUserConsents {
  purposes: {
    enabled: string[];
    disabled: string[];
  };
}
