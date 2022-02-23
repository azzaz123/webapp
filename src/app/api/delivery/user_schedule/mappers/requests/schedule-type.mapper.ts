import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';
import { ScheduleTypeDto } from '../../dtos/requests/schedule-type-dto.type';

export const mapScheduleTypeDomainToDto: Record<SCHEDULE_TYPE, ScheduleTypeDto> = {
  [SCHEDULE_TYPE.ALL_DAY]: 'all day',
  [SCHEDULE_TYPE.MORNING]: 'morning',
  [SCHEDULE_TYPE.AFTERNOON]: 'afternoon',
};
