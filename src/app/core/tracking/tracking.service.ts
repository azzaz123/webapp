import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as CryptoJS from 'crypto-js';
import { TrackingEvent } from './tracking-event';
import { TrackingEventBase, TrackingEventData } from './tracking-event-base.interface';
import { UserService } from '../user/user.service';
import { environment } from '../../../environments/environment';
import { getTimestamp } from './getTimestamp.func';
import { CookieService } from 'ngx-cookie';
import { HttpService } from '../http/http.service';
import { NavigatorService } from './navigator.service';
import { WindowRef } from '../window/window.service';
import { PersistencyService } from '../persistency/persistency.service';
import { EventService } from '../event/event.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/bufferTime';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const maxBatchSize = 1000;
const sendInterval = 10000;

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
  Message: '81',
  Menu: '41',
  ItemDetail: '103',
  UploadForm: '114',
  Reactivate: '60',
  BottomBar: '78',
  Link: '122',
  Bump: '123',
  GDPR: '119',
  Credits: '131',
  Navbar: '77',
  Willis: '130',
  Mapfre: '137',
  Verti: '138',
  Solcredito: '139'
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
  Chat: '27',
  GDPR: '155',
  ReFishingGDPR: '159',
  Credits: '166',
  PostUpload: '153',
  SharePhone: '92'
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
  public static MESSAGE_READ: TrackingEventBase = {
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
  public static PRODUCT_LIST_FILTERED_BY_TEXT: TrackingEventBase = {
    name: '372',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_ORDERED_BY: TrackingEventBase = {
    name: '374',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_SOLD_VIEWED: TrackingEventBase = {
    name: '375',
    category: CATEGORY_IDS.ProInventoryManagement,
    screen: SCREENS_IDS.ProCatalog,
    type: TYPES_IDS.Tap
  };
  public static PRODUCT_LIST_BULK_SOLD: TrackingEventBase = {
    name: '370',
    category: CATEGORY_IDS['ProInventoryManagement']
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
  public static MYZONE_MENU_WALLACOINS: TrackingEventBase = {
    name: '766',
    category: CATEGORY_IDS.Credits,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_NAVBAR_WALLACOINS: TrackingEventBase = {
    name: '765',
    category: CATEGORY_IDS.Navbar,
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
  public static PRO_FEATURED_PURCHASE_SUCCESS: TrackingEventBase = {
    name: '700',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.MyZonePro,
    type: TYPES_IDS.Success
  };
  public static PRO_FEATURED_PURCHASE_ERROR: TrackingEventBase = {
    name: '701',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.MyZonePro,
    type: TYPES_IDS.Error
  };
  public static MYCATALOG_PRO_PURCHASE_EXTRAS: TrackingEventBase = {
    name: '703',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.MyZonePro,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_PRO_UPLOAD: TrackingEventBase = {
    name: '704',
    category: CATEGORY_IDS.UploadForm,
    screen: SCREENS_IDS.MyZonePro,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_PRO_MANAGE_SUBSCRIPTION: TrackingEventBase = {
    name: '705',
    category: CATEGORY_IDS.Link,
    screen: SCREENS_IDS.MyZonePro,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_PRO_FEATURE: TrackingEventBase = {
    name: '706',
    category: CATEGORY_IDS.Bump,
    screen: SCREENS_IDS.MyZonePro,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_PRO_DEACTIVATE: TrackingEventBase = {
    name: '707',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZonePro,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_PRO_MODAL_DEACTIVATE: TrackingEventBase = {
    name: '708',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZonePro,
    type: TYPES_IDS.Tap
  };
  public static MYCATALOG_PRO_EDIT_CARD: TrackingEventBase = {
    name: '709',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZonePro,
    type: TYPES_IDS.Tap
  };
  public static BUMP_PRO_APPLY: TrackingEventBase = {
    name: '710',
    category: CATEGORY_IDS.Button,
    screen: SCREENS_IDS.MyZonePro,
    type: TYPES_IDS.Tap
  };

  public static GDPR_UNDEFINED_DISPLAY_FIRST_MODAL: TrackingEventBase = {
    name: '681',
    category: CATEGORY_IDS.GDPR,
    screen: SCREENS_IDS.GDPR,
    type: TYPES_IDS.Display
  };
  public static GDPR_CLOSE_TAP_FIRST_MODAL: TrackingEventBase = {
    name: '682',
    category: CATEGORY_IDS.GDPR,
    screen: SCREENS_IDS.GDPR,
    type: TYPES_IDS.Tap
  };
  public static GDPR_ACCEPT_TAP_FIRST_MODAL: TrackingEventBase = {
    name: '683',
    category: CATEGORY_IDS.GDPR,
    screen: SCREENS_IDS.GDPR,
    type: TYPES_IDS.Tap
  };
  public static GDPR_UNDEFINED_DISPLAY_SECOND_MODAL: TrackingEventBase = {
    name: '711',
    category: CATEGORY_IDS.GDPR,
    screen: SCREENS_IDS.ReFishingGDPR,
    type: TYPES_IDS.Display
  };
  public static GDPR_CLOSE_TAP_SECOND_MODAL: TrackingEventBase = {
    name: '713',
    category: CATEGORY_IDS.GDPR,
    screen: SCREENS_IDS.ReFishingGDPR,
    type: TYPES_IDS.Tap
  };
  public static GDPR_ACCEPT_TAP_SECOND_MODAL: TrackingEventBase = {
    name: '712',
    category: CATEGORY_IDS.GDPR,
    screen: SCREENS_IDS.ReFishingGDPR,
    type: TYPES_IDS.Tap
  };
  public static WILLIS_LINK_DISPLAY = {
    name: '762',
    category: CATEGORY_IDS.Willis,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Display
  };
  public static WILLIS_LINK_TAP = {
    name: '763',
    category: CATEGORY_IDS.Willis,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Tap
  };
  public static PURCHASE_PACK_CREDITS = {
    name: '767',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.Credits,
    type: TYPES_IDS.Tap
  };
  public static PURCHASE_CONFIRM_PACK_CREDITS = {
    name: '768',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.Credits,
    type: TYPES_IDS.Tap
  };
  public static PURCHASE_CONFIRM_PACK_CREDITS_NO_CARD = {
    name: '769',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.Credits,
    type: TYPES_IDS.Tap
  };
  public static BUMP_FROM_MODAL_CREDITS_SUCCESS = {
    name: '770',
    category: CATEGORY_IDS.Bump,
    screen: SCREENS_IDS.Credits,
    type: TYPES_IDS.Success
  };
  public static BUY_MORE_CREDITS_SUCCESS = {
    name: '771',
    category: CATEGORY_IDS.Credits,
    screen: SCREENS_IDS.Credits,
    type: TYPES_IDS.Success
  };
  public static BUY_MORE_CREDITS_ERROR = {
    name: '772',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.Credits,
    type: TYPES_IDS.Error
  };

  public static CONVERSATION_FIRSTARCHIVE_OK = {
    name: '714',
    category: CATEGORY_IDS.Conversation,
    screen: SCREENS_IDS.Conversation,
    type: TYPES_IDS.Success
  };

  public static CONVERSATION_SINCEARCHIVE_OK = {
    name: '693',
    category: CATEGORY_IDS.Conversation,
    screen: SCREENS_IDS.Conversation,
    type: TYPES_IDS.Success
  };

  public static CHAT_SHAREPHONE_OPENSHARING = {
    name: '557',
    category: CATEGORY_IDS.Message,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Tap
  };

  public static CHAT_SHAREPHONE_CANCELSHARING = {
    name: '558',
    category: CATEGORY_IDS.Message,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Tap
  };

  public static CHAT_SHAREPHONE_ACCEPTSHARING = {
    name: '559',
    category: CATEGORY_IDS.Message,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Tap
  };

  public static ITEM_SHAREPHONE_WRONGPHONE = {
    name: '606',
    category: CATEGORY_IDS.ProConversations,
    screen: SCREENS_IDS.SharePhone,
    type: TYPES_IDS.Error
  };

  public static ITEM_SHAREPHONE_SENDPHONE = {
    name: '641',
    category: CATEGORY_IDS.ProConversations,
    screen: SCREENS_IDS.SharePhone,
    type: TYPES_IDS.Tap
  };

  public static ITEM_SHAREPHONE_SHOWFORM = {
    name: '642',
    category: CATEGORY_IDS.ProConversations,
    screen: SCREENS_IDS.SharePhone,
    type: TYPES_IDS.Display
  };

  public static ITEM_SHAREPHONE_HIDEFORM = {
    name: '362',
    category: CATEGORY_IDS.ProConversations,
    screen: SCREENS_IDS.SharePhone,
    type: TYPES_IDS.Tap
  };

  public static MAPFRE_LINK_TAP = {
    name: '809',
    category: CATEGORY_IDS.Mapfre,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Tap
  };
  public static MAPFRE_LINK_DISPLAY = {
    name: '811',
    category: CATEGORY_IDS.Mapfre,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Display
  };

  public static VERTI_LINK_TAP = {
    name: '810',
    category: CATEGORY_IDS.Verti,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Tap
  };

  public static VERTI_LINK_DISPLAY = {
    name: '812',
    category: CATEGORY_IDS.Verti,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Display
  };

  public static PURCHASE_LISTING_FEE_CATALOG = {
    name: '825',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.MyCatalog,
    type: TYPES_IDS.Tap
  };

  public static PURCHASE_LISTING_FEE_MODAL = {
    name: '826',
    category: CATEGORY_IDS.Purchase,
    screen: SCREENS_IDS.PostUpload,
    type: TYPES_IDS.Tap
  };

  public static SOLCREDITO_LINK_DISPLAY = {
    name: '835',
    category: CATEGORY_IDS.Solcredito,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Display
  };

  public static SOLCREDITO_LINK_TAP = {
    name: '836',
    category: CATEGORY_IDS.Solcredito,
    screen: SCREENS_IDS.Chat,
    type: TYPES_IDS.Tap
  };

  private TRACKING_KEY = 'AgHqp1anWv7g3JGMA78CnlL7NuB7CdpYrOwlrtQV';
  private sessionStartTime: string = null;
  private sessionId: string = null;
  private deviceAccessTokenId: string = null;
  private sessionIdCookieName = 'session_id';
  private deviceAccessTokenIdCookieName = 'device_access_token_id';
  private trackingEvents$: Subject<TrackingEventData> = new Subject();
  private sentEvents: Array<TrackingEventData> = [];
  private dbReady = false;

  constructor(private navigatorService: NavigatorService,
    private http: HttpService,
    private httpNew: HttpClient,
    private userService: UserService,
    private winRef: WindowRef,
    private eventService: EventService,
    private persistencyService: PersistencyService,
    private cookieService: CookieService) {
    this.setSessionStartTime();
    this.setSessionId(this.sessionIdCookieName);
    this.setDeviceAccessTokenId(this.deviceAccessTokenIdCookieName);
  }

  public track(event: TrackingEventBase, attributes?: any) {
    const newEvent = this.createNewEvent(event, attributes);
    delete newEvent.sessions[0].window;
    const stringifiedEvent: string = JSON.stringify(newEvent);
    const sha1Body: string = CryptoJS.SHA1(stringifiedEvent + this.TRACKING_KEY).toString();
    return this.httpNew.post(`${environment.clickStreamURL}`, stringifiedEvent, { headers: ({ 'Authorization': sha1Body }) }).subscribe();
  }

  public addTrackingEvent(event: TrackingEventData, acceptDuplicates: boolean = true) {
    this.track(event.eventData, event.attributes);
  }

  private setSessionStartTime() {
    this.sessionStartTime = getTimestamp();
  }

  private createNewEvent(event: TrackingEventBase, attributes?: any): TrackingEvent {
    const newEvent: TrackingEvent = new TrackingEvent(
      this.winRef.nativeWindow,
      this.userService.user.id,
      this.sessionStartTime,
      event);
    newEvent.setDeviceInfo(
      this.navigatorService.operativeSystemVersion, this.navigatorService.OSName, this.deviceAccessTokenId,
      this.navigatorService.browserName, this.navigatorService.fullVersion
    );
    if (this.userService.user.type === 'professional') {
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
