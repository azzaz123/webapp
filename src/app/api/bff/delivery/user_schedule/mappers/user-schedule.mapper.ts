import { ToDomainMapper } from '@api/core/utils/types';
import { DeliveryScheduleDto, ScheduleOptionDto, UserScheduleDto } from '../dtos/responses/delivery-schedule-dto.interface';

export const mapUserScheduleDtoUserSchedule: ToDomainMapper<DeliveryScheduleDto, any> = (input: DeliveryScheduleDto): any => {
  return {
    scheduleOptions: input.schedule_options.map(mapScheduleOptionsDtoToScheduleOptions),
    user_schedule: mapUserScheduleDtoToUserScheduleDto(input.user_schedule),
  };
};

const mapScheduleOptionsDtoToScheduleOptions: ToDomainMapper<ScheduleOptionDto, any> = (scheduleOption: ScheduleOptionDto): any => {
  return {
    scheduleTimeRange: scheduleOption.schedule_time_range,
    startTimeRange: scheduleOption.pickup_start_date,
    endTimeRange: scheduleOption.pickup_end_date,
  };
};

const mapUserScheduleDtoToUserScheduleDto: ToDomainMapper<UserScheduleDto, any> = (userSchedule: UserScheduleDto): any => {
  return {
    id: userSchedule.id,
    scheduleTimeRange: userSchedule.schedule_time_range,
  };
};
