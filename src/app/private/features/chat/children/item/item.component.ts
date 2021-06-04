import { Component, Inject, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { Item } from '@core/item/item';
import { ItemCounters } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { CookieService } from 'ngx-cookie';
import { takeWhile } from 'rxjs/operators';

export const showWillisCategories = [CATEGORY_IDS.GAMES_CONSOLES, CATEGORY_IDS.TV_AUDIO_CAMERAS, CATEGORY_IDS.APPLIANCES];

export const showVertiCategories = [CATEGORY_IDS.REAL_ESTATE_OLD, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.MOTORBIKE, CATEGORY_IDS.CAR];

export const showMapfreCategories = [
  CATEGORY_IDS.REAL_ESTATE_OLD,
  CATEGORY_IDS.REAL_ESTATE,
  CATEGORY_IDS.MOTORBIKE,
  CATEGORY_IDS.CAR,
  CATEGORY_IDS.BIKES,
];

export const mapfreLinks = {
  [CATEGORY_IDS.CAR]:
    'http://segurosdecoche.mapfre.es/wallapop?act=act_prosp_mapfre_es_wallapop_car_crossdevice_20180806_internal_wallapop&utm_source=wallapop&utm_medium=tpa&utm_campaign=act_prosp_mapfre_es_wallapop_car_crossdevice_20180806&utm_term=ficha_producto&utm_content=&utm_product=coche',
  [CATEGORY_IDS.MOTORBIKE]:
    'https://segurosdemoto.mapfre.es/wallapop?&act=act_prosp_mapfre_es_wallapop_moto_crossdevice_20180806_internal_wallapop&utm_source=wallapop&utm_medium=tpa&utm_campaign=act_prosp_mapfre_es_wallapop_moto_crossdevice_20180806&utm_term=ficha_producto&utm_content=&utm_product=moto',
  [CATEGORY_IDS.REAL_ESTATE]:
    'https://segurosdehogar.mapfre.es/wallapop?act=act_prosp_mapfre_es_wallapop_home_crossdevice_20180806_internal_wallapop&utm_source=wallapop&utm_medium=tpa&utm_campaign=act_prosp_mapfre_es_wallapop_home_crossdevice_20180806&utm_term=ficha_producto&utm_content=&utm_product=hogar',
  [CATEGORY_IDS.REAL_ESTATE_OLD]:
    'https://segurosdehogar.mapfre.es/wallapop?act=act_prosp_mapfre_es_wallapop_home_crossdevice_20180806_internal_wallapop&utm_source=wallapop&utm_medium=tpa&utm_campaign=act_prosp_mapfre_es_wallapop_home_crossdevice_20180806&utm_term=ficha_producto&utm_content=&utm_product=hogar',
  [CATEGORY_IDS.BIKES]:
    'http://segurosdebici.mapfre.es/wallapop?act=act_prosp_mapfre_es_wallapop_bike_crossdevice_20180806_internal_wallapop&utm_source=wallapop&utm_medium=tpa&utm_campaign=act_prosp_mapfre_es_wallapop_bike_crossdevice_20180806&utm_term=ficha_producto&utm_content=&utm_product=bici',
};

export const vertiLinks = {
  [CATEGORY_IDS.CAR]:
    'https://www.verti.es/ov/SNetPeticion?idPeticion=ISERV01&servicio=COTIZAVER&dps=1&producto=AU01&CANAL=AFFINITY&SUBCANAL=AF32&pid=722C0832A1&utm_source=Affinity&utm_medium=tpaff&utm_campaign=AF32',
  [CATEGORY_IDS.MOTORBIKE]:
    'https://www.verti.es/ov/SNetPeticion?idPeticion=ISERV01&servicio=COTIZAVER&dps=1&producto=AU02&CANAL=AFFINITY&SUBCANAL=AF32&pid=722C0832A2&utm_source=Affinity&utm_medium=tpaff&utm_campaign=AF32',
  [CATEGORY_IDS.REAL_ESTATE]:
    'https://www.verti.es/ov/SNetPeticion?idPeticion=ISERV01&servicio=COTIZAVER&producto=HG01&CANAL=AFFINITY&SUBCANAL=AF32&pid=722C0832H1&utm_source=Affinity&utm_medium=tpaff&utm_campaign=AF32',
  [CATEGORY_IDS.REAL_ESTATE_OLD]:
    'https://www.verti.es/ov/SNetPeticion?idPeticion=ISERV01&servicio=COTIZAVER&producto=HG01&CANAL=AFFINITY&SUBCANAL=AF32&pid=722C0832H1&utm_source=Affinity&utm_medium=tpaff&utm_campaign=AF32',
};

@Component({
  selector: 'tsl-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit, OnChanges, OnDestroy {
  @Input() item: Item;
  @Input() user: User;
  public itemUrl: string;
  public isCarItem = false;
  public showWillisLink = false;
  public showMapfreOrVertiLink = false;
  public showSolcreditoLink = false;
  private active = true;
  private allowReserve: boolean;
  private myUserId: string;
  private _headsOrTails: boolean; // true: mapfre, false: verti
  private showMapfre = false;
  private showVerti = false;

  constructor(
    private itemService: ItemService,
    private userService: UserService,
    private cookieService: CookieService,
    @Inject('SUBDOMAIN') private subdomain: string
  ) {}

  ngOnInit() {
    const user = this.userService.user;

    this.myUserId = user.id;
  }

  ngOnChanges(changes?: any) {
    if (this.item.salePrice !== undefined && (this.item.views === undefined || this.item.favorites === undefined)) {
      this.itemService
        .getCounters(this.item.id)
        .pipe(
          takeWhile(() => {
            return this.active;
          })
        )
        .subscribe((counters: ItemCounters) => {
          this.item.views = counters.views;
          this.item.favorites = counters.favorites;
        });
    }
    this.itemUrl = this.item.webSlug ? this.item.getUrl(this.subdomain) : '#';

    if (this.item && this.item.categoryId === 100) {
      this.isCarItem = true;
    } else {
      this.isCarItem = false;
    }

    this.showWillisLink = showWillisCategories.includes(this.item.categoryId);

    if (this._headsOrTails === undefined) {
      this._headsOrTails = this.headsOrTails();
    }

    this.showMapfre = showMapfreCategories.includes(this.item.categoryId);
    this.showVerti = showVertiCategories.includes(this.item.categoryId);
    this.showMapfreOrVertiLink = this.showMapfre || this.showVerti;

    const { salePrice, categoryId } = this.item;
    this.showSolcreditoLink =
      salePrice >= 50 &&
      salePrice < 500 &&
      ![CATEGORY_IDS.REAL_ESTATE_OLD, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.CAR].includes(categoryId);
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
    return this.item.owner === this.myUserId && !this.item.sold;
  }

  public isMine() {
    return this.item.owner === this.myUserId;
  }

  public toggleReserve() {
    this.itemService.reserveItem(this.item.id, !this.item.reserved).subscribe(() => {
      this.item.reserved = !this.item.reserved;
    });
  }

  public trackSoldEvent(item: Item) {
    fbq('track', 'CompleteRegistration', {
      value: item.salePrice,
      currency: item.currencyCode,
    });
  }

  public clickWillis(event) {
    event.stopPropagation();
  }

  public clickMapfreOrVerti(event) {
    event.stopPropagation();
  }

  public clickSolcredito(event) {
    event.stopPropagation();
  }

  public getCategoryKeyById(value) {
    return Object.keys(CATEGORY_IDS).find((key) => CATEGORY_IDS[key] === value);
  }

  public getMapfreOrVertiLink() {
    const categoryId = this.item.categoryId;
    const mapfreLink = mapfreLinks[categoryId];
    const vertiLink = vertiLinks[categoryId];
    if (this.showMapfre && this.showVerti) {
      return this._headsOrTails ? mapfreLink : vertiLink;
    }
    if (this.showMapfre) {
      return mapfreLink;
    }
    if (this.showVerti) {
      return vertiLink;
    }
  }

  private headsOrTails(): boolean {
    const fingerPrint = this.cookieService.get('device_access_token_id');
    if (fingerPrint) {
      return Boolean(fingerPrint.charCodeAt(fingerPrint.length - 1) % 2);
    }
    return Boolean(Math.round(Math.random()) ? true : false);
  }
}
