import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSocialShareComponent } from './item-social-share.component';

describe('ItemSocialShareComponent', () => {
  let component: ItemSocialShareComponent;
  let fixture: ComponentFixture<ItemSocialShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemSocialShareComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSocialShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
