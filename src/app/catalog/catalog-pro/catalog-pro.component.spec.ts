import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogProComponent } from './catalog-pro.component';

describe('CatalogProComponent', () => {
  let component: CatalogProComponent;
  let fixture: ComponentFixture<CatalogProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
