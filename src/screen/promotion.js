import React, { Component } from 'react';
import WindowSizeListener from 'react-window-size-listener';
import { Link } from 'react-router';
import '../css/newhome.css';
import { auth, database, storage } from '../service/firebase';
import store from '../redux';

var imgReload = require('../img/reload.png')
var imgUrl = 'https://uh8yh30l48rpize52xh0q1o6i-wpengine.netdna-ssl.com/wp-content/uploads/2014/05/header-image-photo-rights.png'
const shopid = 'utSugufoTKcF8dGavQ6PTyjiM903'

class Promotion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: '',
            width: '',
            data: '',
            loading: true,
            datanull: true
        };
    }
    async componentDidMount() {
        const fbCon = database.ref(`/promotion/`)
        let date = new Date()
        let shopId = localStorage.getItem('uid');
        console.log(date)
        await fbCon.on('value', snap => {
            if (snap.val() != null || snap.val() != undefined) {
                let data = snap.val()
                let keys = Object.keys(data)
                let newDataFormat = []
                keys.forEach((key) => {
                    if (data[key].shopid == shopId) {
                        newDataFormat.push(data[key])
                    }
                })
                this.setState({ data: newDataFormat, loading: false, datanull: false })
            } else {
                console.log('ไม่มีข้อมูล')
                this.setState({ loading: false, datanull: true })
            }
        })
    }

    render() {
        if (this.state.loading == true) {
            return (
                <center className='centerflex'>
                    <img src={imgReload} className="App-logo" alt="reload" />
                </center>
            )
        } else if (this.state.datanull == true && this.state.loading == false) {
            return (
                <center className='centerflex'>
                    <div className='titleheader'> ยังไม่มีโปรโมชั่น </div>
                </center>
            )
        } else {
            return (
                <div className='containerrender'>
                    <WindowSizeListener onResize={windowSize => {
                        this.setState({ height: windowSize.windowHeight, width: windowSize.windowWidth })
                    }} />
                    {this.state.data.map((item) => {
                        return (
                            <div className='imgcontainer' key={item.proid}>
                                <div className="imagbox"
                                    style={{
                                        backgroundImage: `url(${item.proimg})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        height: this.state.height <= this.state.width ? this.state.width * 0.3 : this.state.height * 0.3, width: '100%'
                                    }} />

                                <div className='bannercontainer'>
                                    <div className='titlecontainer'>
                                        {item.proname}
                                    </div>
                                </div>
                                <Link to={`/promotiondetail/${item.proid}`}>
                                    <div className='buttonviewmore'>View more</div>
                                </Link>
                            </div>
                        )
                    })}

                </div>

            );
        }
    }
}

export default Promotion;
