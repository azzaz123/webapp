export interface DidomiLibrary {
  getUserConsentStatusForPurpose(purpouseKey: string): boolean;
  getUserConsentStatusForVendor(vendorKey: string): boolean;
}
