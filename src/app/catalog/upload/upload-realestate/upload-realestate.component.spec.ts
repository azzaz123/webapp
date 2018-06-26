import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRealestateComponent } from './upload-realestate.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { RealestateKeysService } from './realestate-keys.service';
import { Observable } from 'rxjs/Observable';
import { ErrorsService } from '../../../core/errors/errors.service';
import { Router } from '@angular/router';

describe('UploadRealestateComponent', () => {
  let component: UploadRealestateComponent;
  let fixture: ComponentFixture<UploadRealestateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadRealestateComponent ],
      providers: [
        FormBuilder,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: RealestateKeysService, useValue: {
          getOperations() {
            return Observable.of([]);
          },
          getConditions() {
            return Observable.of([]);
          },
          getExtras() {
            return Observable.of([]);
          },
          getTypes() {
            return Observable.of([]);
          }
        }
        },
        {
          provide: Router, useValue: {
          navigate() {
          }
        }
        },
        {
          provide: ErrorsService, useValue: {
          i18nSuccess() {
          },
          i18nError() {
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRealestateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
