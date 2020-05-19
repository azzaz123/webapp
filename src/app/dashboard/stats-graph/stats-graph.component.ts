import { Component, Inject, Input, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { StatisticEntriesResponse, StatisticFullResponse } from './statistic-response.interface';
import { IOption } from 'ng-select';
import * as moment from 'moment';
import { UUID } from 'angular2-uuid';
import { I18nService } from '../../core/i18n/i18n.service';
import { EChartOption } from 'echarts';

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
  public stats: any;
  public chartOption: EChartOption;

  constructor(private statisticsService: StatisticsService,
              private i18n: I18nService,
              @Inject(LOCALE_ID) private locale: string) {
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  ngOnInit() {
    this.setStatsDurations();
    this.loadStats();
  }

  private setUpChart(entries: any) {
    console.log('setUpChart ', entries);
    const xAxisData = [];
    const data1 = [];
    const data2 = [];
    const data3 = [];
    const data4 = [];
    const data5 = [];

    entries.map(entry => {
      const unixDate = moment.unix(entry.date/1000).utcOffset(0, true);
      const validDate = moment(unixDate).format('YYYY-MM-DDTHH:mm');

      xAxisData.push(validDate);
      data1.push(entry.values.phone_numbers);
      data2.push(entry.values.city_bump);
      data3.push(entry.values.country_bump);
      data4.push(entry.values.views);
      data4.push(entry.values.chats);
    });
    this.chartOption = {
      legend: {
        data: ['phoneNumbers', 'cityBumps', 'countryBumps', 'views', 'chats'],
        align: 'left'
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: (function(value){
              return moment(value).format('DD/MM/YY');
          })
        }
      },
      yAxis: {
      },
      series: [
        {
          name: 'phoneNumbers',
          type: 'bar',
          data: data1,
          animationDelay: function (idx) {
            return idx * 10;
          }
        },
        {
          name: 'cityBumps',
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
              color: 'rgb(19, 193, 172)'
          },
          areaStyle: {
            color: 'rgb(19, 193, 172)'
          },
          data: data2,
          animationDelay: function (idx) {
            return idx * 100;
          }
        },
        {
          name: 'countryBumps',
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
            color: 'rgb(86, 172, 255)'
          },
          areaStyle: {
            color: 'rgb(86, 172, 255)'
          },
          data: data3,
          animationDelay: function (idx) {
            return idx * 170;
          }
        },
        {
          name: 'views',
          type: 'line',
          data: data4,
          animationDelay: function (idx) {
            return idx * 10 + 250;
          }
        },
        {
          name: 'chats',
          type: 'bar',
          data: data5,
          animationDelay: function (idx) {
            return idx * 10 + 300;
          }
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5;
      }
    };
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
      this.setUpChart(response.entries);
    });
  }

  onStatsPeriodChange() {
    this.loadStats();
  }

  ngOnDestroy() {
    //destroy chart
  }

}
