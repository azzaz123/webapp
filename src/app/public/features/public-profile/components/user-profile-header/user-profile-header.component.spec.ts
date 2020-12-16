import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  MOCK_FULL_USER_FEATURED,
  MOCK_USER_STATS,
} from '@fixtures/user.fixtures.spec';

import { UserProfileHeaderComponent } from './user-profile-header.component';

describe('UserProfileHeaderComponent', () => {
  let component: UserProfileHeaderComponent;
  let fixture: ComponentFixture<UserProfileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileHeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileHeaderComponent);
    component = fixture.componentInstance;
    component.userInfo = MOCK_FULL_USER_FEATURED;
    component.userStats = MOCK_USER_STATS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have the user info and the stats', () => {
    it('should load the content', () => {
      const containerPage = fixture.debugElement.query(
        By.css('.ProfileUser__container')
      );

      expect(containerPage).toBeTruthy();
    });

    describe('when the user is pro...', () => {
      describe('when have the extra info..', () => {
        it('should show the pro elements', () => {
          const headerPro = fixture.debugElement.query(By.css('.HeaderPro'))
            .nativeNode;
          const proBadge = fixture.debugElement.query(By.css('.ProBadge'))
            .nativeNode;
          const aboutSection = fixture.debugElement
            .queryAll(By.css('strong'))
            .find((anchors) => anchors.nativeElement.innerHTML === 'About')
            .nativeElement;

          expect(headerPro.hasAttribute('hidden')).toBe(false);
          expect(proBadge.hasAttribute('hidden')).toBe(false);
          expect(aboutSection).toBeTruthy();
        });
      });

      describe('when NOT have the extra info...', () => {
        it('should show the pro elements but not the about one', () => {
          component.userInfo.extraInfo.description = null;

          fixture.detectChanges();
          const headerPro = fixture.debugElement.query(By.css('.HeaderPro'))
            .nativeNode;
          const proBadge = fixture.debugElement.query(By.css('.ProBadge'))
            .nativeNode;
          const aboutSection = fixture.debugElement.queryAll(By.css('strong'));

          expect(headerPro.hasAttribute('hidden')).toBe(false);
          expect(proBadge.hasAttribute('hidden')).toBe(false);
          expect(aboutSection.length).toBe(1);
        });
      });
    });

    describe('when the user is NOT pro...', () => {
      it('should NOT show the pro elements', () => {
        component.userInfo.isPro = false;

        fixture.detectChanges();
        const headerPro = fixture.debugElement.query(By.css('.HeaderPro'))
          .nativeNode;
        const proBadge = fixture.debugElement.query(By.css('.ProBadge'))
          .nativeNode;
        const aboutSection = fixture.debugElement.queryAll(By.css('strong'));

        expect(headerPro.hasAttribute('hidden')).toBe(true);
        expect(proBadge.hasAttribute('hidden')).toBe(true);
        expect(aboutSection.length).toBe(1);
      });
    });
  });

  describe('when we NOT have the user info and the stats', () => {
    it('should NOT load the content', () => {
      component.userInfo = null;

      fixture.detectChanges();
      const containerPage = fixture.debugElement.query(
        By.css('.ProfileUser__container')
      );

      expect(containerPage).toBeFalsy();
    });
  });
});
