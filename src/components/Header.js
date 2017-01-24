import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/nb';
import '../App.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weather: []
        }
    }

    componentWillMount() {
        this.loadTemperatureData();
    }

    loadTemperatureData() {
        fetch('https://api.founder.no/yr/weather').then((response) => response.json()).then((responseJson) => {
            this.setState({weather: responseJson});
            //console.log(responseJson);
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        var degreeSign = String.fromCharCode(parseInt("00B0", 16));
        var temperature;
        var now = moment().format('HH:mm');
        var weather = this.state.weather;
        if (weather.observations) {
            temperature = weather.observations.weatherstation[0].temperature['@attributes'].value + degreeSign + 'C';
        }
        return (
            <div className='flex-container'>
                <h1 className='clock'>{now}</h1>
                <div className='temp-container'>
                    <div style={{
                        textAlign: 'center',
                        fontSize: 22
                    }}>inne: 22{degreeSign}C</div>
                    <div style={{
                        textAlign: 'center',
                        fontSize: 22
                    }}>ute: {temperature}</div>
                </div>
            </div>
        );
    }
}

export default Header;
