import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogItemActionsComponent } from './catalog-item-actions.component';

describe('CatalogItemActionsComponent', () => {
  let component: CatalogItemActionsComponent;
  let fixture: ComponentFixture<CatalogItemActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogItemActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogItemActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
