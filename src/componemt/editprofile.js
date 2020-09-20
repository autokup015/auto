import React, { Component } from 'react';
import WindowSizeListener from 'react-window-size-listener';
import { FaStore, FaInfoCircle, FaMapMarkerAlt, FaClock, FaPhone, FaBookmark } from 'react-icons/fa'
import { auth, database, storage } from '../service/firebase';
// import '../css/editprofile2.css'
import { Link, browserHistory } from 'react-router';
import '../css/editprofile.css'
import store from '../redux';

var p1 = require("../img/PG.png");
var text = 'This text is styled with some of the text formatting properties. The heading uses the text-align, text-transform, and color properties. The paragraph is indented, aligned, and the space between characters is specified. The underline is removed from this colored "Try it Yourself" link.'

// รหัสเข้า Firebase
var gmail = {
    email: 'stampcollection01230@gmail.com',
    password: 'stamp01230'
}

class EditProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: '',
            width: '',
            file: null,
            fileURL: '',
            shopname: '',
            details: '',
            category: '',
            address: '',
            phone: '',
            opening: '',
            closing: '',
            alredyStatus: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleImage = this.handleImage.bind(this);
    }

    async componentWillMount() {
        var shopId = localStorage.getItem('uid');

        if (shopId === '') {
            browserHistory.push("/");
        }

        await database.ref(`/shopprofile/${shopId}`).on('value', snap => {
            let data = snap.val()
            if (data == null) {
                this.setState({ alredyStatus: false })
                console.log('No data')
            } else {
                this.setState({
                    shopname: data.shopname,
                    details: data.details,
                    category: data.category,
                    address: data.address,
                    phone: data.phone,
                    fileURL: data.shopimage,
                    opening: data.opening,
                    closing: data.closing,
                    loading: false
                })
                console.log(this.state)
            }
        })
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })

    }

    handleImage(event) {
        // console.log(URL.createObjectURL(event.target.files[0]))
        if (!event.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
            alert('กรุณาอัพไฟล์ที่เป็นรูปภาพ .jpg .jpeg .png .gif');
        } else {
            this.setState({
                file: event.target.files[0],
                fileURL: URL.createObjectURL(event.target.files[0])
            })
        }
    }

    async saveData() {
        const shopid = localStorage.getItem('uid');
        const file = this.state.file;

        if (file != null) {

            let uploadTask = storage.ref(`images/${file.name}`).put(file);
            await uploadTask.on('state_changed',
                (snapshot) => {
                    // progrss function ....
                },
                (error) => {
                    // error function ....
                    console.log(error);
                },
                () => {
                    // complete function ....
                    storage.ref('images').child(file.name).getDownloadURL().then(url => {
                        console.log(url);
                        this.setState({ url });
                        var profile = {
                            shopname: this.state.shopname,
                            details: this.state.details,
                            address: this.state.address,
                            shopimage: url,
                            category: this.state.category,
                            phone: this.state.phone,
                            opening: this.state.opening,
                            closing: this.state.closing
                        }

                        database.ref(`/shopprofile`).child(shopid).update(profile).then(() => {
                            browserHistory.goBack()
                        }).catch(e => {
                            console.log(e)
                        })
                    })
                }
            );
        } else {
            var profile = {
                shopname: this.state.shopname,
                details: this.state.details,
                address: this.state.address,
                category: this.state.category,
                phone: this.state.phone,
                opening: this.state.opening,
                closing: this.state.closing
            }
            database.ref(`/shopprofile`).child(shopid).update(profile).then(() => {
                console.log('success')
                browserHistory.goBack()
            }).catch(e => {
                console.log(e)
            })
        }
    }

    render() {
        if (this.state.loading == true) {
            return (
                <div></div>
            )
        }
        return (
            <div className='container' >

                <WindowSizeListener onResize={windowSize => {
                    this.setState({ height: windowSize.windowHeight, width: windowSize.windowWidth })
                }} />

                <div className='headershopprofile' >
                    {/* <div className='headerlogo'/> */}
                    {this.state.alredyStatus == true ?
                        <Link to={"/shopprofile"} style={{ textDecoration: 'none' }} >
                            <div className='headereditbutton' >กลับ</div>
                        </Link>
                        :
                        <Link to={"/home"} style={{ textDecoration: 'none' }} >
                            <div className='headereditbutton' >กลับ</div>
                        </Link>
                    }
                    <div className='headershop'>แก้ไขโปรไฟล์</div>
                    <div />


                </div>

                {/* ---------------------------------image--------------------------------- */}
                <div className="imageuser"
                    style={{
                        backgroundImage: this.state.fileURL == '' ?
                            `url(${''})`
                            :
                            `url(${this.state.fileURL})`
                        ,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        height: this.state.height <= this.state.width ? this.state.width * 0.45 : this.state.height * 0.45, width: '100%'
                    }} >
                    {/* ---------------------------------Upload image button--------------------------------- */}
                    <div className='buttonedit'>
                        <input className='editimage' type="file" onChange={this.handleImage} />
                    </div>
                </div>

                <div className='detailcontainer'>

                    <div className='textcontainer'>
                        <FaStore className='iconscontainer' /> ชื่อร้านค้า :
                        <br />
                        <input className='inputcontainer' type="text" name="shopname" value={this.state.shopname} onChange={this.handleChange} maxLength="20" />
                    </div>

                    <div className='textcontainer'>
                        <FaInfoCircle className='iconscontainer' /> รายละเอียดร้าน :
                        <br />
                        <textarea className='textareacontainer' name='details' value={this.state.details} onChange={this.handleChange} maxLength="250" ></textarea>
                    </div>

                    <div className='textcontainer'>
                        <FaBookmark className='iconscontainer' /> ร้านค้าเกี่ยวกับ :
                        <br />
                        <select className='selectcontainer' name='category' value={this.state.category} onChange={this.handleChange}>
                            <option value="restaurant">Restaurant</option>
                            <option value="cafe">Cafe</option>
                        </select>
                    </div>

                    <div className='textcontainer'>
                        <FaMapMarkerAlt className='iconscontainer' /> ที่อยู่ :
                        <br />
                        <textarea className='textareacontainer' name='address' value={this.state.address} onChange={this.handleChange} maxLength="250" ></textarea>
                    </div>

                    <div className='textcontainer'>
                        <FaPhone className='iconscontainer' /> เบอร์โทรศัพท์ :
                        <br />
                        <input className='inputcontainer' type="text" name="phone" placeholder='000-000-0000' value={this.state.phone} onChange={this.handleChange} />
                    </div>

                    <div className='textcontainer'>
                        <FaClock className='iconscontainer' /> เวลาเปิด - เวลาปิด :
                        <br />
                        <input className='timeinputcontainer' type="text" name="opening" placeholder='' value={this.state.opening} onChange={this.handleChange} />
                        {' - '}
                        <input className='timeinputcontainer' type="text" name="closing" placeholder='' value={this.state.closing} onChange={this.handleChange} />
                    </div>
                    <div className='footercontainer' onClick={() => this.saveData()}>
                        <button className='savebutton' >บันทึก</button>
                    </div>

                </div>
                <div style={{ height: this.state.height * 0.3, backgroundColor: '#ecf0f1' }} />
            </div >

        );
    }
}



export default EditProfile;
