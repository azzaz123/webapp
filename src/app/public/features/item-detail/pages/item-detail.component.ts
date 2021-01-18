import { Component, OnInit } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { ItemFlags } from '@core/item/item-response.interface';

@Component({
  selector: 'tsl-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  public deviceType = DeviceType;
  public device: DeviceType;
  // TODO: Delete mock object		Date: 2021/01/18
  itemFlags: ItemFlags = {
    pending: false,
    sold: false,
    favorite: false,
    reserved: false,
    removed: false,
    banned: false,
    expired: false,
    review_done: false,
    bumped: true,
    highlighted: false,
    onhold: true,
  };

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.device = this.deviceService.getDeviceType();
  }
}
