import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { NavLink, Route, HashRouter } from 'react-router-dom';
import WindowSizeListener from 'react-window-size-listener';
import ListStamps from '../componemt/listStamps';
import CreateStamps from '../componemt/createStamps';
import Report from '../componemt/report';
import '../css/newhome.css';
import Details from '../componemt/details';
import StampPromotion from '../componemt/stampPromotion';
import Promotion from './promotion';
import Create from './create';
import { create } from 'domain';
import { auth, database, storage } from '../service/firebase';
import store from '../redux';

var imgUrl = 'https://uh8yh30l48rpize52xh0q1o6i-wpengine.netdna-ssl.com/wp-content/uploads/2014/05/header-image-photo-rights.png'


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: '',
            width: '',
        };
        // this.logoutFromFirebase = this.logoutFromFirebase.bind(this)
    }

    componentDidMount() {
        
        this.checkSession()
        // var uid = localStorage.getItem('uid');
        // console.log(uid)
        // console.log('User id', store.getState())
    }

    checkSession() {
        let uid = localStorage.getItem('uid');

        if (uid === '' ) {
            browserHistory.push("/");
        }
    }

    logoutFromFirebase() {
        auth.signOut().then(function () {
            localStorage.setItem('uid', '');
            browserHistory.push("/");
            // console.log('Logout')
            // Sign-out successful.
        }, function (error) {
            // An error happened.
        });
    }

    render() {
        return (
            <HashRouter>
                <div className='containerhome'>
                    <WindowSizeListener onResize={windowSize => {
                        this.setState({ height: windowSize.windowHeight, width: windowSize.windowWidth })
                    }} />
                    <div className='headerhome' style={{ height: this.state.height >= this.state.width ? this.state.height * 0.07 : this.state.width * 0.07 }} >
                        <img className='paddingimg'
                            src={require('../img/NewLogo.png')}
                            style={{
                                height: this.state.height >= this.state.width ? this.state.height * 0.06 : this.state.width * 0.06,
                                width: this.state.height >= this.state.width ? this.state.height * 0.06 : this.state.width * 0.06,
                                justifyContent: 'center',
                                alignSelf: 'center'
                            }}
                        />
                        <div className='webtitle'>COLLECT ME!</div>

                    </div>
                    <div className='fixedheader' style={{ height: this.state.height >= this.state.width ? this.state.height * 0.07 : this.state.width * 0.07 }} />
                    <div className='rowcontainerhome' >
                        <div className='subheadercontain' style={{
                            width: this.state.height >= this.state.width ? this.state.height * 0.2 : this.state.width * 0.2,
                            maxWidth: this.state.height >= this.state.width ? this.state.height * 0.2 : this.state.width * 0.2,
                            height: this.state.height
                        }}>
                            <center >
                                <Link to='/shopprofile' className='navtext'>
                                    <div>โปรไฟล์</div>
                                </Link>

                                <NavLink to="/" exact className='navtext' activeClassName='activenav'>
                                    <div >หน้าแรก</div>
                                </NavLink>

                                <NavLink to="/create" className='navtext' activeClassName='activenav' >
                                    <div >สร้างโปรโมชั่น</div>
                                </NavLink>
                                <div className='logoutcontainer'>
                                    <div className='logouttext'
                                        onClick={() => {
                                            this.logoutFromFirebase()
                                        }}
                                    >ออกจากระบบ</div>
                                </div>
                            </center>
                        </div>
                        {/* ห้ามลบ 
                        this is space banner */}
                        <div className='spacebanner' style={{
                            width: this.state.height >= this.state.width ? this.state.height * 0.2 : this.state.width * 0.2,
                            minWidth: this.state.height >= this.state.width ? this.state.height * 0.2 : this.state.width * 0.2,
                            maxWidth: this.state.height >= this.state.width ? this.state.height * 0.2 : this.state.width * 0.2,
                            height: this.state.height
                        }} />

                        <div style={{ flex: 1 }}>
                            <Route exact path='/' component={Promotion} />
                            <Route path='/create/' component={Create} />
                            <div style={{ height: this.state.height * 0.3, backgroundColor: '#ecf0f1' }} />
                        </div>

                    </div>

                </div>
            </HashRouter>
        );
    }
}


export default Home;
