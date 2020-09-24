import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallacoinsTutorialComponent } from './wallacoins-tutorial.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WallacoinsTutorialComponent', () => {
  let component: WallacoinsTutorialComponent;
  let fixture: ComponentFixture<WallacoinsTutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WallacoinsTutorialComponent],
      providers: [
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallacoinsTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onSlide', () => {
    it('should set isLast when is last slide', () => {
      component.onSlide({
        current: 'ngb-slide-2'
      } as NgbSlideEvent);

      expect(component.isLast).toBe(true);
    });
  });
});
