import { mapAmountAndCurrenyToMoney } from '@api/core/mappers';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
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
  PostOfficeDetailsDto,
  TentativeScheduleDto,
} from '../dtos/carrier-drop-off-mode-request-dto.interface';
import {
  TentativeSchedule,
  PostOfficeDetails,
  CarrierDropOffModeRequest,
  DropOffModeRequest,
} from '@api/core/model/delivery/carrier-drop-off-mode';
import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { LastAddressUsed } from '@api/core/model/delivery/buyer/delivery-methods';

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

export const mapCarrierDropOffRequestModeDtoToCarrierDropOffModeRequest: ToDomainMapper<
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
    postOfficeDetails: dropOffModeDto.post_office_details ? getPostOfficeDetails(dropOffModeDto.post_office_details) : null,
    sellerCosts: mapAmountAndCurrenyToMoney(dropOffModeDto.seller_costs),
    acceptEndpoint: dropOffModeDto.accept_relative_url,
    restrictions: dropOffModeDto.restrictions,
    schedule: dropOffModeDto.tentative_schedule ? getTentativeShedule(dropOffModeDto.tentative_schedule) : null,
  };
};

const getPostOfficeDetails = (postOfficeDetailsDto: PostOfficeDetailsDto): PostOfficeDetails => {
  return {
    carrier: mapCarrierToDomain[postOfficeDetailsDto.carrier],
    lastAddressUsed: postOfficeDetailsDto.last_address_used ? getLastAddressUsed(postOfficeDetailsDto.last_address_used) : null,
    selectionRequired: postOfficeDetailsDto.selection_required,
  };
};

const getLastAddressUsed = (lastAddressUsedDto: LastAddressUsedDto): LastAddressUsed => {
  return lastAddressUsedDto as LastAddressUsed;
};

const getTentativeShedule = (tentativeScheduleDto: TentativeScheduleDto): TentativeSchedule => {
  return {
    isEditable: tentativeScheduleDto.is_editable,
    pickUpEndDate: new Date(tentativeScheduleDto.pickup_end_date),
    pickUpStartDate: new Date(tentativeScheduleDto.pickup_start_date),
  };
};
