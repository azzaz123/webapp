import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tsl-kyc-image-options',
  templateUrl: './kyc-image-options.component.html',
  styleUrls: ['./kyc-image-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCImageOptionsComponent implements OnInit {
  @Input() imagesToRequest: number;
  @Output() goBack: EventEmitter<void> = new EventEmitter();
  @Output() goNext: EventEmitter<void> = new EventEmitter();

  public imageMethod: 'uploadImage' | 'takeImage';

  constructor(private deviceDetectorService: DeviceDetectorService) {}

  ngOnInit() {
    this.imageMethod = this.isMobile ? 'takeImage' : 'uploadImage';
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
