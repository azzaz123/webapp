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

export const mapUserScheduleDtoUserSchedule: ToDomainMapper<DeliveryScheduleDto, DeliverySchedule> = (input: DeliveryScheduleDto): any => {
  return {
    scheduleOptions: input.schedule_options.map(mapScheduleOptionsDtoToScheduleOptions),
    userSchedule: mapUserScheduleDtoToUserScheduleDto(input.user_schedule),
  };
};

const mapScheduleOptionsDtoToScheduleOptions: ToDomainMapper<ScheduleOptionDto, DeliveryScheduleOption> = (
  scheduleOption: ScheduleOptionDto
): any => {
  return {
    scheduleTimeRange: timeRange[scheduleOption.schedule_time_range],
    startTimeRange: new Date(scheduleOption.pickup_start_date),
    endTimeRange: new Date(scheduleOption.pickup_end_date),
  };
};

const mapUserScheduleDtoToUserScheduleDto: ToDomainMapper<UserScheduleDto, DeliveryUserSchedule> = (userSchedule: UserScheduleDto): any => {
  return {
    id: userSchedule.id,
    scheduleTimeRange: timeRange[userSchedule.schedule_time_range],
  };
};
