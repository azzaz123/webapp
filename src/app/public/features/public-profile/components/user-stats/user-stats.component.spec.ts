import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RouterTestingModule } from '@angular/router/testing';
import { UserStatsComponent } from './user-stats.component';

describe('UserStatsComponent', () => {
  let component: UserStatsComponent;
  let fixture: ComponentFixture<UserStatsComponent>;
  let deviceDetectorService: DeviceDetectorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [UserStatsComponent],
      providers: [
        {
          provide: DeviceDetectorService,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
