import { Injectable } from '@angular/core';
import { HttpService, NavigatorService, TrackingService as TrackingServiceMaster, WindowRef } from 'shield';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import * as CryptoJS from 'crypto-js';
import { TrackingEvent } from './tracking-event';
import { TrackingEventBase } from './tracking-event-base.interface';
import { UserService } from '../user/user.service';
import { environment } from '../../../environments/environment';

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
  Menu: '41',
  ItemDetail: '103'
};

const SCREENS_IDS: any = {
  MyZone: '140',
  MyFavourites: '141',
  WorkInProgess: '142'
};

const TYPES_IDS: any = {
  Tap: '6'
};

@Injectable()
export class TrackingService extends TrackingServiceMaster {

  public static CONVERSATION_LIST_ACTIVE_LOADED: TrackingEventBase = {
    name: '351',
    category: CATEGORY_IDS.ProConversations
  };
  public static CONVERSATION_READ: TrackingEventBase = {
    name: '441',
    category: CATEGORY_IDS.ProConversations
  };
  public static MESSAGE_NOTIFIED: TrackingEventBase = {
    name: '353',
    category: CATEGORY_IDS.ProNotifications
  };
  public static MESSAGE_SENT: TrackingEventBase = {
    name: '76',
    category: CATEGORY_IDS.ProConversations
  };
  public static MY_PROFILE_LOGGED_IN: TrackingEventBase = {
    name: '355',
    category: CATEGORY_IDS.ProLogin
  };
  public static MY_PROFILE_LOGGED_OUT: TrackingEventBase = {
    name: '356',
    category: CATEGORY_IDS.ProLogin
  };
  public static PRODUCT_DELETED: TrackingEventBase = {
    name: '357',
    category: CATEGORY_IDS.ProInventoryManagement
  };
  public static PRODUCT_LIST_ACTIVE_VIEWED: TrackingEventBase = {
    name: '358',
    category: CATEGORY_IDS.ProInventoryManagement
  };
  public static PRODUCT_LIST_BULK_DELETED: TrackingEventBase = {
    name: '359',
    category: CATEGORY_IDS.ProInventoryManagement
  };
  public static PRODUCT_LIST_BULK_RESERVED: TrackingEventBase = {
    name: '360',
    category: CATEGORY_IDS.ProInventoryManagement
  };
  public static PRODUCT_LIST_BULK_UNSELECTED: TrackingEventBase = {
    name: '371',
    category: CATEGORY_IDS.ProInventoryManagement
  };
  public static PRODUCT_LIST_LOADED: TrackingEventBase = {
    name: '373',
    category: CATEGORY_IDS.ProInventoryManagement
  };
  public static PRODUCT_LIST_SOLD_VIEWED: TrackingEventBase = {
    name: '375',
    category: CATEGORY_IDS.ProInventoryManagement
  };
  public static PRODUCT_REPPORTED: TrackingEventBase = {
    name: '379',
    category: CATEGORY_IDS.Repport
  };
  public static PRODUCT_SELECTED: TrackingEventBase = {
    name: '381',
    category: CATEGORY_IDS.ProInventoryManagement
  };
  public static PRODUCT_SOLD: TrackingEventBase = {
    name: '382',
    category: CATEGORY_IDS.ProInventoryManagement
  };
  public static PRODUCT_UNRESERVED: TrackingEventBase = {
    name: '383',
    category: CATEGORY_IDS.ProInventoryManagement
  };
  public static PRODUCT_UN_SELECTED: TrackingEventBase = {
    name: '384',
    category: CATEGORY_IDS.ProInventoryManagement
  };
  public static PRODUCT_VIEWED: TrackingEventBase = {
    name: '385',
    category: CATEGORY_IDS.ProInventoryManagement
  };
  public static USER_PROFILE_REPPORTED: TrackingEventBase = {
    name: '386',
    category: CATEGORY_IDS.Repport
  };
  public static APP_OPEN: TrackingEventBase = {
    name: '1',
    category: CATEGORY_IDS.Open
  };
  public static CATALOG_VIEW_ITEMS: TrackingEventBase = {
    name: '563',
    category: CATEGORY_IDS.MyProfile
  };
  public static FEATURED_PURCHASE_SUCCESS: TrackingEventBase = {
    name: '567',
    category: CATEGORY_IDS.Purchase
  };
  public static FEATURED_PURCHASE_ERROR: TrackingEventBase = {
    name: '568',
    category: CATEGORY_IDS.Purchase
  };
  public static CONVERSATION_CREATE_NEW: TrackingEventBase = {
    name: '435',
    category: CATEGORY_IDS.Conversations
  };
  public static FEATURED_PURCHASE_FINAL: TrackingEventBase = {
    name: '566',
    category: CATEGORY_IDS.Button
  };
  public static MYZONE_MENU_PROFILE: TrackingEventBase = {
    name: '582',
    category: CATEGORY_IDS.Menu,
    screen: SCREENS_IDS.MyZone,
    type: TYPES_IDS.Tap
  };
  public static MYZONE_MENU_UPLOAD: TrackingEventBase = {
    name: '583',
    category: CATEGORY_IDS.Menu,
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

  public static TRACKING_SESSION_UUID: string = UUID.UUID();
  private TRACKING_KEY = 'AgHqp1anWv7g3JGMA78CnlL7NuB7CdpYrOwlrtQV';
  private sessionStartTime: string = null;

  constructor(private navigatorService: NavigatorService,
              private http: HttpService,
              private userService: UserService,
              private winRef: WindowRef,
              private router: Router) {
    super();
    this.setSessionStartTime();
  }

  track(event: TrackingEventBase, attributes?: any) {
    const newEvent: TrackingEvent = this.createNewEvent(event, attributes);
    delete newEvent['sessions'][0]['window'];
    const stringifiedEvent: string = JSON.stringify(newEvent);
    const sha1Body: string = CryptoJS.SHA1(stringifiedEvent + this.TRACKING_KEY);
    this.http.postNoBase(environment.clickStreamURL, stringifiedEvent, sha1Body).subscribe();
  }

  private setSessionStartTime() {
    const now = new Date();
    this.sessionStartTime =
      `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.toLocaleTimeString()}.${now.getMilliseconds()}`;
  }


  private createNewEvent(event: TrackingEventBase, attributes?: any) {
    const newEvent: TrackingEvent = new TrackingEvent(this.winRef.nativeWindow,
      this.router.url,
      this.userService.user.id,
      this.sessionStartTime,
      event);
    newEvent.setDeviceInfo( this.navigatorService.operativeSystemVersion, this.navigatorService.OSName);
    if (attributes) {
      newEvent.setAttributes(attributes);
    }
    return newEvent;
  }

}
