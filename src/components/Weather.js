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
            location: ''
        }
    }

    componentWillMount() {
        var app = this;
        app.loadWeatherData();
    }

    loadWeatherData() {
        fetch('https://api.founder.no/yr/weather').then((response) => response.json()).then((responseJson) => {
            this.setState({
                weather: responseJson.forecast.tabular.time.slice(0, 5),
                location: responseJson.location.name
            });
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        var weather = this.state.weather;
        console.log(weather);
        return (
            <div className='weather'>
                <h1>Vær i {this.state.location}</h1>
                <Table condensed responsive>
                    <thead>
                        <tr>
                            <th>Tidspunkt</th>
                            <th>Vær</th>
                            <th className='align-right'>Vind</th>
                            {/*<td>Vindretning</td>*/}
                        </tr>
                    </thead>
                    <ReactCSSTransitionGroup transitionName="animation" component="tbody" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
                        {weather.map((time) => {
                            var imgUrl = 'https://symbol.yr.no/grafikk/sym/b100/' + time.symbol["@attributes"].var + '.png';
                            return (
                                <tr key={time["@attributes"].from.substring(11, 16) + time["@attributes"].to.substring(11, 16)}>
                                    <td className='col-md-4'>{time["@attributes"].from.substring(11, 16)}-{time["@attributes"].to.substring(11, 16)} {moment().isBefore(moment(time["@attributes"].from, 'YYYY-MM-DD HH:mm'), 'day') > 0
                                            ? ' i morgen'
                                            : ''}</td>
                                    <td className='col-md-5'><img alt="Weather" src={imgUrl} className='weather-image'/></td>
                                    <td className='col-md-3 align-right'>{time.windSpeed["@attributes"].name}, {time.windSpeed["@attributes"].mps}m/s</td>
                                    {/*<td className='col-md-3'>fra {time.windDirection["@attributes"].name.toLowerCase()}</td>*/}
                                </tr>
                            );
                        })}
                    </ReactCSSTransitionGroup>
                </Table>
            </div>
        );
    }
}

export default Weather;
