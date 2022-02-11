import { DeliveryCostsMoneyDto } from '@api/bff/delivery/costs/dtos/delivery-costs-money-dto.interface';

export interface DeliveryCostsDto {
  buyer_address_cost: DeliveryCostsMoneyDto;
  carrier_office_cost: DeliveryCostsMoneyDto;
}
