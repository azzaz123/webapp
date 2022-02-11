import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPriceBannerComponent } from './edit-price-banner.component';

describe('EditPriceBannerComponent', () => {
  let component: EditPriceBannerComponent;
  let fixture: ComponentFixture<EditPriceBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPriceBannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPriceBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
