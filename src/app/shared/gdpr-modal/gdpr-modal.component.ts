import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../core/http/http.service';
import { environment } from '../../../environments/environment';
import { PrivacyService } from '../../core/privacy/privacy.service';
import { TrackingService } from '../../core/tracking/tracking.service';

@Component({
  selector: 'tsl-gdpr-modal',
  templateUrl: './gdpr-modal.component.html',
  styleUrls: ['./gdpr-modal.component.scss']
})
export class GdprModalComponent implements OnInit {

  public allowSegmentation = false;
  public acceptPrivacy = false;
  public gdprText = '';
  public showSecondGdrpScreen = false;

  constructor(
    public activeModal: NgbActiveModal,
    public http: HttpService,
    public privacyService: PrivacyService,
    public trackingService: TrackingService
  ) { }

  ngOnInit() {
    this.trackingService.track(TrackingService.GDPR_UNDEFINED_DISPLAY_FIRST_MODAL);
    this.getGDPRText();
  }

  getGDPRText() {
    this.http.getNoBase(environment.siteUrl + 'rest/gdpr/popup/' + this.getCurrentLanguage())
      .map((res) => res.text())
      .subscribe((gdprText) => {
        this.gdprText = gdprText;
      });
  }

  setGRPRPermission() {
    this.privacyService.updatePrivacy({
      gdpr_display: {
        version: '0',
        allow: this.allowSegmentation
      },
      privacy_policy: {
        version: '0',
        allow: this.acceptPrivacy
      }
    }).subscribe(null, null, () => {
      this.trackingService.track(TrackingService.GDPR_ACCEPT_TAP_FIRST_MODAL, {
        AcceptedGDPR: this.allowSegmentation,
        AcceptedPrivacyPolicy: this.acceptPrivacy
      });
      if (!this.allowSegmentation) {
        this.showSecondGdrpScreen = true;
        this.trackingService.track(TrackingService.GDPR_UNDEFINED_DISPLAY_SECOND_MODAL);
      } else {
        this.activeModal.close();
      }
    });
  }

  acceptAllowSegmentation() {
    this.privacyService.updatePrivacy({
      gdpr_display: {
        version: '0',
        allow: true
      }
    }).subscribe(null, null, () => {
      this.trackingService.track(TrackingService.GDPR_ACCEPT_TAP_SECOND_MODAL);
      this.activeModal.close();
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
