import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tsl-kyc-images',
  templateUrl: './kyc-images.component.html',
  styleUrls: ['./kyc-images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCImagesComponent implements OnInit {
  @Input() imagesToRequest: number;
  @Output() goBack: EventEmitter<void> = new EventEmitter();

  public KYCImagesForm: FormGroup;

  constructor(private deviceDetectorService: DeviceDetectorService, private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  get takeImageMessage(): string {
    return this.isMobile
      ? $localize`:@@kyc_take_images_mobile:Saca una foto con tu cámara`
      : $localize`:@@kyc_take_images_desktop:Haz una foto con tu webcam`;
  }

  get isMobile(): boolean {
    return this.deviceDetectorService.isMobile();
  }

  private buildForm(): void {
    this.KYCImagesForm = this.fb.group({
      imageMethod: ['', [Validators.required]],
    });
  }
}
