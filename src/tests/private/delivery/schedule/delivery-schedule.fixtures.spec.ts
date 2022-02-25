import { DeliverySchedule } from '@api/core/model/delivery/schedule/delivery-schedule.interface';
import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';

export const MOCK_DELIVERY_SCHEDULE: DeliverySchedule = {
  scheduleOptions: {
    afternoon: {
      endTimeRange: formatDate(new Date('2021-10-28T12:15:40.876Z')),
      startTimeRange: formatDate(new Date('2021-10-28T18:15:40.876Z')),
      scheduleTimeRange: SCHEDULE_TYPE.AFTERNOON,
    },
    allDay: {
      endTimeRange: formatDate(new Date('2021-10-28T08:15:40.876Z')),
      startTimeRange: formatDate(new Date('2021-10-28T22:15:40.876Z')),
      scheduleTimeRange: SCHEDULE_TYPE.ALL_DAY,
    },
    morning: {
      endTimeRange: formatDate(new Date('2021-10-28T08:15:40.876Z')),
      startTimeRange: formatDate(new Date('2021-10-28T12:15:40.876Z')),
      scheduleTimeRange: SCHEDULE_TYPE.MORNING,
    },
  },
  userSchedule: {
    id: 'mdiejd8',
    scheduleTimeRange: SCHEDULE_TYPE.ALL_DAY,
  },
};

function formatDate(date: Date): string {
  return date.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
