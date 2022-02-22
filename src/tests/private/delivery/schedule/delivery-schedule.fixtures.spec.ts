import { DeliverySchedule } from '@api/core/model/delivery/schedule/delivery-schedule.interface';
import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';

export const MOCK_DELIVERY_SCHEDULE: DeliverySchedule = {
  scheduleOptions: [
    {
      endTimeRange: new Date('2021-10-28T12:15:40.876Z'),
      startTimeRange: new Date('2021-10-28T18:15:40.876Z'),
      scheduleTimeRange: SCHEDULE_TYPE.AFTERNOON,
    },
    {
      endTimeRange: new Date('2021-10-28T08:15:40.876Z'),
      startTimeRange: new Date('2021-10-28T22:15:40.876Z'),
      scheduleTimeRange: SCHEDULE_TYPE.ALL_DAY,
    },
    {
      endTimeRange: new Date('2021-10-28T08:15:40.876Z'),
      startTimeRange: new Date('2021-10-28T12:15:40.876Z'),
      scheduleTimeRange: SCHEDULE_TYPE.MORNING,
    },
  ],
  userSchedule: {
    id: 'mdiejd8',
    scheduleTimeRange: SCHEDULE_TYPE.ALL_DAY,
  },
};
