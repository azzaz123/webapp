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
  @Output() clickedLink = new EventEmitter<string>();
  @Output() searchChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    if (!this.selectedLinkId && this.navLinks && this.navLinks[0]) {
      this.selectedLinkId = this.navLinks[0].id;
    }
  }

  onClickNavLink(navLink: NavLink) {
    this.clickedLink.emit(navLink.id);
  }

  onSearchChange(search: string) {
    this.searchChanged.emit(search);
  }

}
