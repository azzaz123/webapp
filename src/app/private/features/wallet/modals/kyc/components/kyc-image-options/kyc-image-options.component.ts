import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() takeImageOptionChange: EventEmitter<KYC_TAKE_IMAGE_OPTIONS> = new EventEmitter();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  public readonly KYC_TAKE_IMAGE_OPTIONS = KYC_TAKE_IMAGE_OPTIONS;
  public imageMethod: KYC_TAKE_IMAGE_OPTIONS;

  constructor(private deviceDetectorService: DeviceDetectorService) {}

  ngOnInit() {
    this.imageMethod = this.isDesktop ? KYC_TAKE_IMAGE_OPTIONS.UPLOAD : KYC_TAKE_IMAGE_OPTIONS.SHOOT;
  }

  public changeImageMethod(imageMethod: KYC_TAKE_IMAGE_OPTIONS): void {
    this.imageMethod = imageMethod;
  }

  get isDesktop(): boolean {
    return this.deviceDetectorService.isDesktop();
  }
}
