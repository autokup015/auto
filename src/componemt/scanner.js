import React, { Component } from 'react';

import { Link, browserHistory } from 'react-router';
import QrReader from 'react-qr-scanner'

import '../css/printqr.css'


var p1 = require("../img/NewLogo.png");
var img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR0jmDib3ZYSLi7RKJUDQHyFhvIYB6Zv4RKO7vFRf943hRq2HiMQ'

class QrScan extends Component {
    state = {
        result: 'No result'
    }

    handleScan = data => {
        if (data) {

            this.setState({
                result: data
            })
        }
    }
    handleError = err => {
        console.error(err)
    }
    render() {
        return (
            <div>
                <QrReader
                    delay={300}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ width: '100%' }}
                    facingMode={'rear'}
                    legacyMode={true}
                />
                <p>{this.state.result}</p>
            </div>
        )
    }
}

export default QrScan;
