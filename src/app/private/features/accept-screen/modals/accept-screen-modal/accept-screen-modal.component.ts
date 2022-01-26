import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';

@Component({
  selector: 'tsl-accept-screen-modal',
  templateUrl: './accept-screen-modal.component.html',
  styleUrls: ['./accept-screen-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptScreenModalComponent implements OnInit {
  public requestId: string;
  public acceptScreenProperties$: Observable<AcceptScreenProperties>;

  constructor(private route: ActivatedRoute, private acceptScreenStoreService: AcceptScreenStoreService) {}

  ngOnInit(): void {
    this.acceptScreenStoreService.initialize(this.requestId);
    this.acceptScreenProperties$ = this.acceptScreenStoreService.properties$;
  }
}
