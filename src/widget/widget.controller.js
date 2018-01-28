let $data, $element, $scope, moment, lodash, $event;

export default class WidgetController {

  static $inject = ['od.data.service', '$element', '$scope', 'moment', 'lodash', 'od.event.service'];

  constructor(_$data, _$element, _$scope, _moment, _lodash, _$event) {
    $data = _$data;
    $element = _$element;
    $scope = _$scope;
    moment = _moment;
    lodash = _lodash;
    $event = _$event;
  }

  $onInit() {
    this.state.alert = false; // <---

    if (!this.config.item) {
      this.state.config = false;
      return;
    }

    this.lodash = lodash;
    this.moment = moment;
    this.values = [];

    var that = this;
    setTimeout(function () {
      that.hcData.getChartObj().reflow();
    }, 2000);

    this.hcData = {
      chart: {
        type: "spline",
        zoomType: "x",
        timezoneOffset: 180,
        marginRight: 10,
        useUTC: true
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: '',
      },
      legend: {
        enabled: false
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      tooltip: {
        enabled: true
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          }
        },
        series: {
          states: {
            hover: {
              enabled: true
            }
          },
          dataLabels: {
            color: '#000000',
            enabled: false,
            borderWidth: 0,
            formatter: function () {
              return this.y
            },
            inside: true,
            style: {
              textOutline: false,
              textShadow: false
            },
            marker: {
              enabled: false
            },
            borderRadius: 0
          }
        }
      },
      series: [{
        name: 'Werte',
        data: (function () {
          // generate an array of random data
          var data = [],
            time = (new Date()).getTime(),
            i;

          for (i = -100; i <= 0; i += 1) {
            data.push([
              time + i * 1000,
              Math.round(Math.random() * 100)
            ]);
          }
          return data;
        }())
      }]
    };

    let newValue = this.config.item;
    newValue = JSON.parse(newValue);
    let id = newValue[0];
    let valueIndex = newValue[1];
    let item = $data.get(id);

    if (!item || !item.value) {
      console.error('KPI Widget Item Not Found..', id);
      return;
    }

    item.liveValues((values) => {
      if (this.values.length < 3) {
        item.history({
          aggregation: 1,
          since: moment().subtract(1, 'hours'),
        }).then(dataSet => {
          this.values = [];
          let dataProcessor = dataSet.slice(dataSet.length - 50);
          for (var i = 0; i < dataProcessor.length; i++) {
            this.values.push([dataProcessor[i].date, parseFloat(dataProcessor[i].value[0].toFixed(2))])
          }
          this.values = this.lodash.sortBy(this.values, o => o[0]);
          this.hcData.getChartObj().series[0].setData(this.values, true, false, true);
          this.hcData.getChartObj().reflow();
          this.loading = false;
        })
      } else {
        let value = parseFloat(values.value[valueIndex]);
        this.values.push([values.date, parseFloat(value.toFixed(2))])
        this.hcData.getChartObj().series[0].addPoint([values.date, value], true, true);
        this.hcData.getChartObj().reflow();
        this.loading = false;
      }
    });
  }
}


