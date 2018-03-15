import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent } from './catalog.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { Response, ResponseOptions} from '@angular/http';
import { TrackingService } from '../core/tracking/tracking.service';
import { MockTrackingService } from '../../tests/tracking.fixtures.spec';
import { UserService } from '../core/user/user.service';
import { MOCK_USER, USER_DATA } from '../../tests/user.fixtures.spec';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;
  let trackingService: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogComponent],
      providers: [
        {provide: TrackingService, useClass: MockTrackingService},
        MockBackend,
        {
          provide: UserService, useValue: {
          me() {
            return Observable.of(MOCK_USER);
          }
        }
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(CatalogComponent);
    trackingService = TestBed.get(TrackingService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(fakeAsync(() => {
      let mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((connection: MockConnection) => {
        let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(USER_DATA)});
        connection.mockRespond(new Response(res));
      });
    }));
    it('should send event catalog_view_items on page load', () => {
      spyOn(trackingService, 'track');
      component.ngOnInit();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CATALOG_VIEW_ITEMS);
    });
  });
});
