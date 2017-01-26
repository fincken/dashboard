import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment';
import 'moment/locale/nb';
import '../App.css';

class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weather: [],
            temperature: [],
            location: ''
        }
    }

    componentWillMount() {
        this.loadWeatherData();
        setInterval(() => {
            this.loadWeatherData();
        }, 60000);
    }

    loadWeatherData() {
        fetch('https://api.founder.no/yr/weather').then((response) => response.json()).then((responseJson) => {
            this.setState({
                temperature: responseJson,
                weather: responseJson.forecast.tabular.time.slice(0, 4),
                location: responseJson.location.name
            });
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        var temp;
        var temperature = this.state.temperature;
        var weather = this.state.weather;
        if (temperature.observations) {
            temp = temperature.observations.weatherstation[0].temperature['@attributes'].value;
        }

        return (
            <div className='weather'>
                <div className="flex-container weather-header">
                    <div>
                        <h1>Vær i {this.state.location}</h1>
                    </div>
                    <div className="temperatures">
                        <div className="temperature">Ute: {temp}&deg;C</div>
                        <div className="temperature">Inne: 22&deg;C</div>
                    </div>
                </div>

                <Table condensed responsive>
                    <thead>
                        <tr>
                            <th>Tidspunkt</th>
                            <th>Vær</th>
                            <th className='align-right'>Vind</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weather.length > 0 ? weather.map((time) => {
                            var imgUrl = 'https://symbol.yr.no/grafikk/sym/b100/' + time.symbol["@attributes"].var + '.png';
                            return (
                                <tr key={time["@attributes"].from.substring(11, 16) + time["@attributes"].to.substring(11, 16)}>
                                    <td className='col-md-4'>{time["@attributes"].from.substring(11, 16)}-{time["@attributes"].to.substring(11, 16)} {moment().isBefore(moment(time["@attributes"].from, 'YYYY-MM-DD HH:mm'), 'day') > 0
                                            ? ' i morgen'
                                            : ''}</td>
                                    <td className='col-md-5'><img alt="Weather" src={imgUrl} className='weather-image'/> {time.temperature["@attributes"].value}&deg;C</td>
                                    <td className='col-md-3 align-right'>{time.windSpeed["@attributes"].name}, {time.windSpeed["@attributes"].mps}m/s</td>
                                 </tr>
                            );
                        }) :
                            <tr key='empty'>
                                <td className='col-md-4'>Ingen prognoser tilgjengelig</td>
                                <td className='col-md-5'></td>
                                <td className='col-md-3 align-right'></td>
                            </tr>
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Weather;
