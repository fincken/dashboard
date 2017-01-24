import React, {Component} from 'react';
import d3, {Chart} from 'react-d3-core';
import {Table} from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/nb';
import '../App.css';

class Bar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            orders: [],
            statistics: []
        };
    }

    componentWillMount() {
        var app = this;
        app.loadOrdersData();
        app.loadStatisticsData();
        setInterval(() => {
            app.loadOrdersData();
            app.loadStatisticsData();
        }, 500);
    }

    loadOrdersData() {
        fetch('https://api.founder.no/bar/orders_get').then((response) => response.json()).then((responseJson) => {
            this.setState({orders: responseJson});
        }).catch((error) => {
            console.error(error);
        })
    }

    loadStatisticsData() {
        fetch('https://api.founder.no/bar/orders_statistics').then((response) => response.json()).then((responseJson) => {
            this.setState({statistics: responseJson});
            //console.log(responseJson);
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        var orders = this.state.orders;
        var statistics = this.state.statistics;
        var degreeSign = String.fromCharCode(parseInt("00B0", 16));

        var data_bar = [];
        var data_pie = [];
        var barchart;
        var piechart;
        var temperature;

        if (statistics.length) {
            statistics.map(function(statistic) {
                data_bar.push({x: statistic.lastname, y: statistic.count});
                data_pie.push({
                    key: statistic.lastname + ' (' + statistic.count + ')',
                    value: statistic.count
                });
            })
        }
        return (
            <div>
                <Table condensed responsive>
                    <thead>
                        <tr>
                            <th className='col-md-4'>Person</th>
                            <th className='col-md-5'>Drink</th>
                            <th className='col-md-3 align-right'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            return (
                                <tr>
                                    <td className='col-md-4'>{order.lastname}</td>
                                    <td className='col-md-5'>{order.drink_name}</td>
                                    <td className='col-md-3 align-right'>I kø</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Bar;
