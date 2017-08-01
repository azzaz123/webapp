import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from 'shield';
import { UserService } from '../../core/user/user.service';
import { CategoryService } from "../../core/category/category.service";
import { GeolocationService } from "../../core/geolocation/geolocation.service";
import { EventService } from "../../core/event/event.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'tsl-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  providers: [GeolocationService, CategoryService]
})

export class TopbarComponent implements OnInit {

  public user: User;
  public coordinates: any;
  public category: any;
  @ViewChild('categoryEl') categoryEl: ElementRef;
  @ViewChild('latEl') latEl: ElementRef;
  @ViewChild('lngEl') lngEl: ElementRef;
  @ViewChild('kwsEl') kwsEl: ElementRef;

  constructor(public userService: UserService,
              private eventService: EventService) { }

  ngOnInit() {
    this.eventService.subscribe(EventService.UPDATE_COORDINATE, (coordinate: any) => this.updateCoordinate(coordinate));
    this.eventService.subscribe(EventService.UPDATE_CATEGORY, (category: any) => this.updateCategory(category));
    this.userService.me().subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.userService.logout();
  }

  public updateCoordinate(coordinate: any) {
    this.coordinates = coordinate;
  }

  public updateCategory(category: any) {
    this.category = category;
    this.submitForm();
  }

  public submitForm() {
    let categoryId = (this.category) ? this.category.categoryId : this.categoryEl.nativeElement.value;
    let verticalId = (categoryId == 100) ? categoryId : '';
    window.location.href = environment.siteUrl + 'search?catIds=' + categoryId + '&lat=' +  this.latEl.nativeElement.value
      + '&lng=' + this.lngEl.nativeElement.value + '&kws=' + this.kwsEl.nativeElement.value
      + '&verticalId=' + verticalId;
  }

}
