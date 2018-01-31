import { TestBed, async, inject } from '@angular/core/testing';

import { TutorialGuard } from './tutorial.guard';
import { TutorialService } from '../../core/tutorial/tutorial.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

describe('TutorialGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TutorialGuard,
        {
          provide: TutorialService, useValue: {
          isAlreadyDisplayed() {
            return Observable.of(false);
          }
        }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
        }
        }
      ]
    });
  });

  it('should ...', inject([TutorialGuard], (guard: TutorialGuard) => {
    expect(guard).toBeTruthy();
  }));
});
