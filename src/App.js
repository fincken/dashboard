import React, { Component} from 'react';
import {PieChart} from 'react-easy-chart';
import {Table} from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/nb';
import './App.css';

class App extends Component {
    constructor(props){
        super(props);
        moment.defineLocale('nb-fix', {
            parentLocale: 'nb',
            relativeTime : {
                future : ' %s',},
        });
        this.state = {
            toCentrum: [],
            fromCentrum: [],
            weather: [],
            weatherStations: [],
            orders: [],
            statistics: []
        };
  }

  componentWillMount(){
        var app = this;
        app.loadToStopData();
        app.loadFromStopData();
        app.loadWeatherData();
        app.loadOrdersData();
        app.loadStatisticsData();
        setInterval(() =>{
            console.log('Fetching data');
            app.loadToStopData();
            app.loadFromStopData();
            app.loadOrdersData();
            app.loadStatisticsData();
        }, 10000);

 }

  loadToStopData(){
      fetch('https://api.founder.no/atb/stop/16011404')
          .then((response) => response.json())
          .then((responseJson) => {
          this.setState({toCentrum: responseJson.next.slice(0, 6)});
      })
          .catch((error) => {
          //console.error(error);
      })
  }

  loadFromStopData(){
      fetch('https://api.founder.no/atb/stop/16010404')
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({fromCentrum: responseJson.next.slice(0, 6)});
      }).catch((error) => {
          //console.error(error);
      })
  }

  loadWeatherData(){
      fetch('https://api.founder.no/yr/weather')
          .then((response) => response.json())
          .then((responseJson) => {
          this.setState({weather: responseJson});
          //console.log(responseJson);
      }).catch((error) => {
          console.error(error);
      })
  }

  loadOrdersData(){
      fetch('https://api.founder.no/bar/orders_get')
          .then((response) => response.json())
          .then((responseJson) => {
          this.setState({orders: responseJson});
      }).catch((error) => {
          console.error(error);
      })
  }

  loadStatisticsData(){
      fetch('https://api.founder.no/bar/orders_statistics')
          .then((response) => response.json())
          .then((responseJson) => {
          this.setState({statistics: responseJson});
          //console.log(responseJson);
          }).catch((error) => {
          console.error(error);
      })
  }

  getWeather(time){
      if(this.state.weather.forecast){
          var degreeSign = String.fromCharCode(parseInt("00B0", 16));
          var from = this.state.weather.forecast.tabular.time[time]["@attributes"].from.substring(11,16);
          var to = this.state.weather.forecast.tabular.time[time]["@attributes"].to.substring(11,16);
          var symbol = this.state.weather.forecast.tabular.time[time].symbol["@attributes"].name;
          var windSpeed = this.state.weather.forecast.tabular.time[time].windSpeed["@attributes"].name;
          var windDir = this.state.weather.forecast.tabular.time[time].windDirection["@attributes"].name.toLowerCase();
          var temp = this.state.weather.forecast.tabular.time[time].temperature["@attributes"].value;
          var iMorgen = moment().isBefore(moment(this.state.weather.forecast.tabular.time[time]["@attributes"].from, 'YYYY-MM-DD HH:mm'), 'day') > 0 ? ' i morgen' : '';
          return from + '-' + to + iMorgen + ': ' + symbol + ', ' + windSpeed + ' fra ' + windDir + '. ' + temp + degreeSign +'C.';
      }
  }

  render() {
        console.log("Rendering bitches");
        var toCentrum = this.state.toCentrum;
        var fromCentrum = this.state.fromCentrum;
	    var weather = this.state.weather;
        var orders = this.state.orders;
        var statistics = this.state.statistics;

	    var now = moment().format('HH:mm');
        var degreeSign = String.fromCharCode(parseInt("00B0", 16));

        var data_bar = [];
        var data_pie = [];
        var barchart;
        var piechart;
        var temperature;
        var forecast;

        if(statistics.length){
            statistics.map(function(statistic){
                data_bar.push({x: statistic.lastname,y: statistic.count});
                data_pie.push({key: statistic.lastname + ' (' + statistic.count +')', value: statistic.count});
            })
        }
        if(weather.observations){
            temperature = weather.observations.weatherstation[0].temperature['@attributes'].value + degreeSign + 'C';
        }
        if(weather.forecast){
            forecast = 'Vær i ' + weather.location.name;
        }



        return (
	        <div className='container'>
                <div className='flex-container'>
                    <h1 className='clock'>{now}</h1>
                    <div className='temp-container'>
                        <div style={{textAlign: 'center', fontSize: 22}}>inne: 22{degreeSign}C</div>
                        <div style={{textAlign: 'center', fontSize: 22}}>ute: {temperature}</div>
                    </div>
                </div>
                <h1>{forecast}</h1>
                <p>{this.getWeather(0)}</p>
                <p>{this.getWeather(1)}</p>
                <p>{this.getWeather(2)}</p>
                <h1 style={{marginTop: 50}}>Til Sentrum</h1>
                <Table condensed responsive>
                    <tbody>
                        <tr>
                            <td className='col-md-3'>Buss</td>
                            <td className='col-md-5'>Mot</td>
                            <td className='col-md-4' style={{textAlign:'right'}}>Ankomst</td>
                        </tr>
                        {toCentrum.map((bus) => {
                            let arrival = new Date(bus.t.substring(6, 10) + "-" + bus.t.substring(3, 5) + "-" + bus.t.substring(0, 2) + " " + bus.t.substring(11, 13) + ":" + bus.t.substring(14, 16));
                            if (arrival - new Date() > 0) {
                                if (arrival - new Date() < 30000) {
                                    return (
                                        <tr>
                                            <td className='col-md-3'>{bus.l}</td>
                                            <td className='col-md-5'>{bus.d}</td>
                                            <td className='col-md-4' style={{textAlign: 'right'}}>nå</td>
                                        </tr>);
                                }
                                return (
                                    <tr>
                                        <td className='col-md-3'>{bus.l}</td>
                                        <td className='col-md-5'>{bus.d}</td>
                                        <td className='col-md-4'
                                            style={{textAlign: 'right'}}>{moment(arrival).fromNow()}</td>
                                    </tr>);
                            }
                        })}
                    </tbody>
                </Table>
                <h1>Fra Sentrum</h1>
                <Table condensed responsive>
                    <tbody>
                        <tr>
                            <td className='col-md-3'>Buss</td>
                            <td className='col-md-5'>Mot</td>
                            <td className='col-md-4' style={{textAlign:'right'}}>Ankomst</td>
                        </tr>
                        {fromCentrum.map((bus)=> {
                            let arrival = new Date(bus.t.substring(6, 10) + "-" + bus.t.substring(3, 5) + "-" + bus.t.substring(0, 2) + " " + bus.t.substring(11, 13) + ":" + bus.t.substring(14, 16));
                            if (arrival - new Date() > 0) {
                                if (arrival - new Date() < 30000) {
                                    return (
                                        <tr>
                                            <td className='col-md-3'>{bus.l}</td>
                                            <td className='col-md-5'>{bus.d}</td>
                                            <td className='col-md-4' style={{textAlign: 'right'}}>nå</td>
                                        </tr>);
                                }
                                return (
                                    <tr>
                                        <td className='col-md-3'>{bus.l}</td>
                                        <td className='col-md-5'>{bus.d}</td>
                                        <td className='col-md-4'
                                            style={{textAlign: 'right'}}>{moment(arrival).fromNow()}</td>
                                    </tr>);
                            }
                        })}
                    </tbody>
                </Table>
                <h1>Fra baren</h1>
                <Table condensed responsive>
                    <tbody>
                    {orders.map((order)=> {
                        return (
                            <tr>
                                <td className='col-md-3'>{order.lastname}</td>
                                <td className='col-md-5'>{order.drink_name}</td>
                                <td className='col-md-4' style={{textAlign: 'right'}}>I kø</td>
                            </tr>);
                    })}
                    </tbody>
                </Table>
                <div className='col-md-6'><PieChart padding={50} labels styles={{ '.chart_lines': {strokeWidth: 0},'.chart_text': {fontFamily: 'serif', fontSize: '0.1em', fill: '#fff'}}} data={data_pie} /></div>

            </div>
        )
  }
}

export default App;
