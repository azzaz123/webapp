import { Component, OnDestroy, OnInit } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';
import { StatisticsService } from './statistics.service';
import { StatisticEntriesResponse, StatisticFullResponse } from './statistic-response.interface';
import { IOption } from 'ng-select';

@Component({
  selector: 'tsl-stats-graph',
  templateUrl: './stats-graph.component.html',
  styleUrls: ['./stats-graph.component.scss']
})
export class StatsGraphComponent implements OnInit, OnDestroy {

  public duration: string = '30';
  public statsDurations: IOption[] = [{
    label: 'Last 30 days',
    value: '30'
  }, {
    label: 'Last 15 days',
    value: '15'
  }, {
    label: 'Last 7 days',
    value: '7'
  }];
  private chart: AmChart;
  private chartOptions: any = {
    "type": "serial",
    "categoryField": "date",
    "dataDateFormat": "",
    "colors": [
      "#90a4ae",
      "#3daabf",
      "#ffb238",
      "#13C1AC",
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
          "format": "DD"
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
      "gridAlpha": 0,
      "markPeriodChange": false,
      "minorGridAlpha": 0,
      "color": "#90A4AE",
      "fontSize": 10,
      "centerLabels": true
    },
    "trendLines": [],
    "graphs": [
      {
        "balloonText": "[[value]]",
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
        "valueField": "views",
        "valueAxis": "ValueAxisViews",
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
        "fillAlphas": 0.20,
        "fixedColumnWidth": 0,
        "id": "city_bump",
        "lineAlpha": 0,
        "lineThickness": 0,
        "title": "City Featured",
        "topRadius": 0,
        "type": "smoothedLine",
        "valueField": "city_bump"
      },
      {
        "behindColumns": true,
        "fillAlphas": 0.20,
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
        "id": "ValueAxisGeneral",
        "color": "#607D8B",
        "fontSize": 8,
        "title": "",
        "gridColor": "#ECEFF1"
      },
      {
        "id": "ValueAxisViews",
        "color": "#607D8B",
        "fontSize": 8,
        "title": "",
        "position": "right",
        "synchronizationMultiplier": 5,
        "synchronizeWith": "ValueAxisGeneral",
        "gridColor": "#ECEFF1"
      }
    ],
    "allLabels": [],
    "balloon": {},
    "legend": {
      "enabled": true,
      "align": "right",
      "equalWidths": false,
      "autoMargins": false,
      "marginLeft": 0,
      "marginRight": 0,
      "marginBottom": 30,
      "fontSize": 14,
      "spacing": -30,
      "position": "top",
      "rollOverGraphAlpha": 0.75,
      "switchType": "v",
      "valueWidth": 30
    },
    "titles": [],
    "dataProvider": []
  };

  constructor(private AmCharts: AmChartsService,
  private statisticsService: StatisticsService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.statisticsService.getStatistics(this.duration).subscribe((response: StatisticFullResponse) => {
      this.chartOptions.dataProvider = [];
      response.entries.forEach((entry: StatisticEntriesResponse) => {
        this.chartOptions.dataProvider.push({
          date: +entry.date,
          phone_numbers: entry.values.phone_numbers || 0,
          views:  entry.values.views || 0,
          chats:  entry.values.chats || 0,
          city_bump:  entry.values.city_bump || 0,
          country_bump:  entry.values.country_bump || 0
        })
      });
      if (this.duration === '7') {
        this.chartOptions.graphs[1].fixedColumnWidth = 8;
        this.chartOptions.graphs[2].fixedColumnWidth = 8;
      } else {
        if (this.duration === '15') {
          this.chartOptions.graphs[1].fixedColumnWidth = 6;
          this.chartOptions.graphs[2].fixedColumnWidth = 6;
        }
      }
      this.chart = this.AmCharts.makeChart("chartdiv", this.chartOptions);
    });
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
