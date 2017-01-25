import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TransitionGroup from 'react-addons-transition-group';
import D3, {BarChart, PieChart, Color} from 'react-d3-basic';
import {Table, Grid, Row, Col} from 'react-bootstrap';
import 'moment/locale/nb';
import '../App.css';

"use strict";


class Bar extends Component {

    arraysEqual(a, b) {
        return JSON.stringify(a)==JSON.stringify(b);
    }

    constructor(props) {
        super(props);

        this.state = {
            orders: [],
            statisticsTotal: [],
            statisticsToday: [],
            trigger: [{id: 0}],
        };
    }

    componentWillMount() {
        var app = this;
        app.loadOrdersData();
        app.loadStatisticsData();
        setInterval(() => {
            app.loadOrdersData();
        }, 500);
        setInterval(() => {
            app.loadStatisticsData();
        }, 5000);
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
            if(!this.arraysEqual(responseJson,this.state.statisticsTotal)) {
                this.setState({trigger: [{id: (this.state.trigger[0].id + 1)}], statisticsTotal: responseJson})
            }else{
                this.setState({statisticsTotal: responseJson})
            }
        }).catch((error) => {
            console.error(error);
        })
        fetch('https://api.founder.no/bar/orders_statistics_today').then((response) => response.json()).then((responseJson) => {
            if(!this.arraysEqual(responseJson,this.state.statisticsToday)) {
                this.setState({trigger: [{id: (this.state.trigger[0].id + 1)}], statisticsToday: responseJson})
            }else{
                this.setState({statisticsToday: responseJson})
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    render() {
        var trigger = this.state.trigger;
        var orders = this.state.orders;
        var statisticsTotal = this.state.statisticsTotal;
        var statisticsToday = this.state.statisticsToday;

        var statisticsDataTotal = []
        var statisticsDataToday = [];
        var pieChartSeries = [];

        var pieChartWidth = 390,
            pieChartRadius = Math.min(pieChartWidth, pieChartWidth - 220) / 2,
            pieChartInnerRadius = 50,
            pieChartMargins = {top: 10, bottom: 50, left: 200, right: 200},
            pieChartShowLegend = false,
            pieChartName = function (d) {
                return d.name;
            },
            pieChartValue = function (d) {
                return d.value;
            }

        var barChartWidth = 350,
            barChartHeight = 400,
            barChartMargins = {top: 10, bottom: 100, left: 20, right: 20},
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
            barChartName = function (d) {
                return d.name;
            }

        if (statisticsTotal.length) {
            statisticsTotal.map(function (statistic) {
                statisticsDataTotal.push({
                    name: statistic.firstname.charAt(0) + '. ' + statistic.lastname,
                    drinks: parseInt(statistic.count)
                });


            })
        }

        if (statisticsToday.length){
            statisticsToday.map(function (statistic) {
                pieChartSeries.push({
                    name: statistic.lastname + ' (' + statistic.count + ')',
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
                <Table condensed responsive>
                    <thead>
                        <tr>
                            <th className='col-md-4'>Person</th>
                            <th className='col-md-5'>Drink</th>
                            <th className='col-md-3 align-right'>Status</th>
                        </tr>
                    </thead>
                    <ReactCSSTransitionGroup transitionName="animation" component="tbody" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
                        {orders.map((order) => {
                            return (
                                <tr>
                                    <td className='col-md-4'>{order.firstname.charAt(0)}. {order.lastname}</td>
                                    <td className='col-md-5'>{order.drink_name}</td>
                                    <td className='col-md-3 align-right'>I kø</td>
                                </tr>
                            );
                        })}
                    </ReactCSSTransitionGroup>
                </Table>
                <Table condensed responsive>
                    <thead>
                    <tr>
                        <th className='col-md-6 stastistics-header'><h1>Bestilt totalt</h1></th>
                        <th className='col-md-6 stastistics-header'><h1>Bestilt i dag</h1></th>
                    </tr>
                    </thead>
                </Table>
                <Table condensed responsive>
                    <ReactCSSTransitionGroup transitionName="animation" component="thead" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
                        {trigger.map((key) => {
                            return (
                                <tr key={key.id}>
                                    <th className='col-md-6 chart-bar'>
                                        <BarChart
                                        width= {barChartWidth}
                                        height= {barChartHeight}
                                        margins = {barChartMargins}
                                        data= {statisticsDataTotal}
                                        chartSeries = {barChartSeries}
                                        showLegend= {pieChartShowLegend}
                                        showXGrid = {barChartShowXGrid}
                                        showYGrid = {barChartShowYGrid}
                                        svgClassName= {classWhite}
                                        xLabel= {barChartXLabel}
                                        xScale= {barChartXScale}
                                        x= {barChartName}
                                        /></th>
                                    <th className='col-md-6 chart-pie' >
                                        <PieChart
                                        width= {pieChartWidth}
                                        height= {pieChartWidth}
                                        margins = {pieChartMargins}
                                        data= {statisticsDataToday}
                                        chartSeries= {pieChartSeries}
                                        radius= {pieChartRadius}
                                        innerRadius = {pieChartInnerRadius}
                                        showLegend= {pieChartShowLegend}
                                        svgClassName= {classWhite}
                                        value = {pieChartValue}
                                        name = {pieChartName}
                                    /></th>
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
