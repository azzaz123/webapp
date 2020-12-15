import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from '@core/profile/profile';
import { ProfilesData } from '@core/profile/profile-response.interface';
import { ProfileService } from '@core/profile/profile.service';

@Component({
  selector: 'tsl-profiles-page',
  templateUrl: './profiles-page.component.html',
  styleUrls: ['./profiles-page.component.scss'],
})
export class ProfilesPageComponent implements OnInit {
  @Output() onFavoriteProfilePageChange: EventEmitter<
    Boolean
  > = new EventEmitter();
  public profiles: Profile[] = [];
  public loading = false;
  public end = false;
  public isProfileRemoved = true;

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    this.getProfiles();
  }

  public loadMore() {
    this.getProfiles(true);
  }

  public getProfiles(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.profiles = [];
    }
    this.profileService
      .myFavorites(this.profiles.length)
      .subscribe((profilesData: ProfilesData) => {
        const profiles = profilesData.data;
        this.profiles = this.profiles.concat(profiles);
        this.loading = false;
        this.end = !profilesData.init;
      });
  }

  public onFavoriteProfileChange(profile: Profile) {
    this.removeProfile(profile);
  }

  public removeProfile(profile: Profile) {
    if (this.profiles.length) {
      const index = this.profiles.indexOf(profile);
      this.profiles.splice(index, 1);
      this.onFavoriteProfilePageChange.emit(this.isProfileRemoved);
    }
  }
}
