import { Component, OnInit } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';

@Component({
  selector: 'tsl-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  device: DeviceType;

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.device = this.deviceService.getDeviceType();
  }
}
