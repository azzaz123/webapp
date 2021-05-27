import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProBadgeComponent } from './pro-badge.component';
import { By } from '@angular/platform-browser';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

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

  it('should show the PRO badge', () => {
    const proBadgeSvgIconComponent: SvgIconComponent = fixture.debugElement.query(By.directive(SvgIconComponent)).componentInstance;

    expect(proBadgeSvgIconComponent).toBeTruthy();
    expect(proBadgeSvgIconComponent.src).toEqual('/assets/icons/pro-seal.svg');
  });
});
