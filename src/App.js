import React, { Component, } from 'react';
import {Table} from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';
import './App.css';
import moment from 'moment';
import 'moment/locale/nb';

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
      weather: '',
    };
  }

  componentWillMount(){
    var app = this;
    app.loadToStopData();
    app.loadFromStopData();
    app.loadWeatherData();
    setInterval(() =>{
      console.log('fetching');
      app.loadToStopData();
      app.loadFromStopData();
    }, 10000);
  }

  loadToStopData(){
    fetch('https://api.founder.no/atb/stop/16011404')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({toCentrum: responseJson});
    })
    .catch((error) => {
        console.error(error);
    })
  }

  loadFromStopData(){
    fetch('https://api.founder.no/atb/stop/16010404')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({fromCentrum: responseJson});
    })
    .catch((error) => {
        console.error(error);
    })
  }

  loadWeatherData(){
    fetch('https://api.founder.no/yr/weather')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({weather: responseJson});
      console.log(responseJson);
    })
    .catch((error) => {
        console.error(error);
    })
  }

  getWeather(time){
    var degreeSign = String.fromCharCode(parseInt("00B0", 16));
    var from = this.state.weather.forecast.tabular.time[time]["@attributes"].from.substring(11,16);
    var to = this.state.weather.forecast.tabular.time[time]["@attributes"].to.substring(11,16);
    //var date = weather.forecast.tabular.time[0]["@attributes"].from.substring(11,16);
    var symbol = this.state.weather.forecast.tabular.time[time].symbol["@attributes"].name;
    var windSpeed = this.state.weather.forecast.tabular.time[time].windSpeed["@attributes"].name;
    var windDir = this.state.weather.forecast.tabular.time[time].windDirection["@attributes"].name.toLowerCase();
    var temp = this.state.weather.forecast.tabular.time[time].temperature["@attributes"].value;
    var iMorgen = moment().isBefore(moment(this.state.weather.forecast.tabular.time[time]["@attributes"].from, 'YYYY-MM-DD HH:mm'), 'day') > 0 ? ' i morgen' : '';
    return from + '-' + to + iMorgen + ': ' + symbol + ', ' + windSpeed + ' fra ' + windDir + '. ' + temp + degreeSign +'C.';
  }

  render() {
    if(this.state.toCentrum.next && this.state.fromCentrum.next){
      var toCentrum = this.state.toCentrum.next.slice(0,6);
      var fromCentrum = this.state.fromCentrum.next.slice(0,6);
      var weather = this.state.weather;
      var now = moment().format('HH:mm')
      var degreeSign = String.fromCharCode(parseInt("00B0", 16));
      return (
        <div className='container'>
          <div className='flex-container'>
            <h1 className='clock'>{now}</h1>
            <div className='temp-container'>
              <div style={{textAlign: 'center', fontSize: 22}}>inne: 22{degreeSign}C</div>
              <div style={{textAlign: 'center', fontSize: 22}}>ute: {weather.observations.weatherstation[0].temperature['@attributes'].value}{degreeSign}C</div>
            </div>
          </div>
          <h1>Vær i {weather.location.name}</h1>
          <p>{this.getWeather(0)}</p>
          <p>{this.getWeather(1)}</p>
          <p>{this.getWeather(2)}</p>
          <h1 style={{marginTop: 50}}>Til Sentrum</h1>
          <Table  condensed hover responsive>
            <tbody>
            <td className='col-md-3'>Buss</td>
            <td className='col-md-5'>Mot</td>
            <td className='col-md-4' style={{textAlign:'right'}}>Ankomst</td>
              {toCentrum.map((bus)=>{
                let arrival = new Date(bus.t.substring(6,10) + "-" + bus.t.substring(3,5) + "-" + bus.t.substring(0,2) + " " + bus.t.substring(11,13) + ":" + bus.t.substring(14,16));
                if(arrival - new Date() > 0){
                  if(arrival - new Date() < 30000){
                    return(<tr>
                      <td className='col-md-3'>{bus.l}</td>
                      <td className='col-md-5'>{bus.d}</td>
                      <td className='col-md-4' style={{textAlign:'right'}}>nå</td>
                    </tr>);
                  }
                  return(<tr>
                    <td className='col-md-3'>{bus.l}</td>
                    <td className='col-md-5'>{bus.d}</td>
                    <td className='col-md-4' style={{textAlign:'right'}}>{moment(arrival).fromNow()}</td>
                  </tr>);
                }
              })}
            </tbody>
          </Table>
          <h1>Fra Sentrum</h1>
          <Table  condensed hover responsive>
            <tbody>
            <td className='col-md-3'>Buss</td>
            <td className='col-md-5'>Mot</td>
            <td className='col-md-4' style={{textAlign:'right'}}>Ankomst</td>
            {fromCentrum.map((bus)=>{
              let arrival = new Date(bus.t.substring(6,10) + "-" + bus.t.substring(3,5) + "-" + bus.t.substring(0,2) + " " + bus.t.substring(11,13) + ":" + bus.t.substring(14,16));
              if(arrival - new Date() > 0){
                if(arrival - new Date() < 30000){
                  return(<tr>
                    <td className='col-md-3'>{bus.l}</td>
                    <td className='col-md-5'>{bus.d}</td>
                    <td className='col-md-4' style={{textAlign:'right'}}>nå</td>
                  </tr>);
                }
                return(<tr>
                  <td className='col-md-3'>{bus.l}</td>
                  <td className='col-md-5'>{bus.d}</td>
                  <td className='col-md-4' style={{textAlign:'right'}}>{moment(arrival).fromNow()}</td>
                </tr>);
              }
            })}
            </tbody>
          </Table>
        </div>
      );
    }
    else{
      return(
        <div className = "App" >
            <div className = "container" >
                <p className = "App-intro" >
                    Loading...
                </p>
            </div>
        </div>
      )
    }
  }
}

export default App;
