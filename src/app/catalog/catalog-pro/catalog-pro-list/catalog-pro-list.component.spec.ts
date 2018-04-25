import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogProListComponent } from './catalog-pro-list.component';

describe('CatalogProListComponent', () => {
  let component: CatalogProListComponent;
  let fixture: ComponentFixture<CatalogProListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogProListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogProListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
