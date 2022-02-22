import { MOCK_USER_DELIVERY_SCHEDULE_DTO } from '@api/fixtures/delivery/user-schedule/user-delivery-schedule.dto.fixtures.spec';
import { MOCK_DELIVERY_SCHEDULE } from '@fixtures/private/delivery/schedule/delivery-schedule.fixtures.spec';
import { mapUserScheduleDtoUserSchedule } from './user-schedule.mapper';

describe('mapUserScheduleDtoUserSchedule', () => {
  describe('when mapping from user schedule DTO', () => {
    it('should map to a delivery user schedule entity', () => {
      const result = mapUserScheduleDtoUserSchedule(MOCK_USER_DELIVERY_SCHEDULE_DTO);

      expect(result).toStrictEqual(MOCK_DELIVERY_SCHEDULE);
    });
  });
});
