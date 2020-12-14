import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

import { FavouriteIconComponent } from './favourite-icon.component';

describe('FavouriteIconComponent', () => {
  let component: FavouriteIconComponent;
  let fixture: ComponentFixture<FavouriteIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgIconModule, HttpClientTestingModule],
      declarations: [FavouriteIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
