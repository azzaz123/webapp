import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { ItemApiModule } from '@public/core/services/api/item/item-api.service';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { FavouriteIconModule } from '../favourite-icon/favourite-icon.module';

import { ItemCardComponent } from './item-card.component';
import { ItemCardService } from './services/item-card.service';

describe('ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardComponent],
      imports: [
        CommonModule,
        FavouriteIconModule,
        CustomCurrencyModule,
        SvgIconModule,
        SanitizedBackgroundModule,
        ItemApiModule,
      ],
      providers: [ItemCardService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
