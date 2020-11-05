import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss'],
})
export class AdComponent implements AfterViewInit {
  @Input() slotid: string;
  @Input() height: number;
  @Input() width: number;

  ngAfterViewInit() {
    googletag.cmd.push(() => {
      googletag.display(this.slotid);
    });
  }
}
