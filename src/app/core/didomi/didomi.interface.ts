export interface DidomiLibrary {
  getUserConsentStatusForAll(): DidomiUserConsents;
}

export interface DidomiUserConsents {
  purposes: {
    enabled: string[],
    disabled: string[]
  };
}
