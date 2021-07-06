import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerComponent } from './drawer.component';
import { Component, DebugElement, Predicate } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DrawerModule } from '@public/shared/components/drawer/drawer.module';
import { ScrollLockService } from '@public/shared/services/scroll-lock.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-wrapper',
  template: `<tsl-drawer [isOpen]="isOpen" [hasApply]="hasApply" [offsetTop]="offsetTop"></tsl-drawer>`,
})
class TestWrapperComponent extends DrawerComponent {}

describe('DrawerComponent', () => {
  let wrapperComponent: TestWrapperComponent;
  let component: DrawerComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let debugElement: DebugElement;
  let scrollLockService: ScrollLockService;
  const drawerSelector = By.css('.Drawer');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerModule],
      declarations: [TestWrapperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    scrollLockService = TestBed.inject(ScrollLockService);
    debugElement = fixture.debugElement;
    wrapperComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(DrawerComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when open state changes', () => {
    describe('from close to open', () => {
      beforeEach(async () => {
        await setInputs({
          isOpen: false,
        });
      });
      it('should lock scroll', async () => {
        spyOn(scrollLockService, 'changeLockStatus');
        await setInputs({
          isOpen: true,
        });

        expect(scrollLockService.changeLockStatus).toHaveBeenCalledTimes(1);
        expect(scrollLockService.changeLockStatus).toHaveBeenCalledWith(true);
      });
    });

    describe('from open to close', () => {
      beforeEach(async () => {
        await setInputs({
          isOpen: true,
        });
      });
      it('should unlock scroll', async () => {
        spyOn(scrollLockService, 'changeLockStatus');
        await setInputs({
          isOpen: false,
        });

        expect(scrollLockService.changeLockStatus).toHaveBeenCalledTimes(1);
        expect(scrollLockService.changeLockStatus).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('when drawer is closed', () => {
    beforeEach(async () => {
      await setInputs({
        isOpen: false,
      });
    });

    it('should not render', () => {
      expectRender(drawerSelector, false);
    });
  });

  describe('when drawer is open', () => {
    beforeEach(async () => {
      await setInputs({
        isOpen: true,
      });
    });

    it('should render', () => {
      expectRender(drawerSelector, true);
    });

    describe('and backdrop is clicked', () => {
      it('should emit clickBackdrop', () => {
        spyOn(component.clickBackdrop, 'emit');
        debugElement.query(By.css('.Drawer__backdrop')).nativeElement.click();

        expect(component.clickBackdrop.emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('and cancel button is clicked', () => {
      it('should emit cancel', () => {
        spyOn(component.cancel, 'emit');
        debugElement.query(By.css('.Drawer .basic.basic-dark')).nativeElement.click();

        expect(component.cancel.emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('and has apply', () => {
      const applyButtonSelector = By.css('.Drawer .btn-primary');

      beforeEach(async () => {
        await setInputs({
          hasApply: true,
        });
      });

      it('should render apply button', () => {
        expectRender(applyButtonSelector, true);
      });

      describe('and is clicked', () => {
        it('should emit apply', () => {
          spyOn(component.apply, 'emit');
          debugElement.query(applyButtonSelector).nativeElement.click();

          expect(component.apply.emit).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  async function setInputs(props: Partial<DrawerComponent>): Promise<void> {
    for (const key of Object.keys(props)) {
      wrapperComponent[key] = props[key];
    }
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    return fixture.whenStable();
  }

  function expectRender(selector: Predicate<DebugElement>, isExpectedToRender: boolean): void {
    const element = debugElement.query(selector);

    if (isExpectedToRender) {
      expect(element).toBeTruthy();
    } else {
      expect(element).toBeFalsy();
    }
  }
});
