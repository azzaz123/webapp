import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogStatusNavbarComponent } from './catalog-status-navbar.component';

describe('CatalogStatusNavbarComponent', () => {
  let component: CatalogStatusNavbarComponent;
  let fixture: ComponentFixture<CatalogStatusNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogStatusNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogStatusNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
