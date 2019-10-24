import { Component, Inject, Input, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';
import { StatisticsService } from './statistics.service';
import { StatisticEntriesResponse, StatisticFullResponse } from './statistic-response.interface';
import { IOption } from 'ng-select';
import * as moment from 'moment';
import { find } from 'lodash';
import { UUID } from 'angular2-uuid';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'tsl-stats-graph',
  templateUrl: './stats-graph.component.html',
  styleUrls: ['./stats-graph.component.scss']
})
export class StatsGraphComponent implements OnInit, OnDestroy {

  @Input() yearly: boolean = false;
  public id: string = 'chart-' + UUID.UUID();
  public duration: string = '30';
  public statsDurations: IOption[] = [];
  isSafari: boolean;
  private chart: AmChart;
  private chartOptions: any = {
    'type': 'serial',
    'categoryField': 'date',
    'dataDateFormat': '',
    'colors': [
      '#90a4ae',
      '#3daabf',
      '#ffb238',
      '#13C1AC',
      '#56acff'
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
          'format': 'D'
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
      'axisAlpha': 0,
      'gridAlpha': 0,
      'markPeriodChange': false,
      'minorGridAlpha': 0,
      'color': '#90A4AE',
      'fontSize': 10,
      'centerLabels': true,
      'minHorizontalGap': 5
    },
    'chartCursor': {
      'valueLineAlpha': 0.2,
      'categoryBalloonDateFormat': 'EEEE DD',
      'categoryBalloonColor': '#607D8B',
      'cursorAlpha': 0.1,
      'cursorColor':'#000000',
      'fullWidth':true,
      'zoomable': false
    },
    'trendLines': [],
    'graphs': [
      {
        'behindColumns': true,
        'bullet': 'round',
        'bulletBorderAlpha': 1,
        'bulletBorderColor': '#90A4AE',
        'bulletBorderThickness': 1,
        'bulletColor': '#FFFFFF',
        'bulletSize': 4,
        'cursorBulletAlpha': 0,
        'id': 'views',
        'labelText': '',
        'minDistance': 0,
        'title': 'Views',
        'type': 'smoothedLine',
        'valueField': 'views',
        'valueAxis': 'ValueAxisViews',
        'balloonText': '[[title]]: <b>[[value]]</b>',
      }
    ],
    'guides': [],
    'valueAxes': [
      {
        'id': 'ValueAxisGeneral',
        'color': '#607D8B',
        'fontSize': 8,
        'title': '',
        'gridColor': '#ECEFF1'
      },
      {
        'id': 'ValueAxisViews',
        'color': '#607D8B',
        'fontSize': 8,
        'title': '',
        'position': 'right',
        'synchronizationMultiplier': 1,
        'synchronizeWith': 'ValueAxisGeneral',
        'gridColor': '#ECEFF1'
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
      'align': 'right',
      'equalWidths': false,
      'autoMargins': false,
      'marginLeft': 0,
      'marginBottom': 30,
      'marginRight': 20,
      'fontSize': 14,
      'spacing': 15,
      'position': 'top',
      'rollOverGraphAlpha': 0.75,
      'valueWidth': 30,
      'valueText': '',
      'switchable': false
    },
    'titles': [],
    'dataProvider': []
  };

  constructor(private AmCharts: AmChartsService,
              private statisticsService: StatisticsService,
              private i18n: I18nService,
              @Inject(LOCALE_ID) private locale: string) {
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  ngOnInit() {
    this.setChartOptions();
    this.setStatsDurations();
    this.loadStats();
  }

  private setChartOptions() {
    const columnGraphOptions = {
      'cornerRadiusTop': 4,
      'fillAlphas': 1,
      'fixedColumnWidth': 4,
      'type': 'column',
      'lineAlpha': 0,
      'balloonText': '[[title]]: <b>[[value]]</b>'
    };
    const lineGraphOptions = {
      'behindColumns': true,
      'lineAlpha': 0,
      'type': 'smoothedLine',
      'fillAlphas': 1,
      'balloonText': '[[title]]: <b>[[value]]</b>'
    };
    this.chartOptions.graphs.push({
      ...columnGraphOptions,
      'id': 'Messages',
      'title': 'Messages',
      'valueField': 'chats'
    });
    this.chartOptions.graphs.push({
      ...columnGraphOptions,
      'id': 'Calls',
      'title': 'Calls',
      'valueField': 'phone_numbers'
    });
    if (this.yearly) {
      this.duration = '365';
      this.chartOptions.categoryAxis.minPeriod = 'MM';
      this.chartOptions.categoryAxis.boldLabels = true;
      this.chartOptions.chartCursor.categoryBalloonDateFormat = 'MMM';
      this.chartOptions.graphs.push({
        ...columnGraphOptions,
        'id': 'city_bump',
        'title': 'City Featured',
        'valueField': 'city_bump'
      });
      this.chartOptions.graphs.push({
        ...columnGraphOptions,
        'id': 'CountryFeatured',
        'title': 'Country Featured',
        'valueField': 'country_bump',
        'fillColors': '#b5d7f8',
        'legendColor': '#56acff'
      });
    } else {
      this.chartOptions.graphs.push({
        ...lineGraphOptions,
        'id': 'city_bump',
        'title': 'City Featured',
        'valueField': 'city_bump',
        'fillColors': this.isSafari ? 'rgba(19, 193, 172, 0.2)' : ['rgba(43, 226, 214, 0.4)', 'rgba(19, 193, 172, 0.15)'],
        'legendColor': '#13C1AC'
      });
      this.chartOptions.graphs.push({
        ...lineGraphOptions,
        'id': 'CountryFeatured',
        'title': 'Country Featured',
        'valueField': 'country_bump',
        'fillColors': this.isSafari ? 'rgba(86, 172, 255, 0.2)' : ['rgba(143, 214, 255, 0.58)', 'rgba(86, 172, 255, 0.16)'],
        'legendColor': '#56acff'
      });
      this.chartOptions.chartCursor.categoryBalloonFunction = function(date) {
        return date.toLocaleDateString(this.locale, { weekday: 'long', day: 'numeric' });
      };
    }
    if (this.locale === 'es') {
      this.AmCharts.shortMonthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.AmCharts.dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      this.chartOptions.graphs[0].title = this.i18n.getTranslations('views');
      this.chartOptions.graphs[1].title = this.i18n.getTranslations('messages');
      this.chartOptions.graphs[2].title = this.i18n.getTranslations('phoneCalls');
      this.chartOptions.graphs[3].title = this.i18n.getTranslations('cityFeatured');
      this.chartOptions.graphs[4].title = this.i18n.getTranslations('countryFeatured');
    }
    if (this.duration === '30') {
      this.chartOptions.graphs[1].fixedColumnWidth = 4;
      this.chartOptions.graphs[2].fixedColumnWidth = 4;
    } else if (this.duration === '7') {
      this.chartOptions.graphs[1].fixedColumnWidth = 8;
      this.chartOptions.graphs[2].fixedColumnWidth = 8;
    } else {
      if (this.duration === '15' || this.duration === '365') {
        this.chartOptions.graphs[1].fixedColumnWidth = 6;
        this.chartOptions.graphs[2].fixedColumnWidth = 6;
        this.chartOptions.graphs[3].fixedColumnWidth = 6;
        this.chartOptions.graphs[4].fixedColumnWidth = 6;
      }
    }
  }

  private setStatsDurations() {
    this.statsDurations = [{
      label: this.i18n.getTranslations('last30Days'),
      value: '30'
    }, {
      label: this.i18n.getTranslations('last15Days'),
      value: '15'
    }, {
      label: this.i18n.getTranslations('last7Days'),
      value: '7'
    }];
  }

  private loadStats() {
    this.statisticsService.getStatistics(this.duration).subscribe((response: StatisticFullResponse) => {
      this.chartOptions.dataProvider = [];
      response.entries.forEach((entry: StatisticEntriesResponse) => {
        const date = this.yearly ? moment(+entry.date).format('YYYY-MM-01') : +entry.date;
        const monthlyOption = find(this.chartOptions.dataProvider, {date: date});
        if (monthlyOption && this.yearly) {
          monthlyOption.phone_numbers += entry.values.phone_numbers || 0;
          monthlyOption.views += entry.values.views || 0;
          monthlyOption.chats += entry.values.chats || 0;
          monthlyOption.city_bump += entry.values.city_bump || 0;
          monthlyOption.country_bump += entry.values.country_bump || 0;
        } else {
          this.chartOptions.dataProvider.push({
            date: date,
            phone_numbers: entry.values.phone_numbers || 0,
            views: entry.values.views || 0,
            chats: entry.values.chats || 0,
            city_bump: entry.values.city_bump || 0,
            country_bump: entry.values.country_bump || 0
          })
        }
      });
      this.calculateSynchMultiplier(this.chartOptions.dataProvider);
      this.chart = this.AmCharts.makeChart(this.id, this.chartOptions);
    });
  }

  calculateSynchMultiplier(entries: any[]) {
    let values: any = {
      sold: [],
      phone_numbers: [],
      chats: [],
      city_bump: [],
      country_bump: []
    };
    let viewsValues: number[] = [];
    let maxes: number[] = [];
    entries.forEach((entry: any) => {
      if (entry.sold) {
        values.sold.push(entry.sold);
      }
      if (entry.phone_numbers) {
        values.phone_numbers.push(entry.phone_numbers);
      }
      if (entry.chats) {
        values.chats.push(entry.chats);
      }
      if (entry.city_bump) {
        values.city_bump.push(entry.city_bump);
      }
      if (entry.country_bump) {
        values.country_bump.push(entry.country_bump);
      }
      if (entry.views) {
        viewsValues.push(entry.views);
      }
    });
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        maxes.push(Math.max(...values[key]));
      }
    }
    const maxValue: number = Math.max(...maxes);
    const maxViewsValue: number = Math.max(...viewsValues);
    const multiplier: number = Math.ceil(maxViewsValue / maxValue);
    if (multiplier) {
      this.chartOptions.valueAxes[1].synchronizationMultiplier = multiplier;
    }
  }

  onStatsPeriodChange() {
    this.loadStats();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
