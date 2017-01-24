import React, {Component} from 'react';
import d3, {Chart} from 'react-d3-core';
import {PieChart} from 'react-easy-chart';
import {Table} from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/nb';
import Header from './components/Header.js';
import Weather from './components/Weather.js';
import BusTable from './components/BusTable.js';
import Bar from './components/Bar.js';
import './App.css';

class App extends Component {

    render() {
        return (
            <div className='container'>
                <Header></Header>
                <Weather></Weather>
                <h1>Til Sentrum</h1>
                <BusTable stopCode='16011404'></BusTable>
                <h1>Fra Sentrum</h1>
                <BusTable stopCode='16010404'></BusTable>
                <h1>Fra baren</h1>
                <Bar></Bar>
            </div>
        )
    }
}

export default App;
