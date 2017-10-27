import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

declare var googletag:any;

@Component({
  selector: 'tsl-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent implements OnInit, AfterViewInit{

  @Input() slotid;
  @Input() height;
  @Input() width;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    googletag.cmd.push(() => {
      googletag.display(this.slotid);
    });
  }

}
