import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { StatisticEntriesResponse, StatisticFullResponse } from './statistic-response.interface';
import { IOption } from 'ng-select';
import * as moment from 'moment';
import { UUID } from 'angular2-uuid';
import { I18nService } from '../../core/i18n/i18n.service';
import { EChartOption } from 'echarts';
import { find } from 'lodash-es';

@Component({
  selector: 'tsl-stats-graph',
  templateUrl: './stats-graph.component.html',
  styleUrls: ['./stats-graph.component.scss']
})
export class StatsGraphComponent implements OnInit {

  @Input() yearly: boolean = false;
  public id: string = 'chart-' + UUID.UUID();
  public duration: string = '30';
  public statsDurations: IOption[] = [];
  isSafari: boolean;
  public stats: any;
  public chartOption: EChartOption;
  public yearData = [];

  constructor(private statisticsService: StatisticsService,
              private i18n: I18nService,
              @Inject(LOCALE_ID) private locale: string) {
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    moment.locale(this.locale);
  }

  ngOnInit() {
    this.setStatsDurations();
    this.loadStats();
  }

  private setUpChart(entries: any) {
    const xAxisData = [];
    const data1 = [];
    const data2 = [];
    const data3 = [];
    const data4 = [];
    const data5 = [];
    const axisDateFormat = this.yearly ? 'MMM' : 'DD';
    const graphType = this.yearly ? 'bar' : undefined;
    const transparency = this.yearly ? '1.0' : '0.1';

    entries.map(entry => {
      if (!this.yearly) {
        const unixDate = moment.unix(entry.date/1000).utcOffset(0, true);
        xAxisData.push(moment(unixDate, axisDateFormat).format('DD MMM'));
        data1.push(entry.values.phone_numbers);
        data2.push(entry.values.city_bump);
        data3.push(entry.values.country_bump);
        data4.push(entry.values.views);
        data5.push(entry.values.chats);
      } else {
        xAxisData.push(moment(entry.date, 'YYY-MM-DD').format(axisDateFormat));
        data1.push(entry.phone_numbers);
        data2.push(entry.city_bump);
        data3.push(entry.country_bump);
        data4.push(entry.views);
        data5.push(entry.chats);
      }

    });
    this.chartOption = {
      title: {
        show: xAxisData.length === 0,
        textStyle: {
            color: "grey",
            fontSize: 20
        },
        text: this.i18n.getTranslations('nodata'),
        left: "center",
        top: "center"
      },
      legend: {
        data: [this.i18n.getTranslations('phonesShared'), this.i18n.getTranslations('citybump'), this.i18n.getTranslations('countrybump'), this.i18n.getTranslations('views'), this.i18n.getTranslations('chats')],
        align: 'left',
        textStyle: {
          color: '#000000'
        },
        icon: 'circle'
      },
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
          name: this.i18n.getTranslations('citybump'),
          type: graphType || 'line',
          smooth: true,
          sampling: 'average',
          itemStyle: {
              color: `rgba(19, 193, 172, ${transparency})`
          },
          areaStyle: {
            color: 'rgba(19, 193, 172, 0.2)'
          },
          data: data2,
          animationDelay: function (idx) {
            return idx * 100;
          }
        },
        {
          name: this.i18n.getTranslations('countrybump'),
          type: graphType || 'line',
          smooth: true,
          sampling: 'average',
          itemStyle: {
            color: `rgba(86, 172, 255, ${transparency})`
          },
          areaStyle: {
            color: 'rgba(86, 172, 255, 0.2)'
          },
          data: data3,
          animationDelay: function (idx) {
            return idx * 170;
          }
        },
        {
          name: this.i18n.getTranslations('views'),
          type: graphType || 'line',
          itemStyle: {
            color: 'rgb(144, 164, 174)'
          },
          data: data4,
          animationDelay: function (idx) {
            return idx * 10 + 250;
          }
        },
        {
          name: this.i18n.getTranslations('chats'),
          type: graphType || 'bar',
          itemStyle: {
            color: 'rgb(61, 170, 191)'
          },
          data: data5,
          animationDelay: function (idx) {
            return idx * 10 + 300;
          }
        },
        {
          name: this.i18n.getTranslations('phonesShared'),
          type: graphType || 'bar',
          itemStyle: {
            color: 'rgb(255, 178, 56)'
          },
          data: data1,
          animationDelay: function (idx) {
            return idx * 10;
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
    if (this.yearly) {
      this.duration = '365';
    }
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
      if (this.yearly) {
        this.yearData = [];
        response.entries.forEach((entry: StatisticEntriesResponse) => {
          const unixDate = moment.unix(+entry.date/1000).utcOffset(0, true);
          const validDate = moment(unixDate).format('YYYY-MM-01');
          const yearlyEntries = find(this.yearData, {date: validDate});
          if (yearlyEntries) {
            yearlyEntries.phone_numbers += entry.values.phone_numbers || 0;
            yearlyEntries.views += entry.values.views || 0;
            yearlyEntries.chats += entry.values.chats || 0;
            yearlyEntries.city_bump += entry.values.city_bump || 0;
            yearlyEntries.country_bump += entry.values.country_bump || 0;
          } else {
            this.yearData.push({
              date: validDate,
              phone_numbers: entry.values.phone_numbers || 0,
              views: entry.values.views || 0,
              chats: entry.values.chats || 0,
              city_bump: entry.values.city_bump || 0,
              country_bump: entry.values.country_bump || 0
            })
          }
        });
        this.setUpChart(this.yearData);
      } else {
        this.setUpChart(response.entries);
      }
    });
  }

  onStatsPeriodChange() {
    this.loadStats();
  }

}
