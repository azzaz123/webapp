import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';

@Component({
  selector: 'tsl-wallacoins-tutorial',
  templateUrl: './wallacoins-tutorial.component.html',
  styleUrls: ['./wallacoins-tutorial.component.scss'],
})
export class WallacoinsTutorialComponent implements OnInit {
  @ViewChild(NgbCarousel, { static: true }) public carousel: NgbCarousel;
  public isLast: boolean;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  public onSlide($event: NgbSlideEvent) {
    this.isLast = $event.current === 'ngb-slide-2';
  }
}
