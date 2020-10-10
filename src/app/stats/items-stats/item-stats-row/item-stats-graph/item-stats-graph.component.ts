import { AfterViewInit, Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { ItemStatisticEntriesResponse, ItemStatisticFullResponse } from './item-stats-response.interface';
import { Item } from '../../../../core/item/item';
import { I18nService } from '../../../../core/i18n/i18n.service';
import { EChartOption } from 'echarts';
import * as moment from 'moment';
import { UuidService } from '../../../../core/uuid/uuid.service';

const GRAPH_COLORS = {
  CHAT: '#EEAA42',
  VIEWS: '#FFEFD7',
  FAVS: '#f99bb5',
  CHAT_BUMPED: '#3CCFBD',
  VIEWS_BUMPED: '#E5FBF5',
  FAVS_BUMPED: '#8FE3D8'
};

@Component({
  selector: 'tsl-item-stats-graph',
  templateUrl: './item-stats-graph.component.html',
  styleUrls: ['./item-stats-graph.component.scss']
})
export class ItemStatsGraphComponent implements OnInit {

  @Input() type: string;
  @Input() item: Item;
  @Input() statsData: ItemStatisticFullResponse;
  public id: string = 'chart-' + this.uuidService.getUUID();
  public chartOption: EChartOption;

  constructor(private i18n: I18nService,
    private uuidService: UuidService,
    @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.loadStats();
  }

  private setUpChart(entries: any) {
    const xAxisData = [];
    const data1 = [];
    const data2 = [];
    const data3 = [];
    let colorFavs = '';
    let colorChats = '';
    let colorViews = '';

    entries.map(entry => {
      const unixDate = moment.unix(entry.date / 1000).utcOffset(0, true);
      xAxisData.push(moment(unixDate, 'DD').format('DD MMM'));
      if (this.type === 'favs') {
        data1.push(entry.favs);
      } else {
        data2.push(entry.views);
        data3.push(entry.chats);
      }
      colorFavs = entry.bumped ? GRAPH_COLORS.FAVS_BUMPED : GRAPH_COLORS.FAVS;
      colorChats = entry.bumped ? GRAPH_COLORS.CHAT_BUMPED : GRAPH_COLORS.CHAT;
      colorViews = entry.bumped ? GRAPH_COLORS.VIEWS_BUMPED : GRAPH_COLORS.VIEWS;
    });
    this.chartOption = {
      tooltip: {
        show: true,
        trigger: 'axis',
        backgroundColor: 'rgba(250, 250, 250, 0.9)',
        textStyle: {
          fontSize: 12,
          color: '#000000'
        },
      },
      toolbox: {
        show: false
      },
      legend: {
        show: false,
        selected: {
          'Favoritos': this.type === 'favs',
          'Visualizaciones': this.type !== 'favs',
          'Mensajes': this.type !== 'favs'
        }
      },
      grid: {
        left: 50,
        right: 50,
        top: 20,
        height: '50%'
      },
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false
        },
        nameTextStyle: {
          color: 'rgba(19, 193, 172, 1.0)'
        },
        axisLine: {
          lineStyle: {
            color: '#90A4AE'
          }
        }
      },
      yAxis: {
        show: false
      },
      series: [
        {
          name: this.i18n.getTranslations('favorites'),
          type: 'bar',
          smooth: true,
          sampling: 'average',
          itemStyle: {
            color: colorFavs
          },
          hoverAnimation: true,
          data: data1,
          animationDelay: function (idx) {
            return idx * 100;
          }
        },
        {
          name: this.i18n.getTranslations('views'),
          type: 'bar',
          smooth: true,
          sampling: 'average',
          itemStyle: {
            color: colorViews
          },
          data: data2,
          animationDelay: function (idx) {
            return idx * 170;
          }
        },
        {
          name: this.i18n.getTranslations('chats'),
          type: 'bar',
          itemStyle: {
            color: colorChats
          },
          data: data3,
          animationDelay: function (idx) {
            return idx * 10 + 250;
          }
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5;
      }
    };
  }

  private loadStats() {
    const entries = [];
    this.statsData.entries.forEach((entry: ItemStatisticEntriesResponse) => {
      entries.push({
        date: +entry.date,
        favs: entry.values && entry.values.favs || 0,
        views: entry.values && entry.values.views || 0,
        chats: entry.values && entry.values.chats || 0,
        bumped: entry.bumped
      });
    });
    this.setUpChart(entries);
  }

}
