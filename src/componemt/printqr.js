import React, { Component } from 'react';
import WindowSizeListener from 'react-window-size-listener';
import QRCode from 'qrcode.react';
import '../css/printqr.css'
import { auth, database, storage } from '../service/firebase';

var p1 = require("../img/NewLogo.png");
var img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR0jmDib3ZYSLi7RKJUDQHyFhvIYB6Zv4RKO7vFRf943hRq2HiMQ'
var imgReload = require('../img/reload.png')
class PrintQR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: '',
            width: '',
            data: [],
            pid: this.props.params.id,
            loading:true
        };
    }

    async componentDidMount() {
        let proid = this.props.params.id
        const fbCon = database.ref(`/promotion/${proid}`)

        await fbCon.on('value', snap => {
            let data = snap.val()
            this.setState({ data, loading: false })
            console.log(data)
            setTimeout(function () {
                this.print()
            }, 1000);
        })


    }

    print() {
        window.print();
    }

    render() {
        if (this.state.loading == true) {
            return (
                <center className='centerflex'>
                    <img src={imgReload} className="App-logo" alt="reload" />
                </center>
            )
        }
        return (
            <div>
                <WindowSizeListener onResize={windowSize => {
                    this.setState({ height: windowSize.windowHeight, width: windowSize.windowWidth })
                }} />
                <div className='columncontainerprint'>
                    <img src={this.state.data.proimg || img} style={{ height: this.state.height <= this.state.width ? this.state.width * 0.4 : this.state.height * 0.4, width: '100%' }} />
                    <div className='qrprintcontainer'>
                        <img src={this.state.data.stampimg || img} style={{
                            height: this.state.height <= this.state.width ? this.state.width * 0.2 : this.state.height * 0.2,
                            width: this.state.height <= this.state.width ? this.state.width * 0.2 : this.state.height * 0.2,
                        }}></img>
                        <QRCode value={this.state.pid} size={this.state.height <= this.state.width ? this.state.width * 0.2 : this.state.height * 0.2} />
                    </div>
                </div>
            </div>
        );
    }
}

export default PrintQR;
