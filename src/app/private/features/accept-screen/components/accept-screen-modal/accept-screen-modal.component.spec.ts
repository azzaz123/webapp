import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptScreenModalComponent } from './accept-screen-modal.component';
import { AcceptScreenService } from '../../services/accept-screen/accept-screen.service';
import { ActivatedRoute } from '@angular/router';

describe('AcceptScreenModalComponent', () => {
  const MOCK_REQUEST_ID = '82723gHYSA762';

  let component: AcceptScreenModalComponent;
  let fixture: ComponentFixture<AcceptScreenModalComponent>;
  let acceptScreenService: AcceptScreenService;

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
          provide: AcceptScreenService,
          useValue: {
            initialize() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptScreenModalComponent);
    acceptScreenService = TestBed.inject(AcceptScreenService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When opening Accept Screen', () => {
    beforeEach(() => {
      spyOn(acceptScreenService, 'initialize');

      fixture.detectChanges();
    });

    it('should initialize accept screen properties', () => {
      expect(acceptScreenService.initialize).toHaveBeenCalledTimes(1);
      expect(acceptScreenService.initialize).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });
  });
});
