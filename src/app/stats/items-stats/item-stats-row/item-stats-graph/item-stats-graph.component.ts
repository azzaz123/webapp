import { AfterViewInit, Component, Inject, Input, LOCALE_ID, OnDestroy } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { ItemStatsService } from './item-stats.service';
import { ItemStatisticEntriesResponse, ItemStatisticFullResponse } from './item-stats-response.interface';
import { Item } from '../../../../core/item/item';
import { I18nService } from '../../../../core/i18n/i18n.service';
import { EChartOption } from 'echarts';
import * as moment from 'moment';
import { ITEM_DATA_V4 } from 'tests/item.fixtures.spec';

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
export class ItemStatsGraphComponent implements AfterViewInit, OnDestroy {

  @Input() type: string;
  @Input() item: Item;
  @Input() statsData: ItemStatisticFullResponse;
  public id: string = 'chart-' + UUID.UUID();
  public chartOption: EChartOption;

  constructor(private i18n: I18nService,
              @Inject(LOCALE_ID) private locale: string) { }

  ngAfterViewInit() {
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
        const unixDate = moment.unix(entry.date/1000).utcOffset(0, true);
        xAxisData.push(moment(unixDate).format('YYYY-MM-DDTHH:mm'));
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
      grid:{
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
        axisLabel: {
          formatter: (function(value){
              return moment(value).format('DD');
          })
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
        nameTextStyle: {
          color: 'rgba(19, 193, 172, 1.0)'
        },
        axisLine: {
          lineStyle: {
              color: '#90A4AE'
          }
        },
        splitLine: {
          lineStyle: {
              color: 'rgba(232, 232, 232, 0.5)'
          }
        }
      },
      series: [
        {
          name: 'Favoritos',
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
          name: 'Visualizaciones',
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
          name: 'Mensajes',
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

  /*private setChartOptions() {
    const balloonFunction = (graphDataItem, graph) => {
      let balloon = '<div style="text-align:left">';
      if (graphDataItem.dataContext.bumped) {
        balloon += '<b style="color:#13c1ac">' + this.i18n.getTranslations('featured') + '</b><br />';
      }
      balloon += graph.title + ': <b>' + graphDataItem.values.value + '</b>';
      return balloon + '</div>';
    };
    const columnGraphOptions = {
      'fillAlphas': 1,
      'lineAlpha': 0,
      'fixedColumnWidth': 20,
      'type': 'column',
      'balloonFunction': balloonFunction
    };
    if (this.type === 'favs') {
      this.chartOptions.graphs.push({
        ...columnGraphOptions,
        'id': 'Favs',
        'title': this.i18n.getTranslations('favorites'),
        'valueField': 'favs',
        'fillColorsField': 'colorFavs'
      });
    } else {
      this.chartOptions.graphs.push({
        ...columnGraphOptions,
        'id': 'Chats',
        'title': this.i18n.getTranslations('chats'),
        'valueField': 'chats',
        'fillColorsField': 'colorChats',
      });
      this.chartOptions.graphs.push({
        ...columnGraphOptions,
        'id': 'Views',
        'title': this.i18n.getTranslations('views'),
        'valueField': 'views',
        'fillColorsField': 'colorViews',
      });
    }
    this.chartOptions.chartCursor.categoryBalloonFunction = function(date) {
      return date.toLocaleDateString(this.locale, { weekday: 'long', day: 'numeric' });
    };
    if (this.locale === 'es') {
      this.AmCharts.dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    }
    this.AmCharts.useUTC = true;
  }*/

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

  ngOnDestroy() {
  }

}
