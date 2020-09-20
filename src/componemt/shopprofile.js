import React, { Component } from 'react';
import WindowSizeListener from 'react-window-size-listener';
import { FaInfoCircle, FaMapMarkerAlt, FaClock, FaPhone, FaBookmark } from 'react-icons/fa';
import { auth, database, storage } from '../service/firebase';
import { Link, browserHistory } from 'react-router';
import '../css/shopprofile.css'
import store from '../redux';
var p1 = require("../img/PG.png");
var image = 'https://heroichollywood.com/wp-content/uploads/2018/09/dark-phoenix-trailer.jpg'
var image = {}
var text = 'This text is styled with some of the text formatting properties. The heading uses the text-align, text-transform, and color properties. The paragraph is indented, aligned, and the space between characters is specified. The underline is removed from this colored "Try it Yourself" link.'
class ShopProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: '',
            width: '',
            data: [],
            loading: true
        };
    }

    async componentWillMount() {
        var shopId = localStorage.getItem('uid');

        if (shopId === '') {
            browserHistory.push("/");
        }

        await database.ref(`/shopprofile/${shopId}`).on('value', snap => {
            let data = snap.val()
            if (data == null) {
                window.location = '/editprofile'
                console.log('No data')

            } else {
                // window.location = '/editprofile'
                this.setState({ data, loading: false })
                console.log(this.state.data)
            }
        })

    }

    render() {
        if (this.state.loading == true) {
            return (
                <div />
            )
        }
        return (
            <div className='container' >

                <WindowSizeListener onResize={windowSize => {
                    this.setState({ height: windowSize.windowHeight, width: windowSize.windowWidth })
                }} />

                <div className='headershopprofile' >
                    {/* <div className='headerlogo'/> */}
                    <Link to={"/home"} style={{ textDecoration: 'none' }} >
                        <div className='headeredbutton' >หน้าแรก</div>
                    </Link>
                    {/* ---------------------------------shop name--------------------------------- */}
                    <div className='headershop' > {this.state.data.shopname} </div>
                    <Link to={"/editprofile"} style={{ textDecoration: 'none' }} >
                        <div className='headeredbutton'>แก้ไขโปรไฟล์</div>
                    </Link>
                </div>

                {/* ---------------------------------image--------------------------------- */}
                <div className="imageuser"
                    style={{
                        backgroundImage: this.state.shopimage == '' ?
                            `url(${'https://nonukes.nl/wp-content/themes/gonzo/images/no-image-featured-image.png'})`
                            :
                            `url(${this.state.data.shopimage})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        height: this.state.height <= this.state.width ? this.state.width * 0.45 : this.state.height * 0.45, width: '100%'
                    }} >
                </div>

                <div className='detailcontainer'>
                    <div className='textcontainer'>
                        <FaInfoCircle className='iconscontainer' /> รายละเอียดร้าน : {this.state.data.details}
                    </div>
                    <div className='textcontainer'>
                        <FaBookmark className='iconscontainer' /> ร้านค้าเกี่ยวกับ : {this.state.data.category}
                    </div>
                    <div className='textcontainer'>
                        <FaMapMarkerAlt className='iconscontainer' /> ที่อยู่ : {this.state.data.address}
                    </div>
                    <div className='textcontainer'>
                        <FaPhone className='iconscontainer' /> เบอร์โทรศัพท์ : {this.state.data.phone}
                    </div>
                    <div className='textcontainer'>
                        <FaClock className='iconscontainer' /> เวลาเปิด - เวลาปิด: {this.state.data.opening + ' - ' + this.state.data.closing}
                    </div>
                </div>
            </div >

        );
    }
}

export default ShopProfile;

