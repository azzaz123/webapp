import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallacoinsTutorialComponent } from './wallacoins-tutorial.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../core/user/user.service';
import { Observable, of } from 'rxjs';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WallacoinsTutorialComponent', () => {
  let component: WallacoinsTutorialComponent;
  let fixture: ComponentFixture<WallacoinsTutorialComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallacoinsTutorialComponent ],
      providers: [
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
        }
        },
        {
          provide: UserService, useValue: {
          hasPerm() {
            return of(true);
          }
        }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallacoinsTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.get(UserService);
  });

  describe('ngOnInit', () => {
    it('should get and set if user has coins perm', () => {
      spyOn(userService, 'hasPerm').and.callThrough();

      component.ngOnInit();

      expect(userService.hasPerm).toHaveBeenCalledWith('coins');
      expect(component.withCoins).toBe(true);
    });
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
