import { MESSAGE_MAIN } from './message.fixtures.spec';
import { CallResponse } from '../app/core/conversation/call-response.interface';
import { SURVEY_RESPONSES } from './conversation.fixtures.spec';
import { USER_ID } from './user.fixtures.spec';
import { Call } from '../app/core/conversation/calls';
import { User } from '../app/core/user/user';
import { Item } from '../app/core/item/item';
import { ITEM_ID, ITEM_LEGACY_ID } from './item.fixtures.spec';

export const CALL_ID: string = MESSAGE_MAIN.thread;
export const CALL_PHONE = '123.456.789';
export const CALL_DURATION = 10;
export const CALL_STATUS = 'ANSWERED';

export const CALLS_DATA: CallResponse[] = [
  {
    legacy_id: 500000002,
    id: 'pzp9m08vx563',
    modified_date: 1474988119,
    user_id: 'l1kmzn82zn3p',
    item_id: '9jd7ryx5odjk',
    buyer_phone_number: CALL_PHONE,
    call_duration: CALL_DURATION,
    call_status: CALL_STATUS,
    survey_responses: SURVEY_RESPONSES,
  },
  {
    legacy_id: 500000002,
    id: 'pzp9m08vx563',
    modified_date: 1474988119,
    user_id: 'l1kmzn82zn3p',
    item_id: '9jd7ryx5odjk',
    buyer_phone_number: CALL_PHONE,
    call_duration: CALL_DURATION,
    call_status: CALL_STATUS,
    survey_responses: SURVEY_RESPONSES,
  },
];

export const CALL_DATE: number = new Date().getTime();

export const MOCK_CALL: Function = (
  id: string = CALL_ID,
  userId: string = USER_ID,
  phone: string = CALL_PHONE,
  status: string = CALL_STATUS
): Call => {
  return new Call(
    id,
    1,
    CALL_DATE,
    phone,
    CALL_DURATION,
    status,
    new User(userId),
    new Item(ITEM_ID, ITEM_LEGACY_ID, USER_ID),
    [],
    false,
    SURVEY_RESPONSES
  );
};

export function createCallsArray(total: number, status?: string, offset: number = 0) {
  const calls: Call[] = [];
  for (let i = 1; i <= total; i++) {
    calls.push(MOCK_CALL((i + offset).toString(), undefined, undefined, status));
  }
  return calls;
}
