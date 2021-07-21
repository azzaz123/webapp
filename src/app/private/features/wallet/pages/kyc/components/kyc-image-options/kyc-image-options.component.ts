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
    // TODO: We need to ask Miquel for the copys		Date: 2021/07/21
    return this.isMobile
      ? $localize`:@@kyc_take_images_mobile:Take a picture with your camera`
      : $localize`:@@kyc_take_images_desktop:Take a picture with your webcam`;
  }

  get isMobile(): boolean {
    return this.deviceDetectorService.isMobile();
  }
}
