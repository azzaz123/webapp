import { AfterViewInit, Component, Inject, Input, LOCALE_ID, OnDestroy } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';
import { UUID } from 'angular2-uuid';
import { ItemStatsService } from './item-stats.service';
import { ItemStatisticEntriesResponse, ItemStatisticFullResponse } from './item-stats-response.interface';

@Component({
  selector: 'tsl-item-stats-graph',
  templateUrl: './item-stats-graph.component.html',
  styleUrls: ['./item-stats-graph.component.scss']
})
export class ItemStatsGraphComponent implements AfterViewInit, OnDestroy {

  @Input() type: string;
  public id: string = 'chart-' + UUID.UUID();
  private chart: AmChart;
  private chartOptions: any = {
    'type': 'serial',
    'categoryField': 'date',
    'dataDateFormat': '',
    'colors': [
      '#ecb052',
      '#ffd89b',
      '#71dacd'
    ],
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
      'enabled': true,
      'align': 'left',
      'equalWidths': false,
      'autoMargins': false,
      'marginLeft': 20,
      'marginRight': 0,
      'spacing': 15,
      'position': 'top',
      'rollOverGraphAlpha': 0.75,
      'valueWidth': 30,
      'valueText': '',
      'switchable': false,
      'color': '#253238',
      'fontSize': 12
    },
    'titles': [],
    'dataProvider': []
  };

  constructor(private AmCharts: AmChartsService,
              private itemStatsService: ItemStatsService,
              @Inject(LOCALE_ID) private locale: string) { }

  ngAfterViewInit() {
    this.setChartOptions();
    this.loadStats();
  }

  private setChartOptions() {
    const columnGraphOptions = {
      'fillAlphas': 1,
      'lineAlpha': 0,
      'fixedColumnWidth': 20,
      'type': 'column',
      'balloonText': '[[title]]: <b>[[value]]</b>'
    };
    if (this.type === 'favs') {
      this.chartOptions.colors = ['#ffcbd9', '#71dacd'];
      this.chartOptions.graphs.push({
        ...columnGraphOptions,
        'id': 'Favs',
        'title': 'Favs',
        'valueField': 'favs',
        'fillColorsField': 'colorFavs',
      });
    } else {
      this.chartOptions.graphs.push({
        ...columnGraphOptions,
        'id': 'Chats',
        'title': 'Chats',
        'valueField': 'chats',
        'fillColorsField': 'colorChats',
      });
      this.chartOptions.graphs.push({
        ...columnGraphOptions,
        'id': 'Views',
        'title': 'Views',
        'valueField': 'views',
        'fillColorsField': 'colorViews',
      });
    }
    this.chartOptions.graphs.push({
      ...columnGraphOptions,
      'id': 'City Bump',
      'title': 'City Bump'
    });
  }

  private loadStats() {
    this.itemStatsService.getStatistics().subscribe((response: ItemStatisticFullResponse) => {
      this.chartOptions.dataProvider = [];
      response.entries.forEach((entry: ItemStatisticEntriesResponse) => {
        this.chartOptions.dataProvider.push({
          date: +entry.date,
          favs: entry.values.favs || 0, // TODO: replace
          views: entry.values.views || 0,
          chats: entry.values.chats || 0,
          colorChats: entry.bumped ? '#0f9989' : '#ecb052',
          colorViews: entry.bumped ? '#71dacd' : '#ffd89b',
          colorFavs: entry.bumped ? '#71dacd' : '#ffcbd9'
        });
      });
      this.chart = this.AmCharts.makeChart(this.id, this.chartOptions);
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
