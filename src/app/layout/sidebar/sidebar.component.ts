import { Component, OnInit } from '@angular/core';
import { MessageService, UserService } from 'shield';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class SidebarComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}
