import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { User, WindowRef } from 'shield';
import { UserService } from '../../core/user/user.service';
import { environment } from '../../../environments/environment';
import { Coordinate } from '../../core/geolocation/address-response.interface';
import { CategoryResponse } from '../../core/category/category-response.interface';
import { SuggesterResponse } from '../../core/suggester/suggester-response.interface';

@Component({
  selector: 'tsl-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})

export class TopbarComponent implements OnInit {

  public user: User;
  public coordinates: Coordinate;
  public category: number;
  public kws: string;
  public focus: boolean;
  public homeUrl: string;
  public model: any;
  public userUrl: string;
  @Input() isMyZone: boolean;
  @ViewChild('categoryEl') categoryEl: ElementRef;
  @ViewChild('kwsEl') kwsEl: ElementRef;

  constructor(public userService: UserService,
              private windowRef: WindowRef,
              @Inject('SUBDOMAIN') private subdomain: string) {
    this.homeUrl = environment.siteUrl.replace('es', this.subdomain);
  }

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.user = user;
      if (user) {
        this.userUrl = user.webLink.replace('http://es.wallapop.com/', this.homeUrl);
      }
    });
  }

  public submitForm() {
    const categoryId = (this.category) ? this.category : this.categoryEl.nativeElement.value;
    const kws = (this.kws) ? this.kws : '';
    const verticalId = (categoryId === 100) ? categoryId : '';
    this.windowRef.nativeWindow.location.href = this.homeUrl + 'search?catIds=' + categoryId + '&kws=' + kws
      + '&verticalId=' + verticalId;
  }

  public onSearchSubmit(newSearchSubmit: string) {
    this.kws = newSearchSubmit;
    this.submitForm();
  }

  public onSearchUpdate(newSearch: SuggesterResponse) {
    this.kws = newSearch.suggestion;
    this.category = newSearch.category_id;
    this.submitForm();
  }

  public onCoordinateUpdate(newCoordinate: Coordinate) {
    this.coordinates = newCoordinate;
  }

  public onCategoryUpdate(newCategory: CategoryResponse) {
    this.category = newCategory.categoryId;
    this.submitForm();
  }

  public onKeywordUpdate(newKeyword: string) {
    this.kws = newKeyword;
  }

}
