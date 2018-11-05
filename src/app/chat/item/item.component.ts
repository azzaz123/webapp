import { Component, Inject, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Item } from '../../core/item/item';
import { ItemService } from '../../core/item/item.service';
import { ItemCounters } from '../../core/item/item-response.interface';
import { TrackingService } from '../../core/tracking/tracking.service';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user';
import { CATEGORY_IDS } from '../../core/category/category-ids';

export const showWillisCategories = [ CATEGORY_IDS.GAMES_CONSOLES, CATEGORY_IDS.TV_AUDIO_CAMERAS, CATEGORY_IDS.APPLIANCES];

export const showKlincCategories = [ CATEGORY_IDS.COMPUTERS_ELECTRONICS, CATEGORY_IDS.CELL_PHONES_ACCESSORIES];

export const vertiCategories = [CATEGORY_IDS.REAL_ESTATE_OLD, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.MOTORBIKE, CATEGORY_IDS.CAR];

export const mapfreCategories = [CATEGORY_IDS.REAL_ESTATE_OLD, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.MOTORBIKE, CATEGORY_IDS.CAR, CATEGORY_IDS.BIKES];

const mapfreLinks = {
  [CATEGORY_IDS.CAR]: 'http://segurosdecoche.mapfre.es/wallapop?act=act_prosp_mapfre_es_wallapop_car_crossdevice_20180806_internal_wallapop&utm_source=wallapop&utm_medium=tpa&utm_campaign=act_prosp_mapfre_es_wallapop_car_crossdevice_20180806&utm_term=ficha_producto&utm_content=&utm_product=coche',
  [CATEGORY_IDS.MOTORBIKE]: 'https://segurosdemoto.mapfre.es/wallapop?&act=act_prosp_mapfre_es_wallapop_moto_crossdevice_20180806_internal_wallapop&utm_source=wallapop&utm_medium=tpa&utm_campaign=act_prosp_mapfre_es_wallapop_moto_crossdevice_20180806&utm_term=ficha_producto&utm_content=&utm_product=moto',
  [CATEGORY_IDS.REAL_ESTATE]: 'https://segurosdehogar.mapfre.es/wallapop?act=act_prosp_mapfre_es_wallapop_home_crossdevice_20180806_internal_wallapop&utm_source=wallapop&utm_medium=tpa&utm_campaign=act_prosp_mapfre_es_wallapop_home_crossdevice_20180806&utm_term=ficha_producto&utm_content=&utm_product=hogar',
  [CATEGORY_IDS.REAL_ESTATE_OLD]: 'https://segurosdehogar.mapfre.es/wallapop?act=act_prosp_mapfre_es_wallapop_home_crossdevice_20180806_internal_wallapop&utm_source=wallapop&utm_medium=tpa&utm_campaign=act_prosp_mapfre_es_wallapop_home_crossdevice_20180806&utm_term=ficha_producto&utm_content=&utm_product=hogar',
  [CATEGORY_IDS.BIKES]: 'http://segurosdebici.mapfre.es/wallapop?act=act_prosp_mapfre_es_wallapop_bike_crossdevice_20180806_internal_wallapop&utm_source=wallapop&utm_medium=tpa&utm_campaign=act_prosp_mapfre_es_wallapop_bike_crossdevice_20180806&utm_term=ficha_producto&utm_content=&utm_product=bici'
};

const vertiLinks = {
  [CATEGORY_IDS.CAR] : 'https://www.verti.es/ov/SNetPeticion?idPeticion=ISERV01&servicio=COTIZAVER&dps=1&producto=AU01&CANAL=AFFINITY&SUBCANAL=AF32&pid=722C0832A1&utm_source=Affinity&utm_medium=tpaff&utm_campaign=AF32',
  [CATEGORY_IDS.MOTORBIKE] : 'https://www.verti.es/ov/SNetPeticion?idPeticion=ISERV01&servicio=COTIZAVER&dps=1&producto=AU02&CANAL=AFFINITY&SUBCANAL=AF32&pid=722C0832A2&utm_source=Affinity&utm_medium=tpaff&utm_campaign=AF32',
  [CATEGORY_IDS.REAL_ESTATE] : 'https://www.verti.es/ov/SNetPeticion?idPeticion=ISERV01&servicio=COTIZAVER&producto=HG01&CANAL=AFFINITY&SUBCANAL=AF32&pid=722C0832H1&utm_source=Affinity&utm_medium=tpaff&utm_campaign=AF32',
  [CATEGORY_IDS.REAL_ESTATE_OLD]: 'https://www.verti.es/ov/SNetPeticion?idPeticion=ISERV01&servicio=COTIZAVER&producto=HG01&CANAL=AFFINITY&SUBCANAL=AF32&pid=722C0832H1&utm_source=Affinity&utm_medium=tpaff&utm_campaign=AF32',
};


