import { mapMoneyToDomain } from '@api/core/mappers';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import {
  CarrierDropOffModeRequest,
  DropOffModeRequest,
} from '@api/core/model/delivery/carrier-drop-off-mode/carrier-drop-off-mode-request.interface';
import { PostOfficeDetails } from '@api/core/model/delivery/carrier-drop-off-mode/post-office-details.interface';
import { TentativeSchedule } from '@api/core/model/delivery/carrier-drop-off-mode/tentative-schedule.interface';
import { OfficeAddress } from '@api/core/model/delivery/carrier-drop-off-mode/office-address.interface';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { ToDomainMapper } from '@api/core/utils/types';
import {
  BuyerAddressDto,
  CarrierDropOffModeRequestDto,
  CarrierDto,
  DropOffModeDto,
  DropOffModeTypeDto,
  LastAddressUsedDto,
  LastDeliveryModeDto,
  PickUpPointDto,
  PostOfficeDetailsDto,
  TentativeScheduleDto,
} from '../dtos/carrier-drop-off-mode-request-dto.interface';
import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { LastAddressUsed } from '@api/core/model/delivery/carrier-drop-off-mode/last-address-used.interface';
import { DeliveryAddress } from '@api/core/model/delivery/address/delivery-address.interface';

const mapCarrierDropOffTypeToDomain: Record<DropOffModeTypeDto, CARRIER_DROP_OFF_MODE> = {
  POST_OFFICE: CARRIER_DROP_OFF_MODE.POST_OFFICE,
  HOME_PICKUP: CARRIER_DROP_OFF_MODE.HOME_PICK_UP,
};

const mapCarrierToDomain: Record<CarrierDto, POST_OFFICE_CARRIER> = {
  SEUR: POST_OFFICE_CARRIER.SEUR,
  POSTE_ITALIANE: POST_OFFICE_CARRIER.POSTE_ITALIANE,
  correos: POST_OFFICE_CARRIER.CORREOS,
};

const mapDeliveryModeToDomain: Record<LastDeliveryModeDto, DELIVERY_MODE> = {
  BUYER_ADDRESS: DELIVERY_MODE.BUYER_ADDRESS,
  CARRIER_OFFICE: DELIVERY_MODE.CARRIER_OFFICE,
};

export const mapCarrierDropOffRequestModeDtoToCarrierDropOfModeRequest: ToDomainMapper<
  CarrierDropOffModeRequestDto,
  CarrierDropOffModeRequest
> = (input: CarrierDropOffModeRequestDto) => {
  const dropOffModeRequests: DropOffModeRequest[] = input.drop_off_modes.map((modeDto: DropOffModeDto) => getModes(modeDto));
  return { modes: dropOffModeRequests };
};

const getModes = (dropOffModeDto: DropOffModeDto): DropOffModeRequest => {
  let dropOffModeRequest: DropOffModeRequest;

  if (dropOffModeDto) {
    dropOffModeRequest = getDropOffModeRequest(dropOffModeDto);
  }

  return dropOffModeRequest;
};

const getDropOffModeRequest = (dropOffModeDto: DropOffModeDto): DropOffModeRequest => {
  return {
    type: mapCarrierDropOffTypeToDomain[dropOffModeDto.drop_off_mode],
    icon: dropOffModeDto.icon,
    postOfficeDetails: getPostOfficeDetails(dropOffModeDto.post_office_details),
    sellerCosts: mapMoneyToDomain(dropOffModeDto.seller_costs),
    acceptEndpoint: dropOffModeDto.accept_relative_url,
    restrictions: dropOffModeDto.restrictions,
    schedule: getTentativeShedule(dropOffModeDto.tentative_schedule),
  };
};

const getPostOfficeDetails = (postOfficeDetailsDto: PostOfficeDetailsDto): PostOfficeDetails => {
  return {
    carrier: mapCarrierToDomain[postOfficeDetailsDto.carrier],
    lastAddressUsed: getLastAddressUsed(postOfficeDetailsDto.last_address_used),
    selectionRequired: postOfficeDetailsDto.selection_required,
  };
};

const getLastAddressUsed = (lastAddressUsedDto: LastAddressUsedDto): LastAddressUsed => {
  return {
    buyerAddress: getDeliveryAddress(lastAddressUsedDto.buyer_address),
    deliveryMode: mapDeliveryModeToDomain[lastAddressUsedDto.last_delivery_mode],
    officeAddress: getOfficeAddress(lastAddressUsedDto.pick_up_point),
  };
};

const getDeliveryAddress = (buyerAddressDto: BuyerAddressDto): DeliveryAddress => {
  return {
    id: buyerAddressDto.id,
    fullName: buyerAddressDto.full_name,
    street: buyerAddressDto.street,
    postalCode: buyerAddressDto.postal_code,
    city: buyerAddressDto.city,
    region: buyerAddressDto.region,
    phoneNumber: buyerAddressDto.phone_number,
    flatAndFloor: buyerAddressDto.flat_and_floor,
    country: buyerAddressDto.country,
  };
};

const getOfficeAddress = (pickUpPointDto: PickUpPointDto): OfficeAddress => {
  return {
    id: pickUpPointDto.id,
    unit: pickUpPointDto.carrier_unit,
    city: pickUpPointDto.city,
    postalCode: pickUpPointDto.postal_code,
    street: pickUpPointDto.street,
  };
};

const getTentativeShedule = (tentativeScheduleDto: TentativeScheduleDto): TentativeSchedule => {
  return {
    isEditable: tentativeScheduleDto.is_editable,
    pickUpEndDate: new Date(tentativeScheduleDto.pickup_end_date),
    pickUpStartDate: new Date(tentativeScheduleDto.pickup_start_date),
  };
};
