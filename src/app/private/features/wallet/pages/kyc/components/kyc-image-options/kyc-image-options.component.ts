import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { KYC_TAKE_IMAGE_OPTIONS } from './kyc-image-options.enum';

@Component({
  selector: 'tsl-kyc-image-options',
  templateUrl: './kyc-image-options.component.html',
  styleUrls: ['./kyc-image-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCImageOptionsComponent implements OnInit {
  @Output() goBack: EventEmitter<void> = new EventEmitter();
  @Output() goNext: EventEmitter<void> = new EventEmitter();

  public readonly KYC_TAKE_IMAGE_OPTIONS = KYC_TAKE_IMAGE_OPTIONS;
  public imageMethod: KYC_TAKE_IMAGE_OPTIONS;

  constructor(private deviceDetectorService: DeviceDetectorService) {}

  ngOnInit() {
    this.imageMethod = this.isMobile ? KYC_TAKE_IMAGE_OPTIONS.SHOOT : KYC_TAKE_IMAGE_OPTIONS.UPLOAD;
  }

  get takeImageMessage(): string {
    return this.isMobile
      ? $localize`:@@kyc_take_images_mobile:Saca una foto con tu cámara`
      : $localize`:@@kyc_take_images_desktop:Haz una foto con tu webcam`;
  }

  get isMobile(): boolean {
    return this.deviceDetectorService.isMobile();
  }
}
