import { Component, OnDestroy, OnInit } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';
import { StatisticsService } from './statistics.service';
import { StatisticEntriesResponse, StatisticFullResponse } from './statistic-response.interface';

@Component({
  selector: 'tsl-daily-stats-graph',
  templateUrl: './daily-stats-graph.component.html',
  styleUrls: ['./daily-stats-graph.component.scss']
})
export class DailyStatsGraphComponent implements OnInit, OnDestroy {

  private chart: AmChart;
  private chartOptions: any = {
    "type": "serial",
    "categoryField": "date",
    "dataDateFormat": "",
    "colors": [
      "#90a4ae",
      "#13C1AC",
      "#3daabf",
      "#ffb238",
      "#56acff"
    ],
    "startDuration": 1,
    "theme": "light",
    "categoryAxis": {
      "dateFormats": [
        {
          "period": "fff",
          "format": "JJ:NN:SS"
        },
        {
          "period": "ss",
          "format": "JJ:NN:SS"
        },
        {
          "period": "mm",
          "format": "JJ:NN"
        },
        {
          "period": "hh",
          "format": "JJ:NN"
        },
        {
          "period": "DD",
          "format": "MMM DD"
        },
        {
          "period": "WW",
          "format": "MMM DD"
        },
        {
          "period": "MM",
          "format": "MMM"
        },
        {
          "period": "YYYY",
          "format": "YYYY"
        }
      ],
      "gridPosition": "start",
      "parseDates": true,
      "twoLineMode": true,
      "axisAlpha": 0,
      "boldLabels": true,
      "gridAlpha": 0,
      "markPeriodChange": false,
      "minorGridAlpha": 0
    },
    "trendLines": [],
    "graphs": [
      {
        "balloonText": "[[title]] of [[category]]:[[value]]",
        "behindColumns": true,
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletBorderColor": "#90A4AE",
        "bulletBorderThickness": 1,
        "bulletColor": "#FFFFFF",
        "bulletSize": 4,
        "cursorBulletAlpha": 0,
        "id": "views",
        "labelText": "",
        "minDistance": 0,
        "title": "Views",
        "type": "smoothedLine",
        "valueField": "views"
      },
      {
        "behindColumns": true,
        "fillAlphas": 0.36,
        "fillColors": "#13C1AC",
        "fixedColumnWidth": 0,
        "id": "city_bump",
        "lineAlpha": 0,
        "lineThickness": 0,
        "title": "city_bump",
        "topRadius": 0,
        "type": "smoothedLine",
        "valueField": "city_bump"
      },
      {
        "cornerRadiusTop": 4,
        "fillAlphas": 1,
        "fixedColumnWidth": 4,
        "id": "Messages",
        "title": "Messages",
        "topRadius": 0,
        "type": "column",
        "valueField": "chats"
      },
      {
        "cornerRadiusTop": 4,
        "fillAlphas": 1,
        "fixedColumnWidth": 4,
        "id": "Calls",
        "title": "Calls",
        "type": "column",
        "valueField": "phone_numbers"
      },
      {
        "behindColumns": true,
        "fillAlphas": 0.42,
        "id": "CountryFeatured",
        "lineAlpha": 0,
        "title": "Country Featured",
        "type": "smoothedLine",
        "valueField": "country_bump"
      }
    ],
    "guides": [],
    "valueAxes": [
      {
        "id": "ValueAxis-1",
        "color": "#607D8B",
        "fontSize": 8,
        "title": ""
      }
    ],
    "allLabels": [],
    "balloon": {},
    "legend": {
      "enabled": true,
      "align": "right",
      "equalWidths": false,
      "marginLeft": 0,
      "marginRight": 0,
      "position": "top",
      "rollOverGraphAlpha": 0.75,
      "spacing": 0,
      "switchType": "v",
      "valueWidth": 30
    },
    "titles": [],
    "dataProvider": []
  };

  constructor(private AmCharts: AmChartsService,
  private statisticsService: StatisticsService) {}

  ngOnInit() {
    this.statisticsService.getStatistics().subscribe((response: StatisticFullResponse) => {
      response.entries.forEach((entry: StatisticEntriesResponse) => {
        this.chartOptions.dataProvider.push({
          date: this.AmCharts.stringToDate(entry.date, "DD-MM"),
          phone_numbers: entry.values.phone_numbers || 0,
          views:  entry.values.views || 0,
          chats:  entry.values.chats || 0,
          city_bump:  entry.values.city_bump || 0,
          country_bump:  entry.values.country_bump || 0
        })
      });
      console.log(this.chartOptions.dataProvider);
      this.chart = this.AmCharts.makeChart("chartdiv", this.chartOptions);
    });
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
