import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactHtmlParser from 'react-html-parser';
import {BarChart, PieChart} from 'react-d3-basic';
import {Table} from 'react-bootstrap';
//import {LastFM} from 'lastfmapi';
import 'moment/locale/nb';
import '../App.css';

"use strict";

class Bar extends Component {

    arraysEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    constructor(props) {
        super(props);

        this.state = {
            orders: [],
            statisticsTotal: [],
            statisticsToday: [],
            status: [],
            trigger: [
                {
                    id: 0
                }
            ]
        };
    }

    componentWillMount() {
        var app = this;
        app.loadOrdersData();
        app.loadBarStatusData();
        app.loadStatisticsData();
        setInterval(() => {
            app.loadOrdersData();
        }, 500);
        setInterval(() => {
            app.loadStatisticsData();
            app.loadBarStatusData();
        }, 5000);

        /*
        var LFM = new LastFM({
            'api_key' : '78956cb049e44d830f0de6f29caafc0c',
            'secret' : '198c3d7f7661806c98199256dbf3859e'
        });
        */
    }

    loadOrdersData() {
        fetch('https://api.founder.no/bar/orders_get').then((response) => response.json()).then((responseJson) => {
            this.setState({orders: responseJson});
        }).catch((error) => {
            console.error(error);
        })
    }

    loadBarStatusData() {
        fetch('https://api.founder.no/bar/status').then((response) => response.json()).then((responseJson) => {
            this.setState({status: responseJson});
        }).catch((error) => {
            console.error(error);
        })
    }

