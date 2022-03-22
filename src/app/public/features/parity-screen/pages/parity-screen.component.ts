import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tsl-parity',
  templateUrl: './parity-screen.component.html',
  styleUrls: ['./parity-screen.component.scss'],
})
export class ParityScreenComponent implements OnInit {
  constructor() {}

  public ngOnInit(): void {
    console.log('PARITY SCREEN');
  }
}
