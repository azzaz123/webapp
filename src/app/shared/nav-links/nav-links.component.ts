import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavLink } from './nav-link.interface';

@Component({
  selector: 'tsl-nav-links',
  templateUrl: './nav-links.component.html',
  styleUrls: ['./nav-links.component.scss']
})
export class NavLinksComponent implements OnInit {

  @Input() navLinks: NavLink[];
  @Input() selectedLinkId: string;
  @Input() showSearchInput = false;
  @Input() searchPlaceholder = 'Search';
  @Input() sortItems: any[];
  @Input() showSortItems = false;
  @Input() subscriptionSelectedNavLinks: any[];
  @Output() clickedLink = new EventEmitter<string>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<string>();
  public searchClicked: boolean;
  public closeSearch: boolean;
  public dropdownLinks: any[];
  public selectedSubscriptionSelectedNavLinks: any;
  public selectedLink: NavLink;
  
  constructor() { }

  ngOnInit() {
    if (!this.selectedLinkId && this.navLinks && this.navLinks[0]) {
      this.selectedLinkId = this.navLinks[0].id;
    }
    this.selectedLink = this.navLinks.find(navLink => navLink.id === this.selectedLinkId);
    //this.mapLinksToDropdown();
  }

  public openMenuModal(navLink: NavLink): void {
    //open Modal 100% with options
    //this.onClickNavLink(navLink);
  }

  private mapLinksToDropdown(): void {
    this.dropdownLinks = [];
    this.subscriptionSelectedNavLinks.forEach(value => this.dropdownLinks.push({ value: value.id, label: value.display }));
    if (!this.selectedSubscriptionSelectedNavLinks && this.subscriptionSelectedNavLinks && this.subscriptionSelectedNavLinks[0]) {
      this.selectedSubscriptionSelectedNavLinks = this.subscriptionSelectedNavLinks[0];
    }
  }

  onClickNavLink(navLink: NavLink) {
    this.clickedLink.emit(navLink.id);
    this.selectedLink = navLink;
  }

  onSearchChange(search: string) {
    this.searchChanged.emit(search);
  }

  onSortChange(sort: string) {
    this.sortChanged.emit(sort);
  }

  onClickSearch(): void {
    this.searchClicked = true;
  }

  onClickCloseSearch(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    this.searchClicked = false;
    this.closeSearch = true;
  }

}