    loadStatisticsData() {
        fetch('https://api.founder.no/bar/orders_statistics').then((response) => response.json()).then((responseJson) => {
            if (!this.arraysEqual(responseJson, this.state.statisticsTotal)) {
                this.setState({
                    trigger: [
                        {
                            id: (this.state.trigger[0].id + 1)
                        }
                    ],
                    statisticsTotal: responseJson
                })
            } else {
                this.setState({statisticsTotal: responseJson})
            }
        }).catch((error) => {
            console.error(error);
        });
        fetch('https://api.founder.no/bar/orders_statistics_today').then((response) => response.json()).then((responseJson) => {
            if (!this.arraysEqual(responseJson, this.state.statisticsToday)) {
                this.setState({
                    trigger: [
                        {
                            id: (this.state.trigger[0].id + 1)
                        }
                    ],
                    statisticsToday: responseJson
                })
            } else {
                this.setState({statisticsToday: responseJson})
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        var trigger = this.state.trigger;
        var orders = this.state.orders;
        var status = this.state.status;
        var statisticsTotal = this.state.statisticsTotal;
        var statisticsToday = this.state.statisticsToday;
        var imgUrl = 'https://dashboard.founder.no/images/offline.png';

        var statisticsDataTotal = []
        var statisticsDataToday = [];
        var pieChartSeries = [];

        var pieChartWidth = 390,
            pieChartRadius = Math.min(pieChartWidth, pieChartWidth - 220) / 2,
            pieChartInnerRadius = 50,
            pieChartMargins = {
                top: 10,
                bottom: 50,
                left: 200,
                right: 200
            },
            pieChartShowLegend = false,
            pieChartName = function(d) {
                return d.name;
            },
            pieChartValue = function(d) {
                return d.value;
            }

        var barChartWidth = 350,
            barChartHeight = 400,
            barChartMargins = {
                top: 10,
                bottom: 100,
                left: 20,
                right: 20
            },
            classWhite = 'chart-white',
            barChartShowXGrid = false,
            barChartShowYGrid = false,
            barChartXScale = 'ordinal',
            barChartXLabel = "Alkoholikere",
            barChartSeries = [
                {
                    field: 'drinks',
                    name: 'Drinker bestilt totalt / Drinker bestilt i dag',
                    color: '#fff'
                }
            ],
            barChartName = function(d) {
                return d.name;
            }

        if (statisticsTotal.length) {
            statisticsTotal.map(function(statistic) {
                statisticsDataTotal.push({
                    name: statistic.firstname.charAt(0) + '. ' + statistic.lastname,
                    drinks: parseInt(statistic.count)
                });

            })
        }

        if (status.length) {
            switch (status[0].status) {
                case 'online':
                    imgUrl = 'https://dashboard.founder.no/images/online.png';
                    break;
            }
        }

        if (statisticsToday.length) {
            statisticsToday.map(function(statistic) {
                pieChartSeries.push({
                    name: statistic.firstname.charAt(0) + '. ' + statistic.lastname + ' (' + statistic.count + ')',
                    field: statistic.firstname + statistic.lastname,
                    color: '#fff'
                })
                statisticsDataToday.push({
                    name: statistic.firstname + statistic.lastname,
                    value: parseInt(statistic.count)
                })
            })
        }


        return (
            <div>
                <status>
                    <h1>Ordre i baren</h1>
                    <span><img alt="Power" src={imgUrl} className="weather-image bar-image"/></span>
                </status>
                <Table condensed responsive>
                    <thead>
                        <tr>
                            <th className='col-md-4'>Person</th>
                            <th className='col-md-4'>Drink</th>
                            <th className='col-md-4 align-right'>Status</th>
                        </tr>
                    </thead>
                    <ReactCSSTransitionGroup transitionName="animation" component="tbody" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
                        {orders.length > 0 ? orders.map((order) => {
                            var status = 'I kø';
                            if (order.processing_percent > 0) {
                                var count = order.processing_percent / 4.1;
                                status = '<div style="display: inline-block; width:80%; text-align:left">';
                                status += Array(parseInt(count)).join(" | ");
                                status += '</div>';
                                status += '<div style="display: inline-block; width:20%; text-align:right">';
                                status += order.processing_percent + '%';
                                status += '</div>';
                            }
                            return (
                                <tr key={order.lastname + order.created}>
                                    <td className='col-md-4'>{order.firstname.charAt(0)}. {order.lastname}</td>
                                    <td className='col-md-4'>{order.drink_name}</td>
                                    <td className='col-md-4 align-right'>{ReactHtmlParser(status)}</td>
                                </tr>
                            );
                        }) :
                            <tr key='empty'>
                                <td className='col-md-4'>Ingen nye ordre</td>
                                <td className='col-md-4'></td>
                                <td className='col-md-4 align-right'></td>
                            </tr>
                        }
                    </ReactCSSTransitionGroup>
                </Table>
                <Table condensed responsive>
                    <thead>
                        <tr>
                            <th className='col-md-6 stastistics-header'>
                                <h1>Bestilt totalt</h1>
                            </th>
                            <th className='col-md-6 stastistics-header align-right'>
                                <h1>Dagens alkis</h1>
                            </th>
                        </tr>
                    </thead>
                </Table>
                <Table condensed responsive>
                    <ReactCSSTransitionGroup transitionName="animation" component="thead" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
                        {trigger.map((key) => {
                            return (
                                <tr key={key.id}>
                                    <th className='col-md-6 chart-bar'>
                                        <BarChart width={barChartWidth} height={barChartHeight} margins={barChartMargins} data={statisticsDataTotal} chartSeries={barChartSeries} showLegend={pieChartShowLegend} showXGrid={barChartShowXGrid} showYGrid={barChartShowYGrid} svgClassName={classWhite} xLabel={barChartXLabel} xScale={barChartXScale} x={barChartName}/>
                                    </th>
                                    <th className='col-md-6 chart-pie align-right'>
                                        <PieChart width={pieChartWidth} height={pieChartWidth} margins={pieChartMargins} data={statisticsDataToday} chartSeries={pieChartSeries} radius={pieChartRadius} innerRadius={pieChartInnerRadius} showLegend={pieChartShowLegend} svgClassName={classWhite} value={pieChartValue} name={pieChartName}/>
                                    </th>
                                </tr>
                            );
                        })}
                    </ReactCSSTransitionGroup>
                </Table>
            </div>

        );
    }
}

export default Bar;
