import React, {Component} from 'react';
//import {Table} from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/nb';
import '../App.css';

class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weather: []
        }
    }

    componentWillMount() {
        var app = this;
        app.loadWeatherData();
    }

    loadWeatherData() {
        fetch('https://api.founder.no/yr/weather').then((response) => response.json()).then((responseJson) => {
            this.setState({weather: responseJson});
            //console.log(responseJson);
        }).catch((error) => {
            console.error(error);
        })
    }

    getWeather(time) {
        if (this.state.weather.forecast) {
            var degreeSign = String.fromCharCode(parseInt("00B0", 16));
            var from = this.state.weather.forecast.tabular.time[time]["@attributes"].from.substring(11, 16);
            var to = this.state.weather.forecast.tabular.time[time]["@attributes"].to.substring(11, 16);
            var symbol = this.state.weather.forecast.tabular.time[time].symbol["@attributes"].name;
            var windSpeed = this.state.weather.forecast.tabular.time[time].windSpeed["@attributes"].name;
            var windDir = this.state.weather.forecast.tabular.time[time].windDirection["@attributes"].name.toLowerCase();
            var temp = this.state.weather.forecast.tabular.time[time].temperature["@attributes"].value;
            var iMorgen = moment().isBefore(moment(this.state.weather.forecast.tabular.time[time]["@attributes"].from, 'YYYY-MM-DD HH:mm'), 'day') > 0
                ? ' i morgen'
                : '';
            return from + '-' + to + iMorgen + ': ' + symbol + ', ' + windSpeed + ' fra ' + windDir + '. ' + temp + degreeSign + 'C.';
        }
    }

    render() {
        var degreeSign = String.fromCharCode(parseInt("00B0", 16));
        var weather = this.state.weather;
        var forecast;
        if (weather.forecast) {
            forecast = 'Vær i ' + weather.location.name;
        }
        return (
            <div className='weather'>
                <h1>{forecast}</h1>
                <p>{this.getWeather(0)}</p>
                <p>{this.getWeather(1)}</p>
                <p>{this.getWeather(2)}</p>
            </div>
        );
    }
}

export default Weather;
