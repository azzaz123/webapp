import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { EditComponent } from './edit.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MOCK_ITEM } from 'shield';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExitConfirmationModalComponent } from './exit-confirmation-modal/exit-confirmation-modal.component';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let modalService: NgbModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
          snapshot: {
            data: {
              item: MOCK_ITEM
            }
          }
        }
        },
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              result: Promise.resolve(true)
            }
          }
        }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalService = TestBed.get(NgbModal);
  });

  describe('ngOnInit', () => {
    it('should set item', () => {
      expect(component.item).toEqual(MOCK_ITEM);
    });
  });

  describe('onValidationError', () => {
    it('should set scrollTop to 0', () => {
      component.scrollPanel = {
        nativeElement: {}
      };

      component.onValidationError();

      expect(component.scrollPanel.nativeElement.scrollTop).toBe(0);
    });
  });

  describe('canExit', () => {
    it('should return true if there are no unsaved changes', () => {
      const result = component.canExit();

      expect(result).toBeTruthy();
    });

    it('should open modal if there are unsaved changes', fakeAsync(() => {
      let notSavedChanges: boolean;
      component['hasNotSavedChanges'] = true;
      spyOn(modalService, 'open').and.callThrough();

      (<Promise<boolean>>component.canExit()).then((value: boolean) => {
        notSavedChanges = value;
      });
      tick();

      expect(modalService.open).toHaveBeenCalledWith(ExitConfirmationModalComponent, {
        backdrop: 'static'
      });
      expect(notSavedChanges).toBeTruthy();
    }));
  });

  describe('onFormChanged', () => {
    it('should set hasNotSavedChanges', () => {
      component.onFormChanged(true);

      expect(component['hasNotSavedChanges']).toBeTruthy();
    });
  });

});
