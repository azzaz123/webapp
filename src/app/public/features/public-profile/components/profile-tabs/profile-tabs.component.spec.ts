import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileTab, PROFILE_TABS } from './constants/profile-tab-constants';

import { ProfileTabsComponent } from './profile-tabs.component';

describe('ProfileTabsComponent', () => {
  let component: ProfileTabsComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<ProfileTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileTabsComponent],
      imports: [CommonModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTabsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();

    component.userStats = {
      buys: 0,
      publish: 5,
      reports_received: 0,
      reviews: 0,
      sells: 0,
      sold: 0,
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when component inits', () => {
    const tabCounterSelector = '.ProfileTabs__link__counter';

    it('should show correct stats on tabs', () => {
      component.ngOnInit();
      fixture.detectChanges();

      PROFILE_TABS.forEach((tab: ProfileTab) => {
        expect(
          parseInt(
            el.querySelector(`[href="/${tab.href}"] ${tabCounterSelector}`)
              .innerHTML
          )
        ).toEqual(component.userStats[tab.id]);
      });
    });

    it('should show all stats to 0 if they are not defined', () => {
      component.userStats = {};

      component.ngOnInit();
      fixture.detectChanges();

      PROFILE_TABS.forEach((tab: ProfileTab) => {
        expect(
          parseInt(
            el.querySelector(`[href="/${tab.href}"] ${tabCounterSelector}`)
              .innerHTML
          )
        ).toEqual(0);
      });
    });
  });
});
