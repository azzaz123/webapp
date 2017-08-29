import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { User, WindowRef } from 'shield';
import { UserService } from '../../core/user/user.service';
import { CategoryService } from '../../core/category/category.service';
import { GeolocationService } from '../../core/geolocation/geolocation.service';
import { SuggesterService } from '../../core/suggester/suggester.service';
import { EventService } from '../../core/event/event.service';
import { environment } from '../../../environments/environment';
import { Coordinate } from '../../core/geolocation/address-response.interface';
import { CategoryResponse } from '../../core/category/category-response.interface';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'tsl-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  providers: [GeolocationService, CategoryService, SuggesterService]
})

export class TopbarComponent implements OnInit {

  public user: User;
  public coordinates: Coordinate;
  public category: CategoryResponse;
  public focus: boolean;
  public homeUrl: string;
  private MIN_LENGTH = 3;
  public model: any;
  @ViewChild('categoryEl') categoryEl: ElementRef;
  @ViewChild('latEl') latEl: ElementRef;
  @ViewChild('lngEl') lngEl: ElementRef;
  @ViewChild('kwsEl') kwsEl: ElementRef;

  constructor(public userService: UserService,
              private eventService: EventService,
              public suggesterService: SuggesterService,
              private windowRef: WindowRef,
              @Inject('SUBDOMAIN') private subdomain: string) {
    this.homeUrl = environment.siteUrl.replace('es', this.subdomain);
  }

  ngOnInit() {
    this.eventService.subscribe(EventService.UPDATE_COORDINATE, (coordinate: Coordinate) => this.updateCoordinate(coordinate));
    this.eventService.subscribe(EventService.UPDATE_CATEGORY, (category: CategoryResponse) => this.updateCategory(category));
    this.userService.me().subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.userService.logout();
  }

  public updateCoordinate(coordinate: Coordinate) {
    this.coordinates = coordinate;
  }

  public updateCategory(category: CategoryResponse) {
    this.category = category;
    this.submitForm();
  }

  public submitForm() {
    const categoryId = (this.category) ? this.category.categoryId : this.categoryEl.nativeElement.value;
    const verticalId = (categoryId === 100) ? categoryId : '';
    this.windowRef.nativeWindow.location.href = this.homeUrl + 'search?catIds=' + categoryId + '&lat=' +  this.latEl.nativeElement.value
      + '&lng=' + this.lngEl.nativeElement.value + '&kws=' + this.kwsEl.nativeElement.value
      + '&verticalId=' + verticalId;
  }

  public search = (text$: Observable<string>) =>
    text$
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => term.length < this.MIN_LENGTH ? [] :
        this.suggesterService.getSuggestions(term)
          .catch(() => {
            return Observable.of([]);
          }));

  public formatter = (x: any) => x.suggestion;

  public selectSuggestion(result: any) {
    console.log(result);
  }

}
