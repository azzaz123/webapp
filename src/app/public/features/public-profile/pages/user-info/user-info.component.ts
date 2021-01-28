import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { User } from '@core/user/user';
import {
  UserExtrainfo,
  UserValidations,
} from '@core/user/user-response.interface';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { PublicProfileService } from '../../core/services/public-profile.service';
import { MAP_REDIRECTION } from '../../public-profile-routing-constants';
@Component({
  selector: 'tsl-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit, OnDestroy {
  @ViewChild('map') mapView: ElementRef;
  private subscriptions: Subscription[] = [];
  public coordinates: Coordinate;
  public user: User;
  public userValidations: UserValidations;

  constructor(
    private deviceService: DeviceDetectorService,
    private publicProfileService: PublicProfileService,
    private route: ActivatedRoute,
    private scrollIntoViewService: ScrollIntoViewService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => x.unsubscribe());
  }

  ngAfterViewInit(): void {
    if (this.user && this.deviceService.isMobile()) {
      this.subscriptions.push(
        this.route.fragment.subscribe((fragment) => {
          if (fragment?.includes(MAP_REDIRECTION)) {
            this.scrollIntoMap();
          }
        })
      );
    }
  }

  private getUser(): void {
    this.user = this.publicProfileService.user;

    this.publicProfileService
      .getExtraInfo(this.user.id)
      .subscribe((userExtraInfo: UserExtrainfo) => {
        this.userValidations = userExtraInfo.validations;
      });

    if (this.userHaveLocation()) {
      this.coordinates = {
        latitude: this.user.location.approximated_latitude,
        longitude: this.user.location.approximated_longitude,
      };
    }
  }

  private userHaveLocation(): boolean {
    return !!(
      this.user?.location?.approximated_latitude &&
      this.user?.location?.approximated_longitude
    );
  }

  private scrollIntoMap(): void {
    this.scrollIntoViewService.scrollToElement(this.mapView.nativeElement);
  }
}
