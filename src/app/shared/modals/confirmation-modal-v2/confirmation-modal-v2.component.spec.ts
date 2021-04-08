import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfirmationModalV2Component } from './confirmation-modal-v2.component';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';

describe('ConfirmationModalV2Component', () => {
  let component: ConfirmationModalV2Component;
  let fixture: ComponentFixture<ConfirmationModalV2Component>;
  let element: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, SvgIconModule],
        declarations: [ConfirmationModalV2Component],
        providers: [NgbActiveModal],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalV2Component);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('when primary button is clicked', () => {
    it('should emit primary button click event', () => {
      spyOn(component.primaryBtnClick, 'emit');
      const primaryBtn = fixture.debugElement.nativeElement.querySelector('[classname*="btn-primary"]');

      primaryBtn.click();

      expect(component.primaryBtnClick.emit).toHaveBeenCalled();
    });
  });

  describe('when secondary button is clicked', () => {
    it('should emit secondary button click event', () => {
      spyOn(component.secondaryBtnClick, 'emit');
      const secondaryBtn = fixture.debugElement.nativeElement.querySelector('[classname*="basic--grey"]');

      secondaryBtn.click();

      expect(component.secondaryBtnClick.emit).toHaveBeenCalled();
    });
  });
});
