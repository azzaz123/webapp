import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { PublicFooterService } from './core/services/footer/public-footer.service';

@Component({
  selector: 'tsl-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent {
  public showFooter$: Observable<boolean> = this.publicFooterService.showFooter$;

  constructor(private publicFooterService: PublicFooterService) {}
}
