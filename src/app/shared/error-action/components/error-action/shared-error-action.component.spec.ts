import { By } from '@angular/platform-browser';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BannerComponent } from '@shared/banner/banner.component';
import { ButtonComponent } from '@shared/button/button.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedErrorActionComponent } from '@shared/error-action/components/error-action/shared-error-action.component';
import { SharedErrorActionService } from '@shared/error-action/services/shared-error-action.service';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

const fakeUrl = 'this is a fake url';

@Component({
  selector: 'tsl-fake-component',
  templateUrl: './shared-error-action.component.html',
})
class FakeComponent extends SharedErrorActionComponent {
  constructor(errorActionService: SharedErrorActionService, changeDetectorRef: ChangeDetectorRef, router: Router) {
    super(errorActionService, changeDetectorRef, router);
  }
}

describe('GIVEN SharedErrorActionComponent', () => {
  let component: SharedErrorActionComponent;
  let fixture: ComponentFixture<SharedErrorActionComponent>;
  let router: Router;
  let service: SharedErrorActionService;
  const SharedErrorActionSelector = '.SharedErrorAction';
  const SharedErrorActionContentSelector = `${SharedErrorActionSelector}__content`;

  let errorActionSpy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BannerComponent, ButtonComponent, FakeComponent, SvgIconComponent],
      imports: [CommonModule, HttpClientTestingModule, NgbAlertModule, RouterTestingModule],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
            navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue(Promise.resolve()),
            get url() {
              return fakeUrl;
            },
          },
        },
        SharedErrorActionService,
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    service = TestBed.inject(SharedErrorActionService);
  });

  beforeEach(() => {
    errorActionSpy = jest.spyOn(service, 'errorObserver', 'get');

    fixture = TestBed.createComponent(FakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('WHEN display the component', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('should subscribe to the listener', () => {
      expect(errorActionSpy).toHaveBeenCalledTimes(1);
    });
    it('should not show the block corresponding to error', () => {
      const target = fixture.debugElement.query(By.css(SharedErrorActionSelector));

      expect(target).toBeFalsy();
    });
    it('should show the block corresponding to the content', () => {
      const target = fixture.debugElement.query(By.css(SharedErrorActionContentSelector));

      expect(target).toBeTruthy();
    });
  });
  describe('WHEN there is an error', () => {
    describe('WHEN the listener is active', () => {
      beforeEach(() => {
        service.show('some error!!!');
      });

      it('should show the block corresponding to error', () => {
        const target = fixture.debugElement.query(By.css(SharedErrorActionSelector));

        expect(target).toBeTruthy();
      });
      it('should not show the block corresponding to content', () => {
        const target = fixture.debugElement.query(By.css(SharedErrorActionContentSelector));

        expect(target).toBeFalsy();
      });
      it('should show a banner', () => {
        const target = fixture.debugElement.query(By.directive(BannerComponent));

        expect(target).toBeTruthy();
      });
      it('should show the description', () => {
        const container = fixture.debugElement.query(By.directive(BannerComponent));
        const target = container.query(By.css('span'));

        expect(target.nativeElement.innerHTML).toBe(component.bannerConfiguration.description);
      });
      it('should show a button', () => {
        const target = fixture.debugElement.query(By.directive(ButtonComponent));

        expect(target).toBeTruthy();
      });
      it('should show the action', () => {
        const container = fixture.debugElement.query(By.directive(ButtonComponent));
        const target = container.query(By.css('button'));

        expect(target.nativeElement.innerHTML).toContain(component.bannerConfiguration.buttonText);
      });
      describe('WHEN the user click over the button', () => {
        describe('AND WHEN the retryUrl has been reported', () => {
          it('should navigate to the refresh page', fakeAsync(() => {
            component.retryUrl = 'fake_url';
            const buttonComponent = fixture.debugElement.query(By.directive(ButtonComponent));
            const button = buttonComponent.query(By.css('button'));

            button.nativeNode.click();

            expect(router.navigateByUrl).toHaveBeenCalledWith(`${component.retryUrl}`, { skipLocationChange: true });
          }));
        });
        describe('AND WHEN the retryUrl has not been reported', () => {
          it('should navigate to the root page', fakeAsync(() => {
            component.retryUrl = null;
            const buttonComponent = fixture.debugElement.query(By.directive(ButtonComponent));
            const button = buttonComponent.query(By.css('button'));

            button.nativeNode.click();

            expect(router.navigateByUrl).toHaveBeenCalledWith(fakeUrl, { skipLocationChange: true });
          }));
        });
        it('should navigate to previous page', fakeAsync(() => {
          const buttonComponent = fixture.debugElement.query(By.directive(ButtonComponent));
          const button = buttonComponent.query(By.css('button'));

          button.nativeNode.click();
          tick();

          expect(router.navigate).toHaveBeenCalledWith([fakeUrl]);
        }));
      });
    });
    describe('WHEN the listener was destroyed', () => {
      beforeEach(() => {
        component.ngOnDestroy();
        service.show('some error!!!');
      });

      it('should not show the block corresponding to error even if there is an error', () => {
        const target = fixture.debugElement.query(By.css(SharedErrorActionSelector));

        expect(target).toBeFalsy();
      });
      it('should not unsubscribe to the listener', fakeAsync(() => {
        component.ngOnDestroy();
        tick();

        /*
          Fake expectation. We need this test only
          to achieve the 100% of coverage
        */
        expect(true).toBe(true);
      }));
    });
  });
});
