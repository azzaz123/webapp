import { Injectable } from '@angular/core';
import {
  HttpService,
  NavigatorService,
  ShieldConfig,
  TrackingService as TrackingServiceMaster,
  UserService,
  WindowRef,
  CategoryIds,
  TrackingEventBase
} from 'shield';
import { Router } from '@angular/router';

const CATEGORY_IDS: CategoryIds = {
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
  Conversations: '7'
};

@Injectable()
export class TrackingService extends TrackingServiceMaster {

  public static CONVERSATION_LIST_ACTIVE_LOADED: TrackingEventBase = {
    name: '351',
    category: CATEGORY_IDS['ProConversations']
  };
  public static CONVERSATION_READ: TrackingEventBase = {
    name: '441',
    category: CATEGORY_IDS['ProConversations']
  };
  public static MESSAGE_NOTIFIED: TrackingEventBase = {
    name: '353',
    category: CATEGORY_IDS['ProNotifications']
  };
  public static MESSAGE_SENT: TrackingEventBase = {
    name: '76',
    category: CATEGORY_IDS['ProConversations']
  };
  public static MY_PROFILE_LOGGED_IN: TrackingEventBase = {
    name: '355',
    category: CATEGORY_IDS['ProLogin']
  };
  public static MY_PROFILE_LOGGED_OUT: TrackingEventBase = {
    name: '356',
    category: CATEGORY_IDS['ProLogin']
  };
  public static PRODUCT_DELETED: TrackingEventBase = {
    name: '357',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_ACTIVE_VIEWED: TrackingEventBase = {
    name: '358',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_BULK_DELETED: TrackingEventBase = {
    name: '359',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_BULK_RESERVED: TrackingEventBase = {
    name: '360',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_BULK_UNSELECTED: TrackingEventBase = {
    name: '371',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_LOADED: TrackingEventBase = {
    name: '373',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_SOLD_VIEWED: TrackingEventBase = {
    name: '375',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_REPPORTED: TrackingEventBase = {
    name: '379',
    category: CATEGORY_IDS['Repport']
  };
  public static PRODUCT_SELECTED: TrackingEventBase = {
    name: '381',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_SOLD: TrackingEventBase = {
    name: '382',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_UNRESERVED: TrackingEventBase = {
    name: '383',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_UN_SELECTED: TrackingEventBase = {
    name: '384',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_VIEWED: TrackingEventBase = {
    name: '385',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static USER_PROFILE_REPPORTED: TrackingEventBase = {
    name: '386',
    category: CATEGORY_IDS['Repport']
  };
  public static APP_OPEN: TrackingEventBase = {
    name: '1',
    category: CATEGORY_IDS['Open']
  };
  public static CATALOG_VIEW_ITEMS: TrackingEventBase = {
    name: '563',
    category: CATEGORY_IDS['MyProfile']
  };
  public static FEATURED_PURCHASE_SUCCESS: TrackingEventBase = {
    name: '567',
    category: CATEGORY_IDS['Purchase']
  };
  public static FEATURED_PURCHASE_ERROR: TrackingEventBase = {
    name: '568',
    category: CATEGORY_IDS['Purchase']
  };
  public static CONVERSATION_CREATE_NEW: TrackingEventBase = {
    name: '435',
    category: CATEGORY_IDS['Conversations']
  };
  public static FEATURED_PURCHASE_FINAL: TrackingEventBase = {
    name: '566',
    category: CATEGORY_IDS['Button']
  };

  constructor(navigatorService: NavigatorService,
              http: HttpService,
              userService: UserService,
              winRef: WindowRef,
              router: Router,
              config: ShieldConfig) {
    super(navigatorService, http, userService, winRef, router, config);
  }

}
