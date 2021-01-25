import { Component, OnInit } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { Item } from '@core/item/item';
import { ItemFlags } from '@core/item/item-response.interface';
import { MOCK_ITEM_1 } from '@public/shared/components/item-card/item-card.mock.stories';

@Component({
  selector: 'tsl-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  public deviceType = DeviceType;
  public device: DeviceType;
  public itemFlags: ItemFlags;
  public images: string[];
  public item: Item = MOCK_ITEM_1;

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.device = this.deviceService.getDeviceType();
  }
}
