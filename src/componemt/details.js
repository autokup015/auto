import React, { Component } from 'react';
import WindowSizeListener from 'react-window-size-listener';
import '../css/STDetail.css';
import '../css/newhome.css';
import '../css/table.css';
import QRCode from 'qrcode.react';
import { Link, browserHistory } from 'react-router';
import { auth, database, storage } from '../service/firebase';
import PrintQR from './printqr';
import store from '../redux';

var imgReload = require('../img/reload.png')
var p1 = require("../img/p1.jpg");
var p2 = require("../img/PG.png");
var Qr = require("../img/Qr.png");


var img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR0jmDib3ZYSLi7RKJUDQHyFhvIYB6Zv4RKO7vFRf943hRq2HiMQ'

class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: '',
            width: '',
            data: [],
            loading: true,
            pid: ''
        };
    }

    async componentDidMount() {
        let proid = this.props.params.id

        let uid = localStorage.getItem('uid');
        if (uid === '') {
            browserHistory.push("/");
        }

        const fbCon = database.ref(`/promotion/${proid}`)
        await fbCon.on('value', snap => {
            let data = snap.val()
            this.setState({ data, pid: proid, loading: false })
        })
        this.setState({ pid: proid })
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
            <div className='containercreate'>
                <WindowSizeListener onResize={windowSize => {
                    this.setState({ height: windowSize.windowHeight, width: windowSize.windowWidth })
                }} />

                <div className='headershopprofile' >
                    <Link to={"/home"} style={{ textDecoration: 'none' }} >
                        <div className='headeredbutton' >กลับ</div>
                    </Link>
                    <div className='headershop' > รายละเอียดโปรโมชั่น </div>
                    <Link to={`/report/${this.state.pid}`} style={{ textDecoration: 'none' }} >
                        <div className='headeredbutton'>รีพอท</div>
                    </Link>
                </div>

                <img className='' src={this.state.data.proimg || img} style={{ height: this.state.height <= this.state.width ? this.state.width * 0.45 : this.state.height * 0.45, width: '100%' }} />

                <div className='rowcontainer'>

                    <div className='columndtailscontainer'>
                        <img className='imgdetailcontainer' src={this.state.data.stampimg || img}
                            style={{
                                height: this.state.height <= this.state.width ? this.state.width * 0.2 : this.state.height * 0.2,
                                width: this.state.height <= this.state.width ? this.state.width * 0.2 : this.state.height * 0.2
                            }}
                        />
                        {/* <img className="imgsizee2" src={Qr}></img> */}
                        <div className='qrcontainer'>
                            <QRCode value={this.state.data.proid} size={this.state.height <= this.state.width ? this.state.width * 0.2 : this.state.height * 0.2} />
                            <Link to={`/printqr/${this.state.pid}`}  >
                                <button >Print QR</button>
                            </Link>
                        </div>
                    </div>



                    <div className='padding' style={{ flex: 1 }}>
                        <center>
                            <table className='table'>
                                <tr>
                                    <th>ชื่อโปรโมชั่น :</th>
                                    <td>{this.state.data.proname}</td>
                                </tr>
                                <tr>
                                    <th>รายละเอียดโปรโมชั่น</th>
                                    <td>{this.state.data.prodetails}</td>
                                </tr>
                                <tr>
                                    <th>ของรางวัล</th>
                                    <td>{this.state.data.reward}</td>
                                </tr>
                                <tr>
                                    <th>วันที่เริ่ม</th>
                                    <td>{this.state.data.start}</td>
                                </tr>
                                <tr>
                                    <th>วันที่สิ้นสุด</th>
                                    <td>{this.state.data.end}</td>
                                </tr>
                                <tr>
                                    <th>แลกได้ถึง</th>
                                    <td>{this.state.data.useto}</td>
                                </tr>
                                <tr>
                                    <th>ใช้แสตมป์ในการแลกจำนวน</th>
                                    <td>{this.state.data.maxstamp}</td>
                                </tr>
                                {/* <tr>
                                    <td>จำนวนครั้งที่แลก :</td>
                                    <td>2</td>
                                </tr> */}
                            </table>
                        </center>
                    </div>

                </div>

                <div style={{ height: this.state.height * 0.2, backgroundColor: '#ecf0f1' }} />
            </div>
        );
    }
}

export default Details;
