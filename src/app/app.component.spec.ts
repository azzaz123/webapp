import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureflagService } from '@core/user/featureflag.service';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { MockPermissionsService } from '@fixtures/permissions.fixtures';
import { NgxPermissionsService } from 'ngx-permissions';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        {
          provide: NgxPermissionsService,
          useClass: MockPermissionsService,
        },
        { provide: FeatureflagService, useClass: FeatureFlagServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create app', () => {
    expect(component).toBeTruthy();
  });
});
