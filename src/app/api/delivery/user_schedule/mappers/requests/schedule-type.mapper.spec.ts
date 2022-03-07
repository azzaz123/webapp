import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';
import { mapScheduleTypeDomainToDto } from './schedule-type.mapper';

describe('mapScheduleTypeDomainToDto', () => {
  describe('when converting schedule type to dto', () => {
    it('should map to dto context', () => {
      expect(mapScheduleTypeDomainToDto[SCHEDULE_TYPE.ALL_DAY]).toEqual('all day');
      expect(mapScheduleTypeDomainToDto[SCHEDULE_TYPE.MORNING]).toEqual('morning');
      expect(mapScheduleTypeDomainToDto[SCHEDULE_TYPE.AFTERNOON]).toEqual('afternoon');
    });
  });
});
