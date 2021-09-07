/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { User } from './user';
import {
  IMAGE,
  MICRO_NAME,
  ONLINE,
  RECEIVED_REPORTS,
  RESPONSE_RATE,
  SCORING_STARS,
  SCORING_STARTS,
  STATS,
  USER_ID,
  USER_LOCATION,
  USER_TYPE,
  USER_WEB_SLUG,
  VALIDATIONS,
  VERIFICATION_LEVEL,
} from '../../../tests/user.fixtures.spec';
import { MOCK_ITEM } from '../../../tests/item.fixtures.spec';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User('testId')).toBeTruthy();
  });

  it('should set the user data through the constructor', () => {
    const user: User = new User(
      USER_ID,
      MICRO_NAME,
      IMAGE,
      USER_LOCATION,
      STATS,
      VALIDATIONS,
      VERIFICATION_LEVEL,
      SCORING_STARS,
      SCORING_STARTS,
      RESPONSE_RATE,
      ONLINE,
      USER_TYPE,
      RECEIVED_REPORTS,
      USER_WEB_SLUG
    );
    expect(user.id).toBe(USER_ID);
    expect(user.microName).toBe(MICRO_NAME);
    expect(user.image).toBe(IMAGE);
    expect(user.location).toBe(USER_LOCATION);
    expect(user.stats).toBe(STATS);
    expect(user.validations).toBe(VALIDATIONS);
    expect(user.verificationLevel).toBe(VERIFICATION_LEVEL);
    expect(user.scoringStars).toBe(SCORING_STARS);
    expect(user.scoringStarts).toBe(SCORING_STARTS);
    expect(user.responseRate).toBe(RESPONSE_RATE);
    expect(user.online).toBe(ONLINE);
    expect(user.type).toBe(USER_TYPE);
    expect(user.receivedReports).toBe(RECEIVED_REPORTS);
    expect(user.webSlug).toBe(USER_WEB_SLUG);
  });
  it('should set item distance', () => {
    const user: User = new User(USER_ID);
    user.itemDistance = 1;
    expect(user.itemDistance).toBe(1);
  });
  it('should set selling item', () => {
    const user: User = new User(USER_ID);
    user.sellingItem = MOCK_ITEM;
    expect(user.sellingItem).toBe(MOCK_ITEM);
  });
  it('should set items count', () => {
    const user: User = new User(USER_ID);
    user.itemsCount = 3;
    expect(user.itemsCount).toBe(3);
  });
});
