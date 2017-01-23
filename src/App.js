import React, { Component, } from 'react';
import {Table} from 'react-bootstrap';
var XMLParser = require('react-xml-parser');
import ReactHtmlParser from 'react-html-parser';
import './App.css';
import moment from 'moment';
import 'moment/locale/nb';



class App extends Component {
  constructor(props){
    super(props);
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



  render() {
    if(this.state.toCentrum.next && this.state.fromCentrum.next){
      var toCentrum = this.state.toCentrum.next.slice(0,6);
      var fromCentrum = this.state.fromCentrum.next.slice(0,6);
      var weather = this.state.weather
      return (
        <div className='container'>
          <h1>Til Sentrum</h1>
          <Table  condensed hover responsive>
            <tbody>
            <td className='col-md-3'>Buss</td>
            <td className='col-md-5'>Mot</td>
            <td className='col-md-4' style={{textAlign:'right'}}>Ankomst</td>
              {toCentrum.map((bus)=>{
                let arrival = new Date(bus.t.substring(6,10) + "-" + bus.t.substring(3,5) + "-" + bus.t.substring(0,2) + " " + bus.t.substring(11,13) + ":" + bus.t.substring(14,16));
                if(arrival - new Date() > 0){
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
                return(<tr>
                  <td className='col-md-3'>{bus.l}</td>
                  <td className='col-md-5'>{bus.d}</td>
                  <td className='col-md-4' style={{textAlign:'right'}}>{moment(arrival).fromNow()}</td>
                </tr>);
              }
            })}
            </tbody>
          </Table>
          <h1>Vær i {weather.location.name}</h1>
          <p>{ReactHtmlParser(weather.forecast.text.location.time[0].body)}</p>
          <h1>Temperatur</h1>
          <div className='col-md-6' style={{textAlign: 'center', fontSize: '22'}}>inne: 22</div>
          <div className='col-md-6' style={{textAlign: 'center', fontSize: '22'}}>{weather.observations.weatherstation[0].temperature['@attributes'].value} grader</div>
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
