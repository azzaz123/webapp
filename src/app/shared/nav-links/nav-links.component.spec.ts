import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NavLinksComponent } from './nav-links.component';
import { SearchInputComponent } from '../search-input/search-input.component';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '../select/select.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FullScreenModalComponent } from '../modals/full-screen-menu/full-screen-modal.component';

describe('NavLinksComponent', () => {
  let component: NavLinksComponent;
  let fixture: ComponentFixture<NavLinksComponent>;
  let deviceService: DeviceDetectorService;
  let modalService: NgbModal;
  const NAV_LINK = {id: 'date_asc', display: 'On Date Ascending'};
  const SORT_LINK = {value: 'date_asc', label: 'On Date Ascending'};
  const componentInstance = {
    items: [NAV_LINK]
  };
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatIconModule ],
      declarations: [ NavLinksComponent, SearchInputComponent, SelectComponent ],
      providers: [
        { provide: DeviceDetectorService, useClass: DeviceDetectorService },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance
              };
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavLinksComponent);
    component = fixture.componentInstance;
    deviceService = TestBed.get(DeviceDetectorService);
    modalService = TestBed.get(NgbModal);
    component.sortItems = [SORT_LINK];
    component.navLinks = [NAV_LINK];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should set the selectedSort items', () => {
      spyOn(deviceService, 'isMobile').and.returnValue(true);

      component.ngOnInit();

      expect(component.selectedSort).toEqual(NAV_LINK);
    })

    it('should set isMobile to true', () => {
      spyOn(deviceService, 'isMobile').and.returnValue(true);

      component.ngOnInit();

      expect(component.isMobile).toBe(true);
    });

    it('should set isMobile to false', () => {
      spyOn(deviceService, 'isMobile').and.returnValue(false);

      component.ngOnInit();

      expect(component.isMobile).toBe(false);
    });
  });

  describe('onClickSearch', () => {
    it('should set searchClicked to true', () => {
      spyOn(deviceService, 'isMobile').and.returnValue(true);

      component.onClickSearch();

      expect(component.searchClicked).toBe(true);
    })
  });

  describe('onSortChange', () => {
    it('should set selectedSort to new link value', () => {
      component.onSortChange(NAV_LINK);

      expect(component.selectedSort).toEqual(NAV_LINK);
    })

    it('should emit the new link id', () => {
      spyOn(component.sortChanged, 'emit');

      component.onSortChange(NAV_LINK);

      expect(component.sortChanged.emit).toHaveBeenCalledWith(NAV_LINK.id);
    })
  });
  
  describe('onDeleteSearch', () => {
    it('should call onSearchChange', () => {
      spyOn(component, 'onSearchChange').and.callThrough();

      component.onDeleteSearch();

      expect(component.onSearchChange).toHaveBeenCalledWith('');
    });
  });
  
  describe('onSearchChange', () => {
    it('should emit searchChanged', () => {
      spyOn(component.searchChanged, 'emit');

      component.onSearchChange('seat');

      expect(component.searchChanged.emit).toHaveBeenCalledWith('seat');
    });
  });

  describe('onClickNavLink', () => {
    it('should emit clickedLink', () => {
      spyOn(component.clickedLink, 'emit');

      component.onClickNavLink(NAV_LINK);

      expect(component.clickedLink.emit).toHaveBeenCalledWith(NAV_LINK.id);
    });

    it('should set the selectedLink', () => {
      component.onClickNavLink(NAV_LINK);

      expect(component.selectedLink).toEqual(NAV_LINK);
    });
  });

  describe('onClickCloseSearch', () => {
    it('should call onSearchChange', () => {
      spyOn(component, 'onSearchChange').and.callThrough();

      component.onClickCloseSearch();

      expect(component.onSearchChange).toHaveBeenCalledWith('');
    });

    it('should set the search vars to new values', () => {
      component.onClickCloseSearch();

      expect(component.searchClicked).toBe(false);
      expect(component.closeSearch).toBe(true);
    });
  });

  describe('selectSort', () => {
    it('should open a fullscreen modal with the sort items',fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve(NAV_LINK),
        componentInstance: componentInstance
      });
      spyOn(component, 'onSortChange').and.callThrough();

      component.selectSort();
      tick();

      expect(modalService.open).toHaveBeenCalledWith(FullScreenModalComponent, {
        windowClass: 'full-screen'
      });
      expect(componentInstance.items).toEqual([NAV_LINK]);
      expect(component.onSortChange).toHaveBeenCalledWith(NAV_LINK);
    }));

  });

  describe('selectMenu', () => {
    it('should open a fullscreen modal with the link items', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve(NAV_LINK),
        componentInstance: componentInstance
      });
      spyOn(component, 'onClickNavLink').and.callThrough();

      component.selectMenu();
      tick();

      expect(modalService.open).toHaveBeenCalledWith(FullScreenModalComponent, {
        windowClass: 'full-screen'
      });
      expect(componentInstance.items).toEqual([NAV_LINK]);
      expect(component.onClickNavLink).toHaveBeenCalledWith(NAV_LINK);
    }));
    
  });

});
