import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from '@core/profile/profile';
import { ProfilesData } from '@core/profile/profile-response.interface';
import { ProfileService } from '@core/profile/profile.service';
import { MOCK_PROFILE } from '@fixtures/profile.fixtures.spec';

@Component({
  selector: 'tsl-profiles-page',
  templateUrl: './profiles-page.component.html',
  styleUrls: ['./profiles-page.component.scss'],
})
export class ProfilesPageComponent implements OnInit {
  public profiles: Profile[] = [MOCK_PROFILE, MOCK_PROFILE];
  public loading = false;
  public end = false;

  constructor(private profileService: ProfileService, private router: Router) {
    //this.profiles = this.router.getCurrentNavigation().extras.state.data;
  }

  ngOnInit(): void {}

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
    }
  }
}
