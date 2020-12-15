import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavouriteIconModule } from '@public/core/components/favourite-icon/favourite-icon.module';

import { FavouriteUserComponent } from './favourite-user.component';

describe('FavouriteUserComponent', () => {
  let component: FavouriteUserComponent;
  let fixture: ComponentFixture<FavouriteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavouriteUserComponent],
      imports: [FavouriteIconModule, HttpClientTestingModule],
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
