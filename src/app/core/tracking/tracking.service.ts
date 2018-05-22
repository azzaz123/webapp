import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as CryptoJS from 'crypto-js';
import { TrackingEvent } from './tracking-event';
import { TrackingEventBase } from './tracking-event-base.interface';
import { UserService } from '../user/user.service';
import { environment } from '../../../environments/environment';
import { getTimestamp } from './getTimestamp.func';
import { CookieService } from 'ngx-cookie/index';
import { HttpService } from '../http/http.service';
import { NavigatorService } from './navigator.service';
import { WindowRef } from '../window/window.service';
import { Observable } from 'rxjs/Observable';

const CATEGORY_IDS: any = {
  ProConversations: '24',
  ProInventoryManagement: '25',
  ProLogin: '26',
  ProNotifications: '27',
  ProPhoneManagement: '28',
  ProStatistics: '29',
  Repport: '13',
  Button: '92',
  Open: '107',
  MyProfile: '48',
  Purchase: '53',
  Conversations: '7',
  Conversation: '76',
  Menu: '41',
  ItemDetail: '103',
  UploadForm: '114',
  Reactivate: '60',
  BottomBar: '78'
};

const SCREENS_IDS: any = {
  MyZone: '140',
  MyFavourites: '141',
  WorkInProgess: '142',
  ProChat: '89',
  Log: '131',
  ProLogin: '90',
  ProCatalog: '91',
  Wall: '110',
  MyCatalog: '138',
  ItemDetail: '115',
  UploadForm: '139',
  MyItemDetail: '114',
  MyProfile: '112',
  Conversation: '118',
  Messages: '117',
  ProPhoneManager: '94',
  MyZonePro: '158',
  Chat: '27'
};

const TYPES_IDS: any = {
  Tap: '6',
  Click: '16',
  Message: '14',
  ActionServer: '3',
  Success: '8',
  Display: '7',
  Error: '9',
  Button: '5',
  PushNotification: '15'
};

@Injectable()
export class TrackingService {

