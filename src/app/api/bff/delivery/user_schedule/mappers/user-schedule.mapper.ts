import {
  DeliverySchedule,
  DeliveryScheduleOption,
  DeliveryUserSchedule,
} from '@api/core/model/delivery/schedule/delivery-schedule.interface';
import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';
import { ToDomainMapper } from '@api/core/utils/types';
import {
  DeliveryScheduleDto,
  ScheduleOptionDto,
  UserScheduleDto,
  ScheduleTypeDto,
} from '../dtos/responses/delivery-schedule-dto.interface';

const timeRange: Record<ScheduleTypeDto, SCHEDULE_TYPE> = {
  afternoon: SCHEDULE_TYPE.AFTERNOON,
  'all day': SCHEDULE_TYPE.ALL_DAY,
  morning: SCHEDULE_TYPE.MORNING,
};

export const mapUserScheduleDtoUserSchedule: ToDomainMapper<DeliveryScheduleDto, DeliverySchedule> = (
  input: DeliveryScheduleDto
): DeliverySchedule => {
  return {
    scheduleOptions: {
      allDay: mapScheduleTypeDtoToScheduleOption(input.schedule_options, 'all day'),
      morning: mapScheduleTypeDtoToScheduleOption(input.schedule_options, 'morning'),
      afternoon: mapScheduleTypeDtoToScheduleOption(input.schedule_options, 'afternoon'),
    },
    userSchedule: mapUserScheduleDtoToUserScheduleDto(input.user_schedule),
  };
};

function mapScheduleTypeDtoToScheduleOption(input: ScheduleOptionDto[], timeRange: ScheduleTypeDto): DeliveryScheduleOption {
  const schedule: ScheduleOptionDto = input.find((schedule) => schedule.schedule_time_range === timeRange);
  return mapScheduleOptionsDtoToScheduleOptions(schedule);
}

const mapScheduleOptionsDtoToScheduleOptions: ToDomainMapper<ScheduleOptionDto, DeliveryScheduleOption> = (
  scheduleOption: ScheduleOptionDto
): DeliveryScheduleOption => {
  return {
    scheduleTimeRange: timeRange[scheduleOption.schedule_time_range],
    startTimeRange: getHourAndMinutesFromDate(new Date(scheduleOption.pickup_start_date)),
    endTimeRange: getHourAndMinutesFromDate(new Date(scheduleOption.pickup_end_date)),
  };
};

const mapUserScheduleDtoToUserScheduleDto: ToDomainMapper<UserScheduleDto, DeliveryUserSchedule> = (
  userSchedule: UserScheduleDto
): DeliveryUserSchedule => {
  return {
    id: userSchedule.id,
    scheduleTimeRange: timeRange[userSchedule.schedule_time_range],
  };
};

const getHourAndMinutesFromDate: ToDomainMapper<Date, string> = (date: Date): string => {
  return date.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
