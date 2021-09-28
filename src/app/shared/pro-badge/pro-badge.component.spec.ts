import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProBadgeComponent } from './pro-badge.component';
import { By } from '@angular/platform-browser';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { ICON_TYPE } from './pro-badge.interface';

describe('ProBadgeComponent', () => {
  let fixture: ComponentFixture<ProBadgeComponent>;
  let component: ProBadgeComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, SvgIconModule],
        declarations: [ProBadgeComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('and we dont select any type', () => {
    it('should show the default PRO badge', () => {
      const proBadgeSvgIconComponent: SvgIconComponent = fixture.debugElement.query(By.directive(SvgIconComponent)).componentInstance;

      expect(proBadgeSvgIconComponent).toBeTruthy();
      expect(proBadgeSvgIconComponent.src).toEqual('/assets/icons/pro/pro-badge.svg');
      expect(proBadgeSvgIconComponent.width).toEqual(60);
      expect(proBadgeSvgIconComponent.height).toEqual(20);
    });
  });

  describe('and we select small type', () => {
    beforeEach(() => {
      component.IconType = ICON_TYPE.SMALL;
      component.ngOnInit();
      fixture.detectChanges();
    });
    it('should show the default PRO badge', () => {
      const proBadgeSvgIconComponent: SvgIconComponent = fixture.debugElement.query(By.directive(SvgIconComponent)).componentInstance;

      expect(proBadgeSvgIconComponent).toBeTruthy();
      expect(proBadgeSvgIconComponent.src).toEqual('/assets/icons/pro/pro-seal.svg');
    });
  });

  describe('and we select small type', () => {
    beforeEach(() => {
      component.IconType = ICON_TYPE.DEFAULT;
      component.ngOnInit();
      fixture.detectChanges();
    });
    it('should show the default PRO badge', () => {
      const proBadgeSvgIconComponent: SvgIconComponent = fixture.debugElement.query(By.directive(SvgIconComponent)).componentInstance;

      expect(proBadgeSvgIconComponent).toBeTruthy();
      expect(proBadgeSvgIconComponent.src).toEqual('/assets/icons/pro/pro-badge.svg');
      expect(proBadgeSvgIconComponent.width).toEqual(60);
      expect(proBadgeSvgIconComponent.height).toEqual(20);
    });
  });

  describe('and we select large type', () => {
    beforeEach(() => {
      component.IconType = ICON_TYPE.LARGE;
      component.ngOnInit();
      fixture.detectChanges();
    });
    it('should show the large PRO badge', () => {
      const proBadgeSvgIconComponent: SvgIconComponent = fixture.debugElement.query(By.directive(SvgIconComponent)).componentInstance;

      expect(proBadgeSvgIconComponent).toBeTruthy();
      expect(proBadgeSvgIconComponent.src).toEqual('/assets/icons/pro/pro-badge.svg');
      expect(proBadgeSvgIconComponent.width).toEqual(102);
      expect(proBadgeSvgIconComponent.height).toEqual(34);
    });
  });
});
