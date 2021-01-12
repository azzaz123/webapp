import { selectUserProfileDetail, User } from '@data/user';
import { UserMother } from './../../domain/user.mother';
xdescribe('UserSelector', () => {
  describe('selectUserProfileDetail', () => {
    it('should return a user Detail', () => {
      const user: User = UserMother.random();

      const select = selectUserProfileDetail({ userDetail: user });

      expect(select).toEqual(user);
    });
  });
});
