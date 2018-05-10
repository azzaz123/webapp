import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../core/http/http.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'tsl-gdpr-modal',
  templateUrl: './gdpr-modal.component.html',
  styleUrls: ['./gdpr-modal.component.scss']
})
export class GdprModalComponent implements OnInit {

  public allowSegmentation = false;
  public acceptPrivacy = false;
  public gdprText = '';

  constructor(
    public activeModal: NgbActiveModal,
    public http: HttpService
  ) { }

  ngOnInit() {
    this.getGDPRText();
  }

  getGDPRText() {
    this.http.getNoBase(environment.siteUrl + 'rest/gdpr/popup/' + this.getCurrentLanguage())
      .map((res) => res.text())
      .subscribe((gdprText) => {
        this.gdprText = gdprText;
      });
  }

  private getCurrentLanguage() {
    switch (this.getSubdomain(window.location.hostname)) {
      case 'web-en':
        return 'gb';
      default:
        return 'es';
    }
  }

  private getSubdomain(hostname) {
    const regexParse = /[a-z-0-9]{2,63}.[a-z.]{2,5}$/;
    const urlParts = regexParse.exec(hostname);
    return hostname.replace(urlParts[0],'').slice(0, -1);
  }


}
