import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/nb';
import '../App.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weather: [],
            spotify: []
        }
    }

    componentWillMount() {
        this.loadTemperatureData();
        this.loadSpotifyData();
        setInterval(() => {
            this.loadTemperatureData();
        }, 10000);

        setInterval(() => {
            this.loadSpotifyData();
        }, 5000);
    }

    loadTemperatureData() {
        fetch('https://api.founder.no/yr/weather').then((response) => response.json()).then((responseJson) => {
            this.setState({weather: responseJson});
        }).catch((error) => {
            console.error(error);
        })
    }

    loadSpotifyData() {
        fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=mjansrud&api_key=de818d0d0a7f78432fca3f60e10955d0&limit=5&format=json').then((response) => response.json()).then((responseJson) => {
            this.setState({spotify: responseJson});
            console.log(responseJson);
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        var degreeSign = String.fromCharCode(parseInt("00B0", 16));
        var now = moment().format('HH:mm');
        var weather = this.state.weather;
        var spotify = this.state.spotify;


        if(this.state.spotify.recenttracks){
            var track = this.state.spotify.recenttracks.track[0];
        }
        console.log(track);

        return (
            <div className='flex-container header'>
                <div className='song-container'>
                    <div>
                        {spotify.recenttracks ?
                            <div className="flex-container ">
                                <div>
                                    <img className="spotify-image" src={track.image[2]["#text"]} />
                                </div>
                                <div>
                                    <div className="song-title">{track.name}</div>
                                    <div className="song-subtitle">{track.artist["#text"]}</div>
                                    <div className="song-icon-container"><img className="song-icon" src="http://www.last.fm/static/images/icons/eq_icon.gif?ca32817488be" /></div>
                                </div>
                            </div>
                            :
                            <div key='empty'>Ingen sanger spiller </div>
                        }
                    </div>
                </div>
                <div>
                    <h1 className='clock'>{now}</h1>
                </div>
            </div>
        );
    }
}

export default Header;
