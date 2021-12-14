import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } from '@shared/historic-list/enums/historic-element-subdescription-type.enum';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';

@Component({
  selector: 'tsl-historic-element',
  templateUrl: './historic-element.component.html',
  styleUrls: ['./historic-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoricElementComponent implements OnChanges {
  @Input() historicElement: HistoricElement;
  @Input() clickable: boolean = false;
  @Output() clicked: EventEmitter<HistoricElement> = new EventEmitter<HistoricElement>();

  public readonly imageFallback = '/assets/icons/picture.svg';
  public subDescriptionClassname: string = null;

  private readonly mapSubDescriptionTypeToString: Record<HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE, string> = {
    [HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE.NORMAL]: '',
    [HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE.VALID]: 'HistoricElement__subDescription--valid',
    [HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE.ERROR]: 'HistoricElement__subDescription--error',
  };

  ngOnChanges() {
    this.subDescriptionClassname = this.getSubdescriptionClassname();
  }

  public onItemClick(): void {
    this.clicked.emit(this.historicElement);
  }

  private getSubdescriptionClassname(): string | null {
    return this.mapSubDescriptionTypeToString[this.historicElement.subDescription?.type];
  }
}
