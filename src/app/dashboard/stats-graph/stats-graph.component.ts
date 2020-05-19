import { Component, Inject, Input, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { StatisticEntriesResponse, StatisticFullResponse } from './statistic-response.interface';
import { IOption } from 'ng-select';
import * as moment from 'moment';
import { UUID } from 'angular2-uuid';
import { I18nService } from '../../core/i18n/i18n.service';
import { EChartOption } from 'echarts';
import { find } from 'lodash';

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
      data5.push(entry.values.chats);
    });
    this.chartOption = {
      legend: {
        data: ['Números de tel.', 'Destacados ciudad', 'Destacados país', 'Visualizaciones', 'Mensajes'],
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
        //formatter: '{a0}: {c0}<br />{a1}: {c1}<br />{a2}: {c2}<br />{a3}: {c3}<br />{a4}: {c4}'
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
          name: 'Destacados ciudad',
          type: 'line',
          smooth: true,
          sampling: 'average',
          itemStyle: {
              color: 'rgba(19, 193, 172, 0.1)'
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
          name: 'Destacados país',
          type: 'line',
          smooth: true,
          sampling: 'average',
          itemStyle: {
            color: 'rgba(86, 172, 255, 0.1)'
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
          name: 'Visualizaciones',
          type: 'line',
          itemStyle: {
            color: 'rgb(144, 164, 174)'
          },
          data: data4,
          animationDelay: function (idx) {
            return idx * 10 + 250;
          }
        },
        {
          name: 'Mensajes',
          type: 'bar',
          itemStyle: {
            color: 'rgb(61, 170, 191)'
          },
          data: data5,
          animationDelay: function (idx) {
            return idx * 10 + 300;
          }
        },
        {
          name: 'Números de tel.',
          type: 'bar',
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
    let yearlyEntries: any = [];
    let data: any = [];
    this.statisticsService.getStatistics(this.duration).subscribe((response: StatisticFullResponse) => {
      if (this.yearly) {
        data = response.entries;
        data.forEach((entry: StatisticEntriesResponse) => {
          console.log('entry ', entry);
          const unixDate = moment.unix(+entry.date/1000).utcOffset(0, true);
          const validDate = moment(unixDate).format('YYYY-MM-01');
          yearlyEntries = find(data, {date: validDate});
          /*yearlyEntries.phone_numbers += entry.values.phone_numbers || 0;
          yearlyEntries.views += entry.values.views || 0;
          yearlyEntries.chats += entry.values.chats || 0;
          yearlyEntries.city_bump += entry.values.city_bump || 0;
          yearlyEntries.country_bump += entry.values.country_bump || 0;*/
          //yearlyEntries.push(entry.values);
        });
        console.log('yearly entries ', yearlyEntries);
      } else {
        this.setUpChart(response.entries);
      }
    });
  }

  onStatsPeriodChange() {
    this.loadStats();
  }

  ngOnDestroy() {
    //destroy chart
  }

}
