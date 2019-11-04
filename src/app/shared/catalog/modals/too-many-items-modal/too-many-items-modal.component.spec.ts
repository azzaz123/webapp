import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TooManyItemsModalComponent } from './too-many-items-modal.component';
import { ButtonComponent } from '../../../button/button.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TooManyItemsModalComponent', () => {
  let component: TooManyItemsModalComponent;
  let fixture: ComponentFixture<TooManyItemsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        RouterTestingModule
      ],
      declarations: [
        TooManyItemsModalComponent,
        ButtonComponent
      ],
      providers: [
        NgbActiveModal
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooManyItemsModalComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call setType on init', () => {
    spyOn(component, 'setType');

    component.ngOnInit();

    expect(component.setType).toHaveBeenCalledTimes(1);
  });

  describe('setType', () => {
    describe('normal user', () => {
      it('should set correct flag values', () => {
        component.setType('1');

        expect(component.isNormal).toBe(true);
        expect(component.isMotorPlan).toBe(false);
        expect(component.isCarDealer).toBe(false);
        expect(component.isWebSubscription).toBe(false);
      });
    });

    describe('motor plan user', () => {
      it('should set correct flag values', () => {
        component.setType('2');

        expect(component.isNormal).toBe(false);
        expect(component.isMotorPlan).toBe(true);
        expect(component.isCarDealer).toBe(false);
        expect(component.isWebSubscription).toBe(false);
      });
    });

    describe('car dealer user', () => {
      it('should set correct flag values', () => {
        component.setType('3');

        expect(component.isNormal).toBe(false);
        expect(component.isMotorPlan).toBe(false);
        expect(component.isCarDealer).toBe(true);
        expect(component.isWebSubscription).toBe(false);
      });
    });

    describe('web subscription user', () => {
      it('should set correct flag values', () => {
        component.setType('4');

        expect(component.isNormal).toBe(false);
        expect(component.isMotorPlan).toBe(false);
        expect(component.isCarDealer).toBe(false);
        expect(component.isWebSubscription).toBe(true);
      });
    });

  });
});
