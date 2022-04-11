import { SCHEDULE_TYPE } from './schedule-type.type';

export interface DeliverySchedule {
  scheduleOptions: DeliveryScheduleOptions;
  userSchedule: DeliveryUserSchedule;
}

export interface DeliveryScheduleOptions {
  allDay: DeliveryScheduleOption;
  morning: DeliveryScheduleOption;
  afternoon: DeliveryScheduleOption;
}

export interface DeliveryScheduleOption {
  scheduleTimeRange: SCHEDULE_TYPE;
  startTimeRange: string;
  endTimeRange: string;
}

export interface DeliveryUserSchedule {
  id: string;
  scheduleTimeRange: SCHEDULE_TYPE;
}
