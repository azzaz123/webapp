import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';

import { IOption } from '@shared/dropdown/utils/option.interface';
import * as moment from 'moment';
import { EChartOption } from 'echarts';
import { find } from 'lodash-es';
import { I18nService } from '@core/i18n/i18n.service';
import { UuidService } from '@core/uuid/uuid.service';
import { StatisticsService } from '../../core/services/statistics.service';
import { StatisticFullResponse, StatisticEntriesResponse } from '../../core/statistic-response.interface';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  selector: 'tsl-stats-graph',
  templateUrl: './stats-graph.component.html',
  styleUrls: ['./stats-graph.component.scss'],
})
export class StatsGraphComponent implements OnInit {
  @Input() yearly: boolean = false;
  public id: string = 'chart-' + this.uuidService.getUUID();
  public duration: string = '30';
  public statsDurations: IOption[] = [];
  isSafari: boolean;
  public stats: any;
  public chartOption: EChartOption;
  public yearData = [];

  constructor(
    private statisticsService: StatisticsService,
    private uuidService: UuidService,
    private i18n: I18nService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  ngOnInit() {
    this.setStatsDurations();
    this.loadStats();
  }

  onStatsPeriodChange() {
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

    entries.map((entry) => {
      if (!this.yearly) {
        const unixDate = moment.unix(entry.date / 1000).utcOffset(0, true);
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
          color: 'grey',
          fontSize: 20,
        },
        text: this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_NO_DATA),
        left: 'center',
        top: 'center',
      },
      legend: {
        data: [
          this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_PHONES_SHARED),
          this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_CITY_BUMP),
          this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_COUNTRY_BUMP),
          this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_CHATS),
          this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_VIEWS),
        ],
        align: 'left',
        textStyle: {
          color: '#000000',
        },
        icon: 'circle',
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        backgroundColor: 'rgba(250, 250, 250, 0.9)',
        textStyle: {
          fontSize: 12,
          color: '#000000',
        },
      },
      toolbox: {
        show: false,
      },
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
        nameTextStyle: {
          color: 'rgba(19, 193, 172, 1.0)',
        },
        axisLine: {
          lineStyle: {
            color: '#90A4AE',
          },
        },
      },
      yAxis: {
        nameTextStyle: {
          color: 'rgba(19, 193, 172, 1.0)',
        },
        axisLine: {
          lineStyle: {
            color: '#90A4AE',
          },
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(232, 232, 232, 0.5)',
          },
        },
      },
      series: [
        {
          name: this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_CITY_BUMP),
          type: graphType || 'line',
          smooth: true,
          sampling: 'average',
          itemStyle: {
            color: `rgba(19, 193, 172, ${transparency})`,
          },
          areaStyle: {
            color: 'rgba(19, 193, 172, 0.2)',
          },
          data: data2,
          animationDelay: function (idx) {
            return idx * 100;
          },
        },
        {
          name: this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_COUNTRY_BUMP),
          type: graphType || 'line',
          smooth: true,
          sampling: 'average',
          itemStyle: {
            color: `rgba(86, 172, 255, ${transparency})`,
          },
          areaStyle: {
            color: 'rgba(86, 172, 255, 0.2)',
          },
          data: data3,
          animationDelay: function (idx) {
            return idx * 170;
          },
        },
        {
          name: this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_VIEWS),
          type: graphType || 'line',
          itemStyle: {
            color: 'rgb(144, 164, 174)',
          },
          data: data4,
          animationDelay: function (idx) {
            return idx * 10 + 250;
          },
        },
        {
          name: this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_CHATS),
          type: graphType || 'bar',
          itemStyle: {
            color: 'rgb(61, 170, 191)',
          },
          data: data5,
          animationDelay: function (idx) {
            return idx * 10 + 300;
          },
        },
        {
          name: this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_PHONES_SHARED),
          type: graphType || 'bar',
          itemStyle: {
            color: 'rgb(255, 178, 56)',
          },
          data: data1,
          animationDelay: function (idx) {
            return idx * 10;
          },
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5;
      },
    };
  }

  private setStatsDurations() {
    if (this.yearly) {
      this.duration = '365';
    }
    this.statsDurations = [
      {
        label: this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_LAST_THIRTY_DAYS),
        value: '30',
      },
      {
        label: this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_LAST_FIFTEEN_DAYS),
        value: '15',
      },
      {
        label: this.i18n.translate(TRANSLATION_KEY.STATS_GRAPH_LAST_SEVEN_DAYS),
        value: '7',
      },
    ];
  }

  private loadStats() {
    this.statisticsService.getStatistics(this.duration).subscribe((response: StatisticFullResponse) => {
      if (this.yearly) {
        this.yearData = [];
        response.entries.forEach((entry: StatisticEntriesResponse) => {
          const unixDate = moment.unix(+entry.date / 1000).utcOffset(0, true);
          const validDate = moment(unixDate).format('YYYY-MM-01');
          const yearlyEntries = find(this.yearData, { date: validDate });
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
              country_bump: entry.values.country_bump || 0,
            });
          }
        });
        this.setUpChart(this.yearData);
      } else {
        this.setUpChart(response.entries);
      }
    });
  }
}
