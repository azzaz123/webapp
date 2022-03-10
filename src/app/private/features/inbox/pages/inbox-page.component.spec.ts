import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { InboxPageComponent } from './inbox-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';

describe('InboxComponent', () => {
  let component: InboxPageComponent;
  let fixture: ComponentFixture<InboxPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [InboxPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: FeatureFlagService, useClass: FeatureFlagServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxPageComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
