import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTaxonomiesComponent } from './item-taxonomies.component';

describe('ItemTaxonomiesComponent', () => {
  let component: ItemTaxonomiesComponent;
  let fixture: ComponentFixture<ItemTaxonomiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemTaxonomiesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTaxonomiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
