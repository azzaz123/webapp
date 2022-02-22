import { DeliveryScheduleDto } from '@api/bff/delivery/user_schedule/dtos/responses/delivery-schedule-dto.interface';

export const MOCK_USER_DELIVERY_SCHEDULE_DTO: DeliveryScheduleDto = {
  schedule_options: [
    {
      pickup_end_date: '2021-10-28T12:15:40.876Z',
      pickup_start_date: '2021-10-28T18:15:40.876Z',
      schedule_time_range: 'afternoon',
    },
    {
      pickup_end_date: '2021-10-28T08:15:40.876Z',
      pickup_start_date: '2021-10-28T22:15:40.876Z',
      schedule_time_range: 'all day',
    },
    {
      pickup_end_date: '2021-10-28T08:15:40.876Z',
      pickup_start_date: '2021-10-28T12:15:40.876Z',
      schedule_time_range: 'morning',
    },
  ],
  user_schedule: {
    id: 'mdiejd8',
    schedule_time_range: 'all day',
  },
};
