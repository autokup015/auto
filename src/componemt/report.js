import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import WindowSizeListener from 'react-window-size-listener';
import { Link, browserHistory } from 'react-router';
import QrReader from 'react-qr-scanner';
import '../css/report.css';
import { auth, database, storage } from '../service/firebase';
import store from '../redux';
import { Base64 } from 'js-base64';

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: '',
            width: '',
            data: [],
            searchitem: [],
            searchText: '',
            holdStamp: 0,
            numberRewards: 0,
            totalStamp: 0,
            max: 0,
            pid: '',
            hideCamera: true,
            result: '',
            loading: true
        };
        // this.setStatusAlreadyReciveReward = this.setStatusAlreadyReciveReward.bind(this)
    }

    async componentDidMount() {
        let proid = this.props.params.id
        let uid = localStorage.getItem('uid');
        if (uid === '') {
            browserHistory.push("/");
        }

        this.getDataFromFirebase()
        this.getTotalStamp()
        this.getStampOnRewards()
        this.setState({ pid: proid })
        // console.log(proid)
    }

    async getDataFromFirebase() {
        let proid = this.props.params.id
        let newFormatData = []
        await database.ref(`/rewards/${proid}`).on('value', snap => {
            let fbData = snap.val()
            if (fbData != null) {
                let keys = Object.keys(fbData)
                keys.forEach(key => {
                    newFormatData.push(fbData[key])
                })
                // console.log(newFormatData)
                this.setState({ data: newFormatData, searchitem: newFormatData, loading: false })
                newFormatData = []
            }
            this.setState({ loading: false })
        })
    }

    async setStatusAlreadyReciveReward(key) {
        let proid = this.props.params.id
        // const fbCon = await database.ref(`/rewards/${proid}/${key}/status`)
        await database.ref(`/rewards/${proid}/${key}/status`).once('value', snap => {
            if (snap.val() != null) {
                if (snap.val() !== true) {
                    database.ref(`/rewards/${proid}/${key}/status`).set(true, function (error) {
                        if (error) {
                            // The write failed...
                            console.log(error)
                        } else {
                            alert('รับรางวัลสำเร็จ');
                            // Data saved successfully!
                        }
                    })
                } else {
                    alert('รายการนี้ได้รับรางวัลไปแล้ว');
                }
            } else {
                alert('ไม่พบรายการ กรุณาลองใหม่');
            }
        })


        // this.getDataFromFirebase()
        // this.getTotalStamp()
        // this.getStampOnRewards()
        // window.location.reload();
    }

    async getTotalStamp() {
        let total = 0
        let proid = this.props.params.id
        const fbCon = await database.ref(`/collection/${proid}`)
        fbCon.on('value', snap => {
            let fbData = snap.val()
            // console.log(fbData)
            if (fbData != null) {
                let keys = Object.keys(fbData)
                keys.forEach(key => {
                    total += fbData[key]
                    // console.log(fbData[key])
                })
                // console.log(total)
                this.setState({ holdStamp: total })
                total = 0
            }
        })
    }

    async getStampOnRewards() {
        let proid = this.props.params.id
        const fbCon = await database.ref(`/promotion/${proid}`)
        fbCon.on('value', snap => {
            let fbData = snap.val()
            if (fbData != null) {
                database.ref(`/rewards/${proid}`).on('value', snapshort => {
                    // console.log(snapshort.numChildren())
                    // console.log(fbData.maxstamp)
                    this.setState({ max: fbData.maxstamp, numberRewards: snapshort.numChildren() })
                })
            }
        })
    }

    formatDate(date) {
        var day = date.getDate();
        var monthIndex = date.getMonth() + 1;
        var year = date.getFullYear();

        return day + ' ' + monthIndex + ' ' + year;
    }

    filterRewardId = (event) => {
        const searchResult = this.state.data.filter(result => {
            let search = result.rewardid.toLowerCase()
            return search.indexOf(
                event.target.value.toLowerCase()) !== -1
        });
        this.setState({ searchText: event.target.value, searchitem: searchResult });
    }


    handleScan = data => {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        if (data) {
            if (pattern.test(data) === true) {
                alert('ไม่พบรายการ กรุณาลองใหม่');
            } else {
                this.setStatusAlreadyReciveReward(data)
                this.setState({
                    hideCamera: true
                })
            }
        }
    }

    handleError = err => {
        console.error(err)
    }

    renderCamera() {
        if (this.state.hideCamera == true) {
            return (<div />)
        }
        return (
            <div className='paddingTop'>
                <center>
                    <QrReader
                        delay={300}
                        onError={this.handleError}
                        onScan={this.handleScan}
                        facingMode={'rear'}
                        // legacyMode={true}
                        style={{
                            width: this.state.height >= this.state.width ? this.state.height * 0.45 : this.state.width * 0.45,
                            height: this.state.height >= this.state.width ? this.state.height * 0.30 : this.state.width * 0.30,
                        }}
                    />
                </center>
            </div>
        )
    }
    render() {
        return (
            <div className='containercreate'>
                <WindowSizeListener onResize={windowSize => {
                    this.setState({ height: windowSize.windowHeight, width: windowSize.windowWidth })
                }} />
                <div className='headerreport' >
                    <Link onClick={browserHistory.goBack} style={{ textDecoration: 'none' }} >
                        <div className='headeredbutton' >กลับ</div>
                    </Link>
                    <div className='headershop' > รายละเอียดโปรโมชั่น </div>
                    <div />
                    {/* <Link to={`/scan/${this.state.pid}`} style={{ textDecoration: 'none' }} >
                        <div className='headeredbutton' >แสกนQr</div>
                    </Link> */}
                    {/* <Link to={"/report"} style={{ textDecoration: 'none' }} >
                        <div className='headeredbutton'>รีพอท</div>
                    </Link> */}
                </div>
                <div className='textinputcontainer' >
                    <input className='inputSearch' type="text" name="searchText" placeholder='ค้นหาด้วยรหัส' onChange={this.filterRewardId} />
                    <button className='scanbutton' onClick={() => { this.setState({ hideCamera: !this.state.hideCamera }) }}>Scan Qr</button>
                </div >
                {this.renderCamera()}
                <div className='padding'>

                    <center>
                        <table className='tablereport' >
                            <tr>
                                <th>ลำดับ</th>
                                <th>รหัส</th>
                                <th>วันที่แลก</th>
                                <th>ชื่อโปรโมชั่น</th>
                                <th>รางวัล</th>
                                <th>รับของรางวัล</th>
                            </tr>

                            {this.state.searchitem.map((item, index) => {
                                return (
                                    <tr key={item.key}>
                                        <td>{index + 1}</td>
                                        <td>
                                        <Link to={`/userreport/${this.state.pid}/${Base64.encode(item.userid)}`}  >
                                                {item.rewardid}
                                            </Link>
                                        </td>
                                        <td>{item.date}</td>
                                        <td>{item.proname}</td>
                                        <td>{item.reward}</td>
                                        {item.status == false ?
                                            <td className='tdHover'
                                                onClick={() => {
                                                    this.setStatusAlreadyReciveReward(item.key)
                                                }}
                                            >ยังไม่ได้รับ</td>
                                            :
                                            <td>ได้รับแล้ว</td>}
                                    </tr>
                                )
                            })}
                        </table>
                    </center>
                    <div className='padding'>
                        <center>
                            <table className='tablefooter' >
                                <tr>
                                    <th>จำนวณสตมป์ทั้งหมด</th>
                                    <td>{this.state.holdStamp + (this.state.numberRewards * this.state.max)}</td>
                                </tr>
                                <tr>
                                    <th>จำนวณสตมป์ที่ลูกค้ามีทั้งหมด</th>
                                    <td>{this.state.holdStamp}</td>
                                </tr>
                                <tr>
                                    <th>จำนวณสตมป์ที่ถูกใช้แล้วทั้งหมด</th>
                                    <td>{this.state.numberRewards * this.state.max}</td>
                                </tr>
                                {/* <tr>
                                    <td>2</td>
                                    <td>00000000</td>
                                    <td>proname</td>
                                    <td>rewards</td>
                                    <td>status</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>00000000</td>
                                    <td>proname</td>
                                    <td>rewards</td>
                                    <td>status</td>
                                </tr> */}
                            </table>
                        </center>
                    </div>
                </div>
                <div style={{ height: this.state.height * 0.7, backgroundColor: '#ecf0f1' }} />
            </div>

        );
    }
}

export default Report;
