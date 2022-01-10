import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NavLink, SortLink } from './nav-link.interface';
import { FullScreenModalComponent } from '../modals/full-screen-menu/full-screen-modal.component';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tsl-nav-links',
  templateUrl: './nav-links.component.html',
  styleUrls: ['./nav-links.component.scss'],
})
export class NavLinksComponent implements OnInit, OnChanges {
  @Input() navLinks: NavLink[];
  @Input() selectedLinkId: string;
  @Input() showSearchInput = false;
  @Input() searchPlaceholder = 'Search';
  @Input() sortItems: SortLink[] = [];
  @Input() showSortItems = false;
  @Input() subscriptionSelectedNavLinks: any[];
  @Input() marginless = false;
  @Input() disabled = false;
  @Output() clickedLink = new EventEmitter<string>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<string>();
  public searchClicked: boolean;
  public closeSearch: boolean;
  public dropdownLinks: any[];
  public selectedSubscriptionSelectedNavLinks: any;
  public selectedLink: NavLink;
  public selectedSort: NavLink;
  public isMobile = false;

  constructor(private modalService: NgbModal, private deviceService: DeviceDetectorService) {}

  onClickNavLink(navLink: NavLink) {
    this.clickedLink.emit(navLink.id);
    this.selectedLink = navLink;
  }

  onSearchChange(search: string) {
    this.searchChanged.emit(search);
  }

  onDeleteSearch() {
    this.onSearchChange('');
  }

  onClickSortSelector(id: string): void {
    const sortLinks = this.mapSortToLink(this.sortItems);
    const sortLinkSelected = sortLinks.find((link) => link.id === id);
    this.onSortChange(sortLinkSelected);
  }

  onSortChange(sort: NavLink) {
    this.sortChanged.emit(sort.id);
    this.selectedSort = sort;
  }

  onClickSearch(): void {
    if (this.deviceService.isMobile()) {
      this.searchClicked = true;
    }
  }

  onClickCloseSearch(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    this.searchClicked = false;
    this.closeSearch = true;
    this.onSearchChange('');
  }

  ngOnInit() {
    if (!this.selectedLinkId && this.navLinks && this.navLinks[0]) {
      this.selectedLinkId = this.navLinks[0].id;
    }
    this.selectedLink = this.navLinks.find((navLink) => navLink.id === this.selectedLinkId);
    const sortLinks = this.mapSortToLink(this.sortItems);
    this.selectedSort = sortLinks[0];
    if (this.deviceService.isMobile()) {
      this.isMobile = true;
    }
  }

  ngOnChanges() {
    if (this.navLinks) {
      this.selectedLink = this.navLinks.find((navLink) => navLink.id === this.selectedLinkId);
    }
  }

  public selectMenu(): void {
    let modalRef: NgbModalRef = this.modalService.open(FullScreenModalComponent, { windowClass: 'full-screen' });
    modalRef.componentInstance.items = this.navLinks;
    modalRef.result.then((link: NavLink) => {
      modalRef = null;
      this.onClickNavLink(link);
    });
  }

  public selectSort(): void {
    const sortLinks = this.mapSortToLink(this.sortItems);
    let modalRef: NgbModalRef = this.modalService.open(FullScreenModalComponent, { windowClass: 'full-screen' });
    modalRef.componentInstance.items = sortLinks;
    modalRef.result.then((link: NavLink) => {
      modalRef = null;
      this.onSortChange(link);
    });
  }

  private mapSortToLink(sortItems: SortLink[]): NavLink[] {
    const sortLinks: NavLink[] = [];
    sortItems.map((sortItem: SortLink) => {
      let sortObj = { id: sortItem.value, display: sortItem.label };
      sortLinks.push(sortObj);
    });
    return sortLinks;
  }
}
