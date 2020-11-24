import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent } from './catalog.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackingService } from '../core/tracking/tracking.service';
import { MockTrackingService } from '../../tests/tracking.fixtures.spec';
import { UserService } from '../core/user/user.service';
import { MOCK_USER } from '../../tests/user.fixtures.spec';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;
  let trackingService: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogComponent],
      providers: [
        { provide: TrackingService, useClass: MockTrackingService },
        {
          provide: UserService,
          useValue: {
            me() {
              return of(MOCK_USER);
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CatalogComponent);
    trackingService = TestBed.inject(TrackingService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should send event catalog_view_items on page load', () => {
      spyOn(trackingService, 'track');

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.CATALOG_VIEW_ITEMS
      );
    });
  });
});
