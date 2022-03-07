export interface CarrierDropOffModeRequestDto {
  drop_off_modes: DropOffModeDto[] | [];
}

export interface DropOffModeDto {
  accept_relative_url: string;
  drop_off_mode: DropOffModeTypeDto;
  icon: string;
  post_office_details: PostOfficeDetailsDto;
  restrictions: string;
  seller_costs: SellerCostsDto;
  tentative_schedule: TentativeScheduleDto;
}

export interface PostOfficeDetailsDto {
  carrier: CarrierDto;
  last_address_used: LastAddressUsedDto;
  selection_required: boolean;
}

export interface LastAddressUsedDto {
  id: string;
  label: string;
}

export interface BuyerAddressDto {
  city: string;
  country: string;
  flat_and_floor?: string;
  full_name: string;
  id: string;
  phone_number: string;
  postal_code: string;
  region: string;
  street: string;
}

export interface PickUpPointDto {
  carrier_unit: number;
  city: string;
  id: string;
  postal_code: string;
  street: string;
}

export interface TentativeScheduleDto {
  is_editable: boolean;
  pickup_end_date: string;
  pickup_start_date: string;
}

export interface SellerCostsDto {
  amount: number;
  currency: string;
}

export type LastDeliveryModeDto = 'BUYER_ADDRESS' | 'CARRIER_OFFICE';
export type DropOffModeTypeDto = 'POST_OFFICE' | 'HOME_PICKUP';
export type CarrierDto = 'SEUR' | 'POSTE_ITALIANE' | 'correos';
