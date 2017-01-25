import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment';
import 'moment/locale/nb';
import '../App.css';

class BusTable extends Component {
    constructor(props) {
        super(props);
        moment.updateLocale('nb-fix', {
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
        app.loadToStopData();
        setInterval(() => {
            app.loadToStopData();
        }, 10000);

    }

    loadToStopData() {
        fetch('https://api.founder.no/atb/stop/' + this.props.stopCode).then((response) => response.json()).then((responseJson) => {
            this.setState({
                stop: responseJson.next.slice(0, 6)
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
                <ReactCSSTransitionGroup transitionName="animation" component="tbody" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
                    {stop.map((bus) => {
                        let arrival = new Date(bus.t.substring(6, 10) + "-" + bus.t.substring(3, 5) + "-" + bus.t.substring(0, 2) + " " + bus.t.substring(11, 13) + ":" + bus.t.substring(14, 16));
                        if (arrival - new Date() > 0) {
                            if (arrival - new Date() < 30000) {
                                return (
                                    <tr key={arrival}>
                                        <td className='col-md-4'>{bus.l}</td>
                                        <td className='col-md-5'>{bus.d}</td>
                                        <td className='col-md-3 align-right'>nå</td>
                                    </tr>
                                );
                            }
                            return (
                                <tr>
                                    <td className='col-md-4'>{bus.l}</td>
                                    <td className='col-md-5'>{bus.d}</td>
                                    <td className='col-md-3 align-right'>{moment(arrival).fromNow()}</td>
                                </tr>
                            );
                        }
                    })}
                </ReactCSSTransitionGroup>
            </Table>
        );
    }
}

export default BusTable;
