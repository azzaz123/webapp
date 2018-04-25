import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogProItemComponent } from './catalog-pro-item.component';

describe('CatalogProItemComponent', () => {
  let component: CatalogProItemComponent;
  let fixture: ComponentFixture<CatalogProItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogProItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogProItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
