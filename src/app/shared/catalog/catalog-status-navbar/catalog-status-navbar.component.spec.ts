import { async, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

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

  describe('select status', () => {
    let event: any;
    let status = 'active';

    beforeEach(fakeAsync(() => {
      component.filterByStatus.subscribe(($event: any) => {
        event = $event;
      });
      component.selectStatus(status);
    }));

    afterEach(() => {
      event = undefined;
    });

    it('should set the new status selected', () => {
      expect(component.selectedStatus).toBe('active');
    });
    
    it('should emit an event', () => {
      expect(component.filterByStatus.emit).toHaveBeenCalledWith('active');
    });

  });
});