@Component({
  selector: 'tsl-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnChanges, OnDestroy {

  @Input() item: Item;
  @Input() user: User;
  public itemUrl: string;
  public isCarItem = false;
  public showKlincLink = false;
  public showWillisLink = false;
  private active = true;
  private allowReserve: boolean;
  private myUserId: string;

  constructor(private itemService: ItemService,
              private userService: UserService,
              private trackingService: TrackingService,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnInit() {
    this.userService.me().subscribe(
      (user: User) => {
        this.myUserId = user.id;
      });
  }

  ngOnChanges(changes?: any) {
    if (this.item.salePrice !== undefined && (this.item.views === undefined || this.item.favorites === undefined)) {
      this.itemService.getCounters(this.item.id).takeWhile(() => {
        return this.active;
      }).subscribe((counters: ItemCounters) => {
        this.item.views = counters.views;
        this.item.favorites = counters.favorites;
      });
    }
    this.itemUrl = this.item.webSlug ? this.item.getUrl(this.subdomain) : '#';

    if (this.item && this.item.categoryId === 100) {
      this.isCarItem = true;
      this.trackingService.track(TrackingService.CARFAX_CHAT_DISPLAY, {
        category_id: this.item.categoryId,
        item_id: this.item.id
      });
    } else {
      this.isCarItem = false;
    }

    this.showWillisLink = showWillisCategories.includes(this.item.categoryId);
    if (this.showWillisLink) {
      this.trackingService.track(TrackingService.WILLIS_LINK_DISPLAY, {
        category_id: this.item.categoryId,
        item_id: this.item.id
      });
    }

    this.showKlincLink = showKlincCategories.includes(this.item.categoryId);
    if (this.showKlincLink) {
      this.trackingService.track(TrackingService.KLINC_LINK_DISPLAY, {
        category_id: this.item.categoryId,
        item_id: this.item.id
      });
    }
  }

  ngOnDestroy() {
    this.active = false;
  }

  public prevent($event: Event, stop?: boolean) {
    if (this.itemUrl === '#' || stop) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  public canEdit() {
    return ((this.item.owner === this.myUserId) && !this.item.sold);
  }

  public isMine() {
    return (this.item.owner === this.myUserId);
  }

  public toggleReserve() {
    this.itemService.reserveItem(this.item.id, !this.item.reserved).subscribe(() => {
      this.item.reserved = !this.item.reserved;
      if (this.item.reserved) {
        this.trackingService.track(TrackingService.CHAT_PRODUCT_RESERVED, {item_id: this.item.id});
      }
    });
  }

  public trackSoldEvent(item: Item) {
    this.trackingService.track(TrackingService.CHAT_PRODUCT_SOLD, {item_id: item.id});
    appboy.logCustomEvent('Sold', {platform: 'web'});
  }

  public clickCarfax(event) {
    event.stopPropagation();
    this.trackingService.track(TrackingService.CARFAX_CHAT_TAP, {
      category_id: this.item.categoryId,
      item_id: this.item.id
    });
  }

  public clickWillis(event) {
    event.stopPropagation();
    this.trackingService.track(TrackingService.WILLIS_LINK_TAP, {
      category_id: this.item.categoryId,
      item_id: this.item.id
    });
  }

  public clickKlinc(event) {
    event.stopPropagation();
    this.trackingService.track(TrackingService.KLINC_LINK_TAP, {
      category_id: this.item.categoryId,
      item_id: this.item.id
    });
  }
}
