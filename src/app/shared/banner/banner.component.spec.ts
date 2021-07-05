import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BannerComponent, NgbAlert],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we do not define the banner specifications...', () => {
    beforeEach(() => {
      component.specifications = null;

      fixture.detectChanges();
    });

    it('should not show the banner', () => {
      const banner = fixture.debugElement.query(By.directive(NgbAlert));

      expect(banner).toBeFalsy();
    });
  });

  describe('when we define the banner specifications...', () => {
    beforeEach(() => {
      component.specifications = {
        dismissible: false,
        type: 'success',
      };

      fixture.detectChanges();
    });

    it('should show the banner', () => {
      const banner = fixture.debugElement.query(By.directive(NgbAlert));

      expect(banner).toBeTruthy();
    });

    it('should apply the specified class', () => {
      const styledBanner = fixture.debugElement.query(By.css(`.alert-${component.specifications.type}`));

      expect(styledBanner).toBeTruthy();
    });

    describe('and the banner is dismissible', () => {
      beforeEach(() => {
        spyOn(component.closeClick, 'emit');
        component.specifications.dismissible = true;

        fixture.detectChanges();
        const banner = fixture.debugElement.query(By.directive(NgbAlert));
        banner.triggerEventHandler('closed', {});
      });

      describe('and we click on the close button', () => {
        it('should emit the close event', () => {
          expect(component.closeClick.emit).toHaveBeenCalled();
        });
      });
    });
  });
});
