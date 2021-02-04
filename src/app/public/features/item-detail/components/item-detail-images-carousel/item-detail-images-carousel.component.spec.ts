import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailImagesCarouselComponent } from './item-detail-images-carousel.component';

describe('ItemDetailImagesCarouselComponent', () => {
  let component: ItemDetailImagesCarouselComponent;
  let fixture: ComponentFixture<ItemDetailImagesCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailImagesCarouselComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailImagesCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
