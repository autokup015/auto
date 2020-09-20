import React, { Component } from 'react';
import WindowSizeListener from 'react-window-size-listener';
import { Link, browserHistory } from 'react-router';
import QrReader from 'react-qr-scanner';
import '../css/report.css';
import { auth, database, storage } from '../service/firebase';
import store from '../redux';
import { Base64 } from 'js-base64';

class UserReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: '',
            width: '',
            data: [],
            pid: '',
            uid: '',
            used: 0,
            notUsed: 0,
            loading: true,
            holdStamp: 0,
            max: 0,
            userEmail: ''
        };
        // this.setStatusAlreadyReciveReward = this.setStatusAlreadyReciveReward.bind(this)
    }

    async componentDidMount() {
        let { pid, id } = this.props.params
        let uid = Base64.decode(id)
        await this.getUserEmail(uid)
        await this.getUserData(uid)
        await this.getHoldOnUserStamp(uid)
        await this.getMaxStamps()
    }

    async getUserEmail(uid) {
        const fbCon =  database.ref(`/user/${uid}/`)
        await fbCon.on('value', snap => {
            console.log(snap.val().email)
            this.setState({ userEmail: snap.val().email })
        })

    }

    async getUserData(uid) {
        let proid = this.props.params.pid
        let newFormatData = []
        await database.ref(`/rewards/${proid}`).on('value', snap => {
            let fbData = snap.val()
            if (fbData != null) {
                let numUsed = 0
                let numNotUsed = 0

                let keys = Object.keys(fbData)

                keys.forEach(key => {
                    if (fbData[key].userid === uid) {
                        if (fbData[key].status === true) {
                            numUsed++
                        } else if (fbData[key].status === false) {
                            numNotUsed++
                        }
                        newFormatData.push(fbData[key])
                    }
                })
                // console.log(newFormatData)
                this.setState({ data: newFormatData, loading: false, used: numUsed, notUsed: numNotUsed })
                console.log(numUsed + ' ' + numNotUsed)
                newFormatData = []
            }
            this.setState({ loading: false })
        })
    }

    async getHoldOnUserStamp(uid) {
        let proid = this.props.params.pid
        const fbCon = await database.ref(`/collection/${proid}/${uid}`)
        fbCon.on('value', snap => {
            let fbData = snap.val()
            // console.log(fbData)
            if (fbData != null) {

                console.log(snap.val())
                this.setState({ holdStamp: snap.val() })
            }
        })
    }

    async setStatusAlreadyReciveReward(key) {
        let proid = this.props.params.pid
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

    async getMaxStamps() {
        let proid = this.props.params.pid
        const fbCon = database.ref(`/promotion/${proid}`)
        await fbCon.on('value', snap => {
            let data = snap.val()
            this.setState({ max: data.maxstamp })
        })
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
                    <div className='headershop' > {this.state.userEmail} </div>
                    <div />
                    {/* <Link to={`/scan/${this.state.pid}`} style={{ textDecoration: 'none' }} >
                        <div className='headeredbutton' >แสกนQr</div>
                    </Link> */}
                    {/* <Link to={"/report"} style={{ textDecoration: 'none' }} >
                        <div className='headeredbutton'>รีพอท</div>
                    </Link> */}
                </div>

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

                            {this.state.data.map((item, index) => {
                                return (
                                    <tr key={item.key}>
                                        <td>{index + 1}</td>
                                        <td>{item.rewardid}</td>
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
                                    <td>{((this.state.used + this.state.notUsed) * this.state.max) + this.state.holdStamp}</td>
                                </tr>
                                <tr>
                                    <th>จำนวณสตมป์ที่ลูกค้ามีตอนนี้</th>
                                    <td>{this.state.holdStamp}</td>
                                </tr>
                                <tr>
                                    <th>จำนวณสตมป์ที่ลูกค้าใช้แล้ว</th>
                                    <td>{(this.state.used + this.state.notUsed) * this.state.max}</td>
                                </tr>
                                <tr>
                                    <th>แลกของรางวัลแล้วทั้งหมด</th>
                                    <td>{this.state.used + this.state.notUsed}</td>
                                </tr>
                                <tr>
                                    <th>แลกแล้วแต่ยังไม่ได้รับของ</th>
                                    <td>{this.state.notUsed}</td>
                                </tr>
                                <tr>
                                    <th>แลกแล้วและได้รับของรางวัลแล้ว</th>
                                    <td>{this.state.used}</td>
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

export default UserReport;
