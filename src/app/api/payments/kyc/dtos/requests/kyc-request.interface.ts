export interface KYCBodyRequest {
  firstImage: Blob;
  secondImage: Blob;
  request: Blob;
}

export interface KYCBodyRequestedId {
  id: string;
}
