import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadConfirmationModalComponent } from './upload-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WindowRef, MockTrackingService } from 'shield';
import { TrackingService } from '../../../../core/tracking/tracking.service';

describe('UploadConfirmationModalComponent', () => {
  let component: UploadConfirmationModalComponent;
  let fixture: ComponentFixture<UploadConfirmationModalComponent>;
  let trackingService: TrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadConfirmationModalComponent],
      providers: [
        NgbActiveModal,
        WindowRef,
        {provide: TrackingService, useClass: MockTrackingService}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadConfirmationModalComponent);
    component = fixture.componentInstance;
    trackingService = TestBed.get(TrackingService);
  });

  describe('ngOnInit', () => {
    it('should track open', () => {
      spyOn(trackingService, 'track');

      fixture.detectChanges();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.UPLOADFORM_SUCCESS);
    });
  });


});