  public static CONVERSATION_LIST_ACTIVE_LOADED: TrackingEventBase = {
    name: '351',
    category: CATEGORY_IDS.ProConversations,
    screen: SCREENS_IDS.ProChat,
    type: TYPES_IDS.Tap
  };
  public static MESSAGES_READ: TrackingEventBase = {
    name: '441',
    category: CATEGORY_IDS.Conversations,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Message
  };
  public static MESSAGE_RECEIVED: TrackingEventBase = {
    name: '442',
    category: CATEGORY_IDS.Conversations,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Message
  };
  public static MESSAGE_SENT: TrackingEventBase = {
    name: '443',
    category: CATEGORY_IDS.Conversations,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Message
  };
  public static MESSAGE_RECEIVED_ACK: TrackingEventBase = {
    name: '436',
    category: CATEGORY_IDS.Conversations,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Message
  };
  public static NOTIFICATION_RECEIVED: TrackingEventBase = {
    name: '437',
    category: CATEGORY_IDS.Conversations,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.PushNotification
  };
  public static NOTIFICATION_READ: TrackingEventBase = {
    name: '438',
    category: CATEGORY_IDS.Conversations,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Click
  };
  public static MESSAGE_READ_ACK: TrackingEventBase = {
    name: '439',
    category: CATEGORY_IDS.Conversations,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Message
  };
  public static SEND_BUTTON: TrackingEventBase = {
    name: '76',
    category: CATEGORY_IDS.Conversations,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.ActionServer
  };
  public static MESSAGE_SENT_ACK: TrackingEventBase = {
    name: '440',
    category: CATEGORY_IDS.Conversations,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Message
  };
  public static MY_PROFILE_LOGGED_IN: TrackingEventBase = {
    name: '355',
    category: CATEGORY_IDS.ProLogin,
    screen: SCREENS_IDS.ProLogin,
    type: TYPES_IDS.Tap
  };
  public static MY_PROFILE_LOGGED_OUT: TrackingEventBase = {
    name: '356',
    category: CATEGORY_IDS.ProLogin,
    screen: SCREENS_IDS.ProLogin,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_DELETED: TrackingEventBase = {
    name: '357',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_LIST_ACTIVE_VIEWED: TrackingEventBase = {
    name: '358',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_LIST_BULK_DELETED: TrackingEventBase = {
    name: '359',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_LIST_BULK_RESERVED: TrackingEventBase = {
    name: '360',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_LIST_BULK_UNSELECTED: TrackingEventBase = {
    name: '371',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_LIST_LOADED: TrackingEventBase = {
    name: '373',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_LIST_SOLD_VIEWED: TrackingEventBase = {
    name: '375',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_REPPORTED: TrackingEventBase = {
    name: '379',
    category: CATEGORY_IDS.Repport,
    screen: SCREENS_IDS.ProChat,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_SELECTED: TrackingEventBase = {
    name: '381',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_SOLD: TrackingEventBase = {
    name: '382',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static CHAT_PRODUCT_SOLD: TrackingEventBase = {
    name: '664',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.Conversation,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_UNRESERVED: TrackingEventBase = {
    name: '383',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static CHAT_PRODUCT_RESERVED: TrackingEventBase = {
    name: '665',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.Conversation,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_UN_SELECTED: TrackingEventBase = {
    name: '384',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_VIEWED: TrackingEventBase = {
    name: '385',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static USER_PROFILE_REPPORTED: TrackingEventBase = {
    name: '386',
    category: CATEGORY_IDS.Repport,
    screen: SCREENS_IDS.ProChat,
    type: TYPES_IDS.Tap
  };
  public static APP_OPEN: TrackingEventBase = {
    name: '1',
    category: CATEGORY_IDS.Open,
    screen: SCREENS_IDS.Wall,
    type: TYPES_IDS.Success
  };
  public static CATALOG_VIEW_ITEMS: TrackingEventBase = {
    name: '563',
    category: CATEGORY_IDS.MyProfile,
    screen: SCREENS_IDS.MyCatalog,
    type: TYPES_IDS.Display
  };
  public static FEATURED_PURCHASE_SUCCESS: TrackingEventBase = {
    name: '567',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.Log,
    type: TYPES_IDS.Success
  };
  public static FEATURED_PURCHASE_ERROR: TrackingEventBase = {
    name: '568',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.Log,
    type: TYPES_IDS.Error
  };
  public static URGENT_PURCHASE_SUCCESS: TrackingEventBase = {
    name: '660',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.UploadForm,
    type: TYPES_IDS.Success
  };
  public static URGENT_PURCHASE_ERROR: TrackingEventBase = {
    name: '661',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.UploadForm,
    type: TYPES_IDS.Error
  };
  public static CONVERSATION_CREATE_NEW: TrackingEventBase = {
    name: '121',
    category: CATEGORY_IDS.Conversations,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.ActionServer
  };
  public static FEATURED_PURCHASE_FINAL: TrackingEventBase = {
    name: '566',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.Log,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_MENU_PROFILE: TrackingEventBase = {
    name: '582',
    category: CATEGORY_IDS.Menu,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_MENU_CHAT: TrackingEventBase = {
    name: '604',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_MENU_CATALOG: TrackingEventBase = {
    name: '584',
    category: CATEGORY_IDS.Menu,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_MENU_FAVOURITES: TrackingEventBase = {
    name: '585',
    category: CATEGORY_IDS.Menu,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_MENU_LOGOUT: TrackingEventBase = {
    name: '586',
    category: CATEGORY_IDS.Menu,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_LERDI_BEHAVIOR: TrackingEventBase = {
    name: '588',
    category: CATEGORY_IDS.Menu,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_MENU_REVIEWS: TrackingEventBase = {
    name: '609',
    category: CATEGORY_IDS.Menu,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static FAVOURITES_BUTTON_UNFAVORITE: TrackingEventBase = {
    name: '589',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyFavourites,
    type: TYPES_IDS.Tap
  };
  public static FAVOURITES_ITEMDETAIL_FROMFAVORITES: TrackingEventBase = {
    name: '590',
    category: CATEGORY_IDS.ItemDetail,
    screen: SCREENS_IDS.MyFavourites,
    type: TYPES_IDS.Tap
  };
  public static WORKINPROGRESS_BUTTON_CLOSE: TrackingEventBase = {
    name: '591',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.WorkInProgess,
    type: TYPES_IDS.Tap
  };
  public static WORKINPROGRESS_BUTTON_VIEWPROFILE: TrackingEventBase = {
    name: '592',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.WorkInProgess,
    type: TYPES_IDS.Tap
  };
  public static CATALOG_FEATURED_CHECKOUT: TrackingEventBase = {
    name: '565',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyCatalog,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_UPLOAD: TrackingEventBase = {
    name: '602',
    category: CATEGORY_IDS.UploadForm,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static UPLOADFORM_CHOOSEHEROCATEGORY: TrackingEventBase = {
    name: '595',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.UploadForm,
    type: TYPES_IDS.Tap
  };
  public static UPLOADFORM_UPLOADFROMFORM: TrackingEventBase = {
    name: '596',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.UploadForm,
    type: TYPES_IDS.Tap
  };
  public static UPLOADFORM_PREVIEW: TrackingEventBase = {
    name: '597',
    category: CATEGORY_IDS.UploadForm,
    screen: SCREENS_IDS.UploadForm,
    type: TYPES_IDS.Tap
  };
  public static UPLOADFORM_UPLOADFROMPREVIEW: TrackingEventBase = {
    name: '603',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.ItemDetail,
    type: TYPES_IDS.Tap
  };
  public static UPLOADFORM_SUCCESS: TrackingEventBase = {
    name: '598',
    category: CATEGORY_IDS.UploadForm,
    screen: SCREENS_IDS.UploadForm,
    type: TYPES_IDS.Success
  };
  public static UPLOADFORM_ERROR: TrackingEventBase = {
    name: '599',
    category: CATEGORY_IDS.UploadForm,
    screen: SCREENS_IDS.UploadForm,
    type: TYPES_IDS.Error
  };
  public static UPLOADFORM_FEATURED: TrackingEventBase = {
    name: '600',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.UploadForm,
    type: TYPES_IDS.Tap
  };
  public static UPLOADFORM_URGENT: TrackingEventBase = {
    name: '638',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.UploadForm,
    type: TYPES_IDS.Success
  };
  public static UPLOADFORM_CHECKBOX_URGENT: TrackingEventBase = {
    name: '639',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.UploadForm,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_EDITITEM: TrackingEventBase = {
    name: '612',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyCatalog,
    type: TYPES_IDS.Tap
  };
  public static CHAT_EDITITEM: TrackingEventBase = {
    name: '666',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.Conversation,
    type: TYPES_IDS.Tap
  };
  public static MYITEMDETAIL_EDITITEM_SUCCESS: TrackingEventBase = {
    name: '613',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyItemDetail,
    type: TYPES_IDS.Success
  };
  public static MYITEMDETAIL_EDITITEM_ERROR: TrackingEventBase = {
    name: '614',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyItemDetail,
    type: TYPES_IDS.Error
  };
  public static MYITEMDETAIL_CANCELEDIT: TrackingEventBase = {
    name: '615',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyItemDetail,
    type: TYPES_IDS.Tap
  };
  public static MYPROFILE_UNSUBSCRIBE: TrackingEventBase = {
    name: '608',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyProfile,
    type: TYPES_IDS.Tap
  };
  public static MYPROFILE_SAVEBUTTON: TrackingEventBase = {
    name: '611',
    category: CATEGORY_IDS.MyProfile,
    screen: SCREENS_IDS.MyProfile,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_CLOSETUTORIAL: TrackingEventBase = {
    name: '631',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_NEXTTUTORIAL: TrackingEventBase = {
    name: '632',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_UPLOADPRODUCT: TrackingEventBase = {
    name: '635',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyCatalog,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_REACTIVATE_FROMCATALOG: TrackingEventBase = {
    name: '633',
    category: CATEGORY_IDS.Reactivate,
    screen: SCREENS_IDS.MyCatalog,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_REACTIVATE_FROMMODAL: TrackingEventBase = {
    name: '634',
    category: CATEGORY_IDS.Reactivate,
    screen: SCREENS_IDS.MyCatalog,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_JUSTREACTIVATE: TrackingEventBase = {
    name: '635',
    category: CATEGORY_IDS.Reactivate,
    screen: SCREENS_IDS.MyCatalog,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_PURCHASE_CHECKOUTCART: TrackingEventBase = {
    name: '640',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.MyCatalog,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_PURCHASE_CONTINUE: TrackingEventBase = {
    name: '655',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.MyCatalog,
    type: TYPES_IDS.Tap
  };
  public static CONVERSATION_PROCESSED: TrackingEventBase = {
    name: '676',
    category: CATEGORY_IDS.Conversation,
    screen: SCREENS_IDS.Messages,
    type: TYPES_IDS.Tap
  };
  public static CONVERSATION_LIST_ALL_PROCESSED: TrackingEventBase = {
    name: '677',
    category: CATEGORY_IDS.Conversation,
    screen: SCREENS_IDS.Messages,
    type: TYPES_IDS.Tap
  };
  public static CONVERSATION_MARK_PENDING: TrackingEventBase = {
    name: '678',
    category: CATEGORY_IDS.Conversation,
    screen: SCREENS_IDS.Messages,
    type: TYPES_IDS.Tap
  };
  public static CONVERSATION_LIST_PROCESSED_LOADED: TrackingEventBase = {
    name: '679',
    category: CATEGORY_IDS.Conversation,
    screen: SCREENS_IDS.Conversation,
    type: TYPES_IDS.Tap
  };
  public static CALLS_MARK_PENDING: TrackingEventBase = {
    name: '393',
    category: CATEGORY_IDS.ProPhoneManagement,
    screen: SCREENS_IDS.ProPhoneManager,
    type: TYPES_IDS.Tap
  };
  public static PHONE_LEAD_OPENED: TrackingEventBase = {
    name: '396',
    category: CATEGORY_IDS.ProPhoneManagement,
    screen: SCREENS_IDS.ProPhoneManager,
    type: TYPES_IDS.Tap
  };
  public static PHONE_LEAD_LIST_PROCESSED_LOADED: TrackingEventBase = {
    name: '399',
    category: CATEGORY_IDS.ProPhoneManagement,
    screen: SCREENS_IDS.ProPhoneManager,
    type: TYPES_IDS.Tap
  };
  public static PHONE_LEAD_LIST_ACTIVE_LOADED: TrackingEventBase = {
    name: '690',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static PHONE_LEAD_VIEWED_CONVERSATION: TrackingEventBase = {
    name: '395',
    category: CATEGORY_IDS.ProPhoneManagement,
    screen: SCREENS_IDS.ProPhoneManager,
    type: TYPES_IDS.Tap
  };
  public static CONVERSATION_SELLING_CAR_VIEWED: TrackingEventBase = {
    name: '691',
    category: CATEGORY_IDS.BottomBar,
    screen: SCREENS_IDS.Conversation,
    type: TYPES_IDS.Tap
  };
  public static PRO_PURCHASE_CHECKOUTPROEXTRACART: TrackingEventBase = {
    name: '699',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static PHONE_LEAD_LIST_ALL_PROCESSED: TrackingEventBase = {
    name: '688',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_MENU_CALLS: TrackingEventBase = {
    name: '686',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static CALLS_PROCESSED: TrackingEventBase = {
    name: '689',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_MENU_DASHBOARD: TrackingEventBase = {
    name: '687',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static BUMP_PRO_APPLY: TrackingEventBase = {
    name: '710',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZonePro,
    type: TYPES_IDS.Tap
  };

  private TRACKING_KEY = 'AgHqp1anWv7g3JGMA78CnlL7NuB7CdpYrOwlrtQV';
  private sessionStartTime: string = null;
  private sessionId: string = null;
  private deviceAccessTokenId: string = null;
  private sessionIdCookieName = 'session_id';
  private deviceAccessTokenIdCookieName = 'device_access_token_id';

  constructor(private navigatorService: NavigatorService,
              private http: HttpService,
              private userService: UserService,
              private winRef: WindowRef,
              private cookieService: CookieService) {
    this.setSessionStartTime();
    this.setSessionId(this.sessionIdCookieName);
    this.setDeviceAccessTokenId(this.deviceAccessTokenIdCookieName);
  }

  track(event: TrackingEventBase, attributes?: any) {
    this.createNewEvent(event, attributes)
      .flatMap((newEvent: TrackingEvent) => {
        delete newEvent['sessions'][0]['window'];
        const stringifiedEvent: string = JSON.stringify(newEvent);
        const sha1Body: string = CryptoJS.SHA1(stringifiedEvent + this.TRACKING_KEY);
        return this.http.postNoBase(environment.clickStreamURL, stringifiedEvent, sha1Body);
      }).subscribe();
  }

  private setSessionStartTime() {
    this.sessionStartTime = getTimestamp();
  }

  private createNewEvent(event: TrackingEventBase, attributes?: any): Observable<TrackingEvent> {
    const newEvent: TrackingEvent = new TrackingEvent(
      this.winRef.nativeWindow,
      this.userService.user.id,
      this.sessionStartTime,
      event);
    newEvent.setDeviceInfo(
      this.navigatorService.operativeSystemVersion, this.navigatorService.OSName, this.deviceAccessTokenId,
      this.navigatorService.browserName, this.navigatorService.fullVersion
    );
    return this.userService.isProfessional()
      .map((isProfessional: boolean) => {
        if (isProfessional) {
          if (!attributes) {
            attributes = {};
          }
          attributes.professional = true;
        }
        if (attributes) {
          newEvent.setAttributes(attributes);
        }
        newEvent.setSessionId(this.sessionId);
        return newEvent;
      });
  }

  private setSessionId(cookieName: string) {
    const sessionCookie = this.cookieService.get(cookieName);
    if (sessionCookie) {
      this.sessionId = sessionCookie;
    } else {
      this.sessionId = UUID.UUID();
      this.setCookie(this.sessionId, 900000, cookieName);
    }
  }

  private setDeviceAccessTokenId(cookieName: string) {
    const deviceAccessTokenCookie = this.cookieService.get(cookieName);
    if (deviceAccessTokenCookie) {
      this.deviceAccessTokenId = deviceAccessTokenCookie;
    } else {
      this.deviceAccessTokenId = UUID.UUID();
      this.setCookie(this.deviceAccessTokenId, 31557000, cookieName);
    }
  }

  private setCookie(value: string, expiration: number, cookieName: string) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + expiration);
    const cookieOptions = {expires: expirationDate, domain: '.wallapop.com'};

    this.cookieService.put(cookieName, value, cookieOptions);
  }

}
