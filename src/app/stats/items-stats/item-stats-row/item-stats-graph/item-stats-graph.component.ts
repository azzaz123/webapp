import { AfterViewInit, Component, Inject, Input, LOCALE_ID, OnDestroy } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';
import { UUID } from 'angular2-uuid';
import { ItemStatsService } from './item-stats.service';
import { ItemStatisticEntriesResponse, ItemStatisticFullResponse } from './item-stats-response.interface';
import { Item } from '../../../../core/item/item';
import { I18nService } from '../../../../core/i18n/i18n.service';

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
  private chart: AmChart;
  private chartOptions: any = {
    'type': 'serial',
    'categoryField': 'date',
    'dataDateFormat': '',
    'columnSpacing': 3,
    'addClassNames': true,
    'theme': 'light',
    'categoryAxis': {
      'dateFormats': [
        {
          'period': 'fff',
          'format': 'JJ:NN:SS'
        },
        {
          'period': 'ss',
          'format': 'JJ:NN:SS'
        },
        {
          'period': 'mm',
          'format': 'JJ:NN'
        },
        {
          'period': 'hh',
          'format': 'JJ:NN'
        },
        {
          'period': 'DD',
          'format': 'DD'
        },
        {
          'period': 'WW',
          'format': 'MMM DD'
        },
        {
          'period': 'MM',
          'format': 'MMM'
        },
        {
          'period': 'YYYY',
          'format': 'YYYY'
        }
      ],
      'gridPosition': 'start',
      'parseDates': true,
      'twoLineMode': true,
      'axisAlpha': 1,
      'gridAlpha': 0,
      'markPeriodChange': false,
      'minorGridAlpha': 0,
      'color': '#90A4AE',
      'fontSize': 10,
      'centerLabels': true,
      'minHorizontalGap': 5,
      'axisColor': '#ECEFF1',
      'axisThickness': 4
    },
    'chartCursor': {
      'valueLineAlpha': 0.2,
      'categoryBalloonDateFormat': 'EEEE DD',
      'categoryBalloonColor': '#607D8B',
      'cursorAlpha': 0.66,
      'cursorColor':'#eceff1',
      'fullWidth':true,
      'zoomable': false
    },
    'trendLines': [],
    'graphs': [],
    'guides': [],
    'valueAxes': [
      {
        'id': 'ValueAxisGeneral',
        'color': '#FFFFFF',
        'title': '',
        'stackType': 'regular',
        'axisThickness': 0,
        'gridThickness': 0,
        'ignoreAxisWidth': true
      }
    ],
    'allLabels': [],
    'balloon': {
      'cornerRadius': 4,
      'color': '#607D8B',
      'fillAlpha': 1,
      'shadowAlpha': 0
    },
    'legend': {
      'enabled': false
    },
    'titles': [],
    'dataProvider': []
  };

  constructor(private AmCharts: AmChartsService,
              private i18n: I18nService,
              @Inject(LOCALE_ID) private locale: string) { }

  ngAfterViewInit() {
    this.setChartOptions();
    this.loadStats();
  }

  private setChartOptions() {
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
  }

  private loadStats() {
    console.log('chart op ', this.chartOptions.chartCursor);
    this.chartOptions.dataProvider = [];
    this.statsData.entries.forEach((entry: ItemStatisticEntriesResponse) => {
      this.chartOptions.dataProvider.push({
        date: +entry.date,
        favs: entry.values && entry.values.favs || 0,
        views: entry.values && entry.values.views || 0,
        chats: entry.values && entry.values.chats || 0,
        colorChats: entry.bumped ? GRAPH_COLORS.CHAT_BUMPED : GRAPH_COLORS.CHAT,
        colorViews: entry.bumped ? GRAPH_COLORS.VIEWS_BUMPED : GRAPH_COLORS.VIEWS,
        colorFavs: entry.bumped ? GRAPH_COLORS.FAVS_BUMPED : GRAPH_COLORS.FAVS,
        bumped: entry.bumped
      });
    });
    this.chart = this.AmCharts.makeChart(this.id, this.chartOptions);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
