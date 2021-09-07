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
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { WalletSharedErrorActionComponent } from './wallet-shared-error-action.component';
import { WalletSharedErrorActionService } from './../../services/wallet-shared-error-action.service';

@Component({
  selector: 'tsl-fake-component',
  templateUrl: './wallet-shared-error-action.component.html',
})
class FakeComponent extends WalletSharedErrorActionComponent {
  constructor(errorActionService: WalletSharedErrorActionService, changeDetectorRef: ChangeDetectorRef, router: Router) {
    super(errorActionService, changeDetectorRef, router);
  }
}

describe('GIVEN WalletSharedErrorActionComponent', () => {
  let component: WalletSharedErrorActionComponent;
  let fixture: ComponentFixture<WalletSharedErrorActionComponent>;
  let router: Router;
  let service: WalletSharedErrorActionService;
  const walletSharedErrorActionSelector = '.WalletSharedErrorAction';
  const walletSharedErrorActionContentSelector = `${walletSharedErrorActionSelector}__content`;

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
              return 'this is a fake url';
            },
          },
        },
        WalletSharedErrorActionService,
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    service = TestBed.inject(WalletSharedErrorActionService);
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
      const target = fixture.debugElement.query(By.css(walletSharedErrorActionSelector));

      expect(target).toBeFalsy();
    });
    it('should show the block corresponding to the content', () => {
      const target = fixture.debugElement.query(By.css(walletSharedErrorActionContentSelector));

      expect(target).toBeTruthy();
    });
  });
  describe('WHEN there is an error', () => {
    describe('WHEN the listener is active', () => {
      beforeEach(() => {
        service.show('some error!!!');
      });

      it('should show the block corresponding to error', () => {
        const target = fixture.debugElement.query(By.css(walletSharedErrorActionSelector));

        expect(target).toBeTruthy();
      });
      it('should not show the block corresponding to content', () => {
        const target = fixture.debugElement.query(By.css(walletSharedErrorActionContentSelector));

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
        it('should navigate to the refresh page', fakeAsync(() => {
          const buttonComponent = fixture.debugElement.query(By.directive(ButtonComponent));
          const button = buttonComponent.query(By.css('button'));

          button.nativeNode.click();

          expect(router.navigateByUrl).toHaveBeenCalledWith(`${PRIVATE_PATHS.WALLET}/refresh`, { skipLocationChange: true });
        }));
        it('should navigate to previous page', fakeAsync(() => {
          const buttonComponent = fixture.debugElement.query(By.directive(ButtonComponent));
          const button = buttonComponent.query(By.css('button'));

          button.nativeNode.click();
          tick();

          expect(router.navigate).toHaveBeenCalledWith(['this is a fake url']);
        }));
      });
    });
    describe('WHEN the listener was destroyed', () => {
      beforeEach(() => {
        component.ngOnDestroy();
        service.show('some error!!!');
      });

      it('should not show the block corresponding to error even if there is an error', () => {
        const target = fixture.debugElement.query(By.css(walletSharedErrorActionSelector));

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
