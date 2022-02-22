import { SCHEDULE_TYPE } from './schedule-type.type';

export interface DeliverySchedule {
  scheduleOptions: DeliveryScheduleOption[];
  userSchedule: DeliveryUserSchedule;
}

export interface DeliveryScheduleOption {
  scheduleTimeRange: SCHEDULE_TYPE;
  startTimeRange: Date;
  endTimeRange: Date;
}

export interface DeliveryUserSchedule {
  id: string;
  scheduleTimeRange: SCHEDULE_TYPE;
}
