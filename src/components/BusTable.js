import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment';
import 'moment/locale/nb';
import '../App.css';

class BusTable extends Component {
    constructor(props) {
        super(props);
        moment.defineLocale('nb-fix', {
            parentLocale: 'nb',
            relativeTime: {
                future: ' %s'
            }
        });
        this.state = {
            stop: []
        }
    }

    componentWillMount() {
        var app = this;
        app.loadStopData();
        setInterval(() => {
            app.loadStopData();
        }, 10000);

    }

    loadStopData() {
        fetch('https://api.founder.no/atb/stop/' + this.props.stopCode).then((response) => response.json()).then((responseJson) => {
            this.setState({
                stop: responseJson.next.slice(0, 5)
            });
        }).catch((error) => {
            //console.error(error);
        })
    }

    render() {
        var stop = this.state.stop;
        return (
            <Table condensed responsive>
                <thead>
                    <tr>
                        <th className='col-md-4'>Buss</th>
                        <th className='col-md-5'>Mot</th>
                        <th className='col-md-3 align-right'>Ankomst</th>
                    </tr>
                </thead>
                <tbody>
                    {stop.length > 0 ? stop.map((bus) => {
                        let arrival = new Date(bus.t.substring(6, 10) + "-" + bus.t.substring(3, 5) + "-" + bus.t.substring(0, 2) + " " + bus.t.substring(11, 13) + ":" + bus.t.substring(14, 16));
                        if (arrival - new Date() > 0) {
                            if (arrival - new Date() < 30000) {
                                return (
                                    <tr key={bus.l+arrival}>
                                        <td className='col-md-4'>{bus.l}</td>
                                        <td className='col-md-5'>{bus.d}</td>
                                        <td className='col-md-3 align-right'>nå</td>
                                    </tr>
                                );
                            }
                            return (
                                <tr key={bus.l+arrival}>
                                    <td className='col-md-4'>{bus.l}</td>
                                    <td className='col-md-5'>{bus.d}</td>
                                    <td className='col-md-3 align-right'>{moment(arrival).fromNow()}</td>
                                </tr>
                            );
                        }
                    }) :
                        <tr>
                            <td className='col-md-4'>Ingen busser</td>
                            <td className='col-md-5'></td>
                            <td className='col-md-3 align-right'></td>
                        </tr>
                    }
                </tbody>
            </Table>
        );
    }
}

export default BusTable;
