/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { Message } from './message';
import { MESSAGE_MAIN, MOCK_MESSAGE } from '../../../tests/message.fixtures.spec';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { clone } from 'lodash-es';

describe('Message', () => {
  it('should create an instance', () => {
    expect(MOCK_MESSAGE).toBeTruthy();
  });
  describe('get id', () => {
    it('should retrieve the message id', () => {
      expect(MOCK_MESSAGE.id).toEqual(MESSAGE_MAIN.id);
    });
  });
  describe('get conversation id', () => {
    it('should retrieve the message id', () => {
      expect(MOCK_MESSAGE.thread).toEqual(MESSAGE_MAIN.thread);
    });
  });
  describe('get message', () => {
    it('should retrieve the message text', () => {
      expect(MOCK_MESSAGE.message).toEqual(MESSAGE_MAIN.body);
    });
  });
  describe('get user', () => {
    it('should retrieve the message user', () => {
      const message: Message = clone(MOCK_MESSAGE);
      message.user = MOCK_USER;
      expect(message.user).toEqual(MOCK_USER);
    });
  });
});
