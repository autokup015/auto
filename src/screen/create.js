import React, { Component } from 'react';
import WindowSizeListener from 'react-window-size-listener';
// import '../css/createstamps.css';
import { Link, withRouter, browserHistory } from 'react-router';
import '../css/create.css';
import { auth, database, storage } from '../service/firebase';
import store from '../redux';
var imgURL = 'https://s8754.pcdn.co/wp-content/uploads/edd/2012/10/file-uploads1.png'

var data = {
    proid: '',
    proname: '',
    proimage: '',
    prodetails: '',
    reward: '',
    stampimg: '',
    maxstamp: '',
    start: '',
    end: '',
    useto: ''
}

const shopid = 'utSugufoTKcF8dGavQ6PTyjiM903'

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: '',
            width: '',
            fileImageBanner: '',
            fileImageBannerURL: '',
            fileImageStamp: '',
            fileImageStampURL: '',
            proname: '',
            prodetails: '',
            reward: '',
            maxstamp: 5,
            start: '',
            end: '',
            useto: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleImageBanner = this.handleImageBanner.bind(this);
        this.handleImageStamps = this.handleImageStamps.bind(this);
    }

    async componentDidMount() {
        var newDateNow = this.formatDate(new Date())
        var ends = this.formatDate(new Date("2019-05-12"))
        console.log(newDateNow + ' ' + ends)

        const fbCon = database.ref(`/promotion`)
        await fbCon.on('value', snap => {
            console.log(snap.val())
        })
    }

    async savePicBanner(key) {
        let file = this.state.fileImageBanner
        const fb = storage.ref(`images/${file.name}`)
        var task = fb.put(file)
        await task.on('state_changed',
            function progress(snapshot) {
            },
            function error(err) {
                console.log(err)
            },
            function complete() {
                storage.ref('images').child(file.name).getDownloadURL().then(url => {
                    console.log(url);
                    database.ref(`/promotion/${key}/proimg`).set(url)
                })
            }
        );
    }

    async savePicStamp(key) {
        let file = this.state.fileImageStamp
        const fb = storage.ref(`images/${file.name}`)
        var task = fb.put(file)
        await task.on('state_changed',
            function progress(snapshot) {
            },
            function error(err) {
                console.log(err)
            },
            function complete() {
                storage.ref('images').child(file.name).getDownloadURL().then(url => {
                    console.log(url);
                    database.ref(`/promotion/${key}/stampimg`).set(url).then(() => {
                        //Go to home
                        browserHistory.goBack()
                    })
                })
            }
        );
    }

    async createNewPromotion() {
        const fbCon = database.ref(`/promotion`).push()
        var start = new Date(this.state.start)
        var end = new Date(this.state.end)
        var useto =new Date(this.state.useto)

        let fileBanner = this.state.fileImageBanner
        let fileStamp = this.state.fileImageStamp

        var proname = this.state.proname
        var details = this.state.prodetails
        var reward = this.state.reward
        var shopId = localStorage.getItem('uid');

        var key = fbCon.key
        var data = {
            proid: key,
            proname: this.state.proname,
            shopid: shopId,
            proimg: '',
            prodetails: this.state.prodetails,
            reward: this.state.reward,
            stampimg: '',
            maxstamp: this.state.maxstamp,
            start: this.state.start,
            end: this.state.end,
            useto: this.state.useto
        }
        // console.log(end > useto)
        // console.log(start >= end)
        if (proname === '' || details === '' || reward === '') {

            alert('กรุณากรอกข้อมูลให้ครบ')

        } else if (end > useto === true) {
            // console.log(start + ' ' + end + ' ' + useto)
            // console.log(end > useto)
            alert('รูปแบบของวันที่ไม่ถูกต้อง')

        } else if (start >= end === true) {
            // console.log(start + ' ' + end + ' ' + useto)
            // console.log(start >= end)
            alert('รูปแบบของวันที่ไม่ถูกต้อง')

        } else if (fileBanner === '' || fileStamp === '') {

            alert('กรุณาเลือกรูปภาพให้ครบ')

        } else if (shopId === '') {

            alert('กรุณาเข้าสู่ระบบก่อนทำรายการ')

        } else {

            await fbCon.set(data).then('value', snap => {
                console.log(snap.val())
            }).catch(e => {
                console.log(e)
            })
            await this.savePicBanner(key)
            await this.savePicStamp(key)
        }
    }

    formatDate(date) {
        var day = date.getDate();
        var monthIndex = date.getMonth() + 1;
        var year = date.getFullYear();

        return day + ' ' + monthIndex + ' ' + year;
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })

    }

    handleImageBanner(event) {
        // console.log(URL.createObjectURL(event.target.files[0]))
        if (!event.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
            alert('กรุณาอัพไฟล์ที่เป็นรูปภาพ .jpg .jpeg .png .gif');
        } else {
            this.setState({
                fileImageBanner: event.target.files[0],
                fileImageBannerURL: URL.createObjectURL(event.target.files[0])
            })
        }
    }

    handleImageStamps(event) {
        // console.log(URL.createObjectURL(event.target.files[0]))
        if (!event.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
            alert('กรุณาอัพไฟล์ที่เป็นรูปภาพ .jpg .jpeg .png .gif');
        } else {
            this.setState({
                fileImageStamp: event.target.files[0],
                fileImageStampURL: URL.createObjectURL(event.target.files[0])
            })
        }
    }

    render() {

        return (
            <div className='containerrender' >
                <WindowSizeListener onResize={windowSize => {
                    this.setState({ height: windowSize.windowHeight, width: windowSize.windowWidth })
                }} />
                <center>
                    <div className='titleheader'>
                        สร้างโปรโมชั่น
                    </div>
                    <div className='spaceline' />
                    <div className='imagebannercontainer'>
                        <img className='imagebanner' src={this.state.fileImageBannerURL == '' ? imgURL : this.state.fileImageBannerURL} alt={'Banner'}
                            style={{
                                height: this.state.height <= this.state.width ? this.state.width * 0.3 : this.state.height * 0.3, width: '100%'
                            }}
                        />
                    </div>
                    <div className='stampimgcontainer'>
                        <label className='stampbutton'>
                            เลือกไฟล์รูปภาพโปรโมชั่น
                            <input className='inputtile' type="file" onChange={this.handleImageBanner} />
                        </label>
                    </div>
                </center>
                <div className='columncontainer' >
                    <div className='rowcontainer' >
                        <div className='inputtile'>ชื่อโปรโมชั่น</div>
                        <input className='inputtext' placeholder="ชือโปรโมชั่น " name='proname' onChange={this.handleChange}></input>
                    </div>

                    <div className='rowcontainer'>
                        <div className='inputtile'>รายละเอียด โปรโมชั่น</div>
                        <textarea className='areainput' name='prodetails' onChange={this.handleChange} ></textarea>
                    </div>

                    <div className='rowcontainer'>
                        <div className='inputtile'>ของรางวัล</div>
                        <input className='inputtext' name='reward' onChange={this.handleChange}></input>
                    </div>

                    <div className='rowcontainer'>
                        <div className='inputtile'>วันที่เริ่ม</div>
                        <input className='selectinput' type="date" name='start' placeholder="dd/mm/yyyy" onChange={this.handleChange}></input>
                    </div>

                    <div className='rowcontainer'>
                        <div className='inputtile'>วันสิ้นสุดกิจกรรม</div>
                        <input className='selectinput' type="date" name='end' placeholder="dd/mm/yyyy" onChange={this.handleChange}></input>
                    </div>

                    <div className='rowcontainer'>
                        <div className='inputtile'>สามารถแลกของรางวัลได้ถึง</div>
                        <input className='selectinput' type="date" name='useto' placeholder="dd/mm/yyyy" onChange={this.handleChange}></input>
                    </div>

                    <div className='rowcontainer'>
                        <div className='inputtile'>ใช้แสมตป์จำนวน</div>
                        <select className='selectinput' name='maxstamp' value={this.state.maxstamp} onChange={this.handleChange} >
                            <option value="5">5</option>
                            <option value="7">7</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </div>

                    <div className='supcolumncontainer ' >
                        <center>
                            <div className='inputtile'>อัพโหลดรูปของรางวัล</div>
                            <img className='imagestamp' src={this.state.fileImageStampURL == '' ? imgURL : this.state.fileImageStampURL} alt={'Stamp'}
                                style={{ height: this.state.height <= this.state.width ? this.state.width * 0.15 : this.state.height * 0.15, width: this.state.height <= this.state.width ? this.state.width * 0.15 : this.state.height * 0.15 }}
                            />
                            <div className='stampimgcontainer' >
                                <label className='stampbutton'>
                                    เลือกไฟล์รูปภาพของรางวัล
                                    <input className='inputtile' type="file" onChange={this.handleImageStamps} />
                                </label>
                            </div>
                        </center>
                    </div>
                </div>
                <div className='spaceline' />
                <center>
                    <button className='buttonsave' onClick={() => { this.createNewPromotion() }}>Save</button>
                </center>
            </div>
        );
    }
}

export default Create;
