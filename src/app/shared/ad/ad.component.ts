import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'tsl-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent implements OnInit, AfterViewInit {

  @Input() slotid: string;
  @Input() height: number;
  @Input() width: number;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    googletag.cmd.push(() => {
      googletag.display(this.slotid);
    });
  }

}
