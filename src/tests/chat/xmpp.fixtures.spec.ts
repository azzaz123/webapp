import { XMPP_MESSAGE_TYPE } from '@core/xmpp/xmpp.enum';
import { XmppBodyMessage, NormalXmppMessage } from '@core/xmpp/xmpp.interface';
import { StanzaIO } from '@core/xmpp/xmpp.provider';
import { environment } from '@environments/environment.beta';
import { OTHER_USER_ID, USER_ID } from '@fixtures/user.fixtures.spec';

export const mamFirstIndex = '1899';
export const mamCount = 1900;
export const queryId = 'abcdef';
export const LAST_MESSAGE = 'second';
export const FIRST_MESSAGE = 'first';
export const MESSAGE_ID = 'messageId';
export const MESSAGE_BODY = 'body';
export const MOCK_SERVER_DATE: Date = new Date('Fri Oct 28 2016 11:50:29 GMT+0200 (CEST)');

export class MockedClient {
  on(event: string, handler: Function): void {}

  connect(options?: any): void {}

  disconnect() {}

  sendPresence(options?: any): void {}

  enableCarbons(): void {}

  use(plugin: Function): void {}

  getTime(userId: string): Promise<any> {
    return new Promise((resolve: Function) => {
      resolve({});
    });
  }

  sendMessage(options?: any): void {}

  nextId(): string {
    return queryId;
  }

  enableKeepAlive(opts: any): void {}

  sendIq(options?: any): Promise<any> {
    return new Promise((resolve: Function) => {
      resolve({
        mam: {
          rsm: {
            count: mamCount,
            first: FIRST_MESSAGE,
            last: LAST_MESSAGE,
            firstIndex: mamFirstIndex,
          },
        },
      });
    });
  }

  getRoster() {}
}

export const MOCKED_CLIENT: MockedClient = new MockedClient();
export const MOCKED_LOGIN_USER: any = '1';
export const MOCKED_LOGIN_PASSWORD: any = 'abc';
export const MOCKED_SERVER_MESSAGE: any = {
  thread: 'thread',
  body: 'body',
  requestReceipt: true,
  from: new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain),
  fromSelf: false,
  id: 'id',
};
export const MOCKED_SERVER_RECEIVED_RECEIPT: XmppBodyMessage = {
  body: '',
  thread: 'thread',
  receipt: 'receipt',
  to: new StanzaIO.JID(USER_ID, environment.xmppDomain),
  from: new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain),
  timestamp: { body: '2017-03-23T12:24:19.844620Z' },
  id: 'id',
  type: XMPP_MESSAGE_TYPE.CHAT,
};

export function getUserIdsFromJids(jids: string[]) {
  const ids = [];
  jids.map((jid) => ids.push(jid.split('@')[0]));
  return ids;
}

export function getJidsFromUserIds(ids: string[]) {
  const jids = [];
  ids.map((id) => jids.push(id + '@' + environment.xmppDomain));
  return jids;
}

export const JIDS = getJidsFromUserIds(['1', '2', '3']);

export const MOCK_NEW_NORMAL_XMPP_MESSAGE_WITHOUT_PAYLOAD: NormalXmppMessage = {
  to: new StanzaIO.JID(USER_ID, environment.xmppDomain),
  from: new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain),
  timestamp: { body: '2017-03-23T12:24:19.844620Z' },
  id: 'id',
  type: XMPP_MESSAGE_TYPE.NORMAL,
  lang: 'en',
};

export const MOCK_NEW_NORMAL_DELIVERY_XMPP_MESSAGE: NormalXmppMessage = {
  to: new StanzaIO.JID(USER_ID, environment.xmppDomain),
  from: new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain),
  timestamp: { body: '2017-03-23T12:24:19.844620Z' },
  id: 'id',
  type: XMPP_MESSAGE_TYPE.NORMAL,
  lang: 'en',
  payload: { type: 'delivery.to_buyer.delivery.on_hold_at_carrier' },
};
