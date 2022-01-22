export interface SellerRequestBuyer {
  id: string;
  address: SellerRequestBuyerAddress;
}

export interface SellerRequestBuyerAddress {
  city: string;
  country: string;
}
