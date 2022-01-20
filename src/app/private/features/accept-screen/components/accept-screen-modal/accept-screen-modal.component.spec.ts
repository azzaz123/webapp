import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptScreenModalComponent } from './accept-screen-modal.component';
import { ActivatedRoute } from '@angular/router';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';

describe('AcceptScreenModalComponent', () => {
  const MOCK_REQUEST_ID = '82723gHYSA762';

  let component: AcceptScreenModalComponent;
  let fixture: ComponentFixture<AcceptScreenModalComponent>;
  let acceptScreenStoreService: AcceptScreenStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptScreenModalComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => MOCK_REQUEST_ID,
              },
            },
          },
        },
        {
          provide: AcceptScreenStoreService,
          useValue: {
            initialize() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptScreenModalComponent);
    acceptScreenStoreService = TestBed.inject(AcceptScreenStoreService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When opening Accept Screen', () => {
    beforeEach(() => {
      spyOn(acceptScreenStoreService, 'initialize');

      fixture.detectChanges();
    });

    it('should initialize accept screen properties using the store', () => {
      expect(acceptScreenStoreService.initialize).toHaveBeenCalledTimes(1);
      expect(acceptScreenStoreService.initialize).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });
  });
});
