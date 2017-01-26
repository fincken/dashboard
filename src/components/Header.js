import React, {Component} from 'react';
import moment from 'moment';
import SpotifyCurrentlyPlaying from '../external/spotifyCurrentlyPlaying.js'
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
        setInterval(() => {
            this.loadTemperatureData();
        }, 10000);

        // You will need to pass your parameters to the function
        // You can initialize it with SCP() or SpotifyCurrentlyPlaying()
        SpotifyCurrentlyPlaying({
            selector: '#spotify-widget',
            username: 'mjansrud',
            api_key: 'de818d0d0a7f78432fca3f60e10955d0',
            width: '100%',
            height: '80'
        });
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
            <div className='flex-container header'>
                <div className='temp-container'>
                    <div id="spotify-widget"></div>
                    <div style={{
                        textAlign: 'center',
                        fontSize: 22
                    }}>inne: 22{degreeSign}C</div>
                    <div style={{
                        textAlign: 'center',
                        fontSize: 22
                    }}>ute: {temperature}</div>
                </div>
                <h1 className='clock'>{now}</h1>
            </div>
        );
    }
}

export default Header;
