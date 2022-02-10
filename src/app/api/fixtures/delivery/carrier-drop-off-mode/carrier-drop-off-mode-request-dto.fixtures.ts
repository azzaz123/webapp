import { CarrierDropOffModeRequestDto } from '@api/delivery/carrier-drop-off-mode/request/dtos/carrier-drop-off-mode-request-dto.interface';
export const MOCK_CARRIER_DROP_OFF_MODE_REQUEST_DTO: CarrierDropOffModeRequestDto = {
  drop_off_modes: [
    {
      drop_off_mode: 'POST_OFFICE',
      icon: 'http://prod-delivery-resources.wallapop.com/Correos.png',
      post_office_details: {
        carrier: 'correos',
        last_address_used: {
          buyer_address: {
            city: 'Barcelona',
            country: 'Spain',
            flat_and_floor: '2-1',
            full_name: 'AABB',
            id: '21',
            phone_number: '655476854',
            postal_code: '08027',
            region: 'Catalunya',
            street: 'C/ Sol',
          },
          last_delivery_mode: 'BUYER_ADDRESS',
          pick_up_point: {
            carrier_unit: 2,
            city: 'Barcelona',
            id: '23826387263',
            postal_code: '08010',
            street: 'Rambla',
          },
        },
        selection_required: false,
      },
      seller_costs: { amount: 0.0, currency: 'EUR' },
      accept_relative_url: '/api/v3/delivery/seller/requests/ad39c2dd-7632-4354-ae95-fd324065038d/accept/post-office-drop-off',
      tentative_schedule: null,
      restrictions:
        'Please bear in mind that the sum of the length, height, and width cannot exceed 210 cm. The longest side cannot exceed 120 cm.',
    },
    {
      drop_off_mode: 'HOME_PICKUP',
      icon: 'http://prod-delivery-resources.wallapop.com/Seur.png',
      post_office_details: null,
      seller_costs: { amount: 2.25, currency: 'EUR' },
      accept_relative_url: '/api/v3/delivery/seller/requests/ad39c2dd-7632-4354-ae95-fd324065038d/accept/home-pickup',
      tentative_schedule: { is_editable: true, pickup_start_date: '2022-01-25T08:00:00Z', pickup_end_date: '2022-01-25T19:00:00Z' },
      restrictions:
        'The sum of the length plus twice the height and twice the width cannot exceed 300 cm, and the longest side cannot exceed 175 cm. Please, keep it in mind!',
    },
  ],
};
