import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { FavouriteIconModule } from '@public/core/components/favourite-icon/favourite-icon.module';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';

import { FavouriteUserComponent } from './favourite-user.component';

describe('FavouriteUserComponent', () => {
  let component: FavouriteUserComponent;
  let fixture: ComponentFixture<FavouriteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FavouriteIconModule,
        CheckSessionModule,
      ],
      declarations: [FavouriteUserComponent],
      providers: [
        {
          provide: AccessTokenService,
          useValue: {
            accessToken: undefined,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
