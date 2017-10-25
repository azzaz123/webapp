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
    console.log(googletag);
    googletag.cmd.push(function()
      { googletag.display('div-gpt-ad-1508490196308-0');}
    );
  }

}
