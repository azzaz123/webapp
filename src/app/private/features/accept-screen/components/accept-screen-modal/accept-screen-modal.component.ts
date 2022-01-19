import { Component, OnInit } from '@angular/core';
import { AcceptScreenService } from '../../services/accept-screen.service';
import { ActivatedRoute } from '@angular/router';
import { PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';

@Component({
  selector: 'tsl-accept-screen-modal',
  templateUrl: './accept-screen-modal.component.html',
  styleUrls: ['./accept-screen-modal.component.scss'],
})
export class AcceptScreenModalComponent implements OnInit {
  constructor(private route: ActivatedRoute, private acceptScreenService: AcceptScreenService) {}

  ngOnInit(): void {
    const requestId: string = this.route.snapshot.paramMap.get(PRIVATE_PATH_PARAMS.ID);
    this.acceptScreenService.initialize(requestId);
  }
}
