import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialComponent } from './tutorial.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TutorialService } from '../core/tutorial/tutorial.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TutorialComponent', () => {
  let component: TutorialComponent;
  let fixture: ComponentFixture<TutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [ TutorialComponent ],
      providers: [
        {
          provide: TutorialService, useValue: {
          setDisplayed() {
          },
          step: 0
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
