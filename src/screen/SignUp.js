import React, { Component } from 'react';
import { Link, withRouter, browserHistory } from 'react-router';
import WindowSizeListener from 'react-window-size-listener';
import '../css/newsignup.css';
import { auth, database, storage } from '../service/firebase';
import { FaUserTie, FaKey, FaCheckDouble } from 'react-icons/fa';
import store from '../redux';

// รหัสเข้า Firebase
var gmail = {
    email: 'stampcollection01230@gmail.com',
    password: 'stamp01230'
}

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: '',
            width: '',
            email: '',
            password: '',
            confirm: '',
            loginEmail: '',
            loginPass: '',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // localStorage.setItem('uid', '');
        let uid = localStorage.getItem('uid');
        console.log(uid)
        if (uid === null) {
            localStorage.setItem('uid', '');
        }
        else if (uid !== '') {
            browserHistory.push("/home");
        }

        // store.subscribe(() => {
        //     console.log('User id', store.getState())
        // })
    }

    saveUserId = () => {
        store.dispatch({
            type: 'SAVE_ID',
            userId: '1234'
        })
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    async handleLogin() {
        let email = this.state.loginEmail.toLowerCase()
        let password = this.state.loginPass
        await auth.signInWithEmailAndPassword(email, password).then((authData) => {
            let uid = authData.user.uid
            database.ref(`/shop/${uid}`).on('value', snapshot => {
                let data = snapshot.val()
                //check user role if data = null reject shop
                if (data != null) {
                    store.dispatch({
                        type: 'SAVE_ID',
                        userId: uid
                    })
                    localStorage.setItem('uid', uid);
                    browserHistory.push("/home");
                } else {
                    this.alertLoginFails('USER')
                }
            })
        }).catch(error => {
            // console.log(error.code)
            this.alertLoginFails(error.code)
        })
    }

    alertLoginFails(code) {
        switch (code) {
            case 'auth/invalid-email':
                alert('รูปแบบอีเมล์ไม่ถูกต้อง');
                break;
            case 'auth/wrong-password':
                alert('รหัสผ่านไม่ถูกต้อง');
                break;
            case 'auth/user-not-found':
                alert('ไม่พบอีเมลนี้ในระบบ');
                break;
            case 'USER':
                alert('อีเมลนี้ได้ลงทะเบียนแบบลูกค้า');
                break;
        }
    }

    async signupHandle() {
        let email = this.state.email.toLowerCase()
        let password = this.state.password
        let confirm = this.state.confirm

        if (password != confirm) {
            alert('รหัสผ่านไม่ตรงกัน');
        } else {
            await auth.createUserWithEmailAndPassword(email, password).then((authData) => {
                let uid = authData.user.uid
                let newUser = {
                    shopid: uid,
                    email: email,
                }
                database.ref(`/shop/${uid}`).set(newUser).then(() => {
                    database.ref(`/shop/${uid}`).on('value', snap => {
                        //Go to home
                        localStorage.setItem('uid', uid);
                        browserHistory.push("/home");
                    })
                })
            }).catch(error => {
                //Sign up error
                console.log(error.code)
                this.alertSignupFails(error.code)
            })
        }
    }

    alertSignupFails(code) {
        switch (code) {
            case 'auth/invalid-email':
                alert('รูปแบบอีเมล์ไม่ถูกต้อง');
                break;
            case 'auth/email-already-in-use':
                alert('อีเมลนี้ถูกใช้ไปแล้ว');
                break;
            case 'auth/weak-password':
                alert('กรุณาตั้งรหัสผ่านตั้งแต่ 6 - 16 ตัวอักษร');
                break;
        }
    }


    render() {
        return (
            <div className='container'>
                <WindowSizeListener onResize={windowSize => {
                    this.setState({ height: windowSize.windowHeight, width: windowSize.windowWidth })
                }} />
                <div style={{ height: this.state.height >= this.state.width ? this.state.height * 1.2 : this.state.width * 1.2, backgroundColor: '#ecf0f1' }}>
                    <div className='headercontainer' style={{ height: 'auto' }}>
                        <div className='logocontainer'> COLLECT ME!</div>
                        <div classname='logincontainer'>
                            <input className='inputlogin' type="text" name="loginEmail" placeholder='Enter - email'
                                value={this.state.loginEmail} onChange={this.handleChange} />
                            <input className='inputlogin' type="text" name="loginPass" placeholder='Enter - password' maxLength='16'
                                value={this.state.loginPass} onChange={this.handleChange} />
                            <button className='buttonlogin' onClick={() => {
                                this.handleLogin()
                            }}>เข้าสู่ระบบ</button>

                        </div>
                    </div>
                    {/* <div style={{
                        height: this.state.height >= this.state.width ? this.state.height * 0.125 : this.state.width * 0.125,
                        minHeight: this.state.height >= this.state.width ? this.state.height * 0.13 : this.state.width * 0.13,
                    }} ></div> */}
                    <div className='signupcontainer'>
                        {/*  */}
                        <div className='supcontainer' >
                            <center>
                                <img className='imglogo' src={require('../img/NewLogo.png')}
                                    style={{ height: this.state.height >= this.state.width ? this.state.height * 0.18 : this.state.width * 0.18, }} />
                                <div className='headersignup'>ลงทะเบียนที่นี่</div>
                            </center>
                            {/* -------------email------------- */}
                            <div className='textcontainer'>
                                <div className='titlesignup'> <FaUserTie className='iconscontainer' size={30} /> Email address :</div>
                                <input className='inputsignup' type="text" name="email" placeholder='Enter - email'
                                    value={this.state.email} onChange={this.handleChange}
                                />
                            </div>
                            {/* -------------password------------- */}
                            <div className='textcontainer'>
                                <div className='titlesignup'> <FaKey className='iconscontainer' size={30} /> Password :</div>
                                <input className='inputsignup' type="text" name="password" placeholder='Enter - password' maxLength='16'
                                    value={this.state.password} onChange={this.handleChange}
                                />
                            </div>
                            {/* -------------confirm------------- */}
                            <div className='textcontainer'>
                                <div className='titlesignup'> <FaCheckDouble className='iconscontainer' size={30} /> Confirm password :</div>
                                <input className='inputsignup' type="text" name="confirm" placeholder='Confirm - password' maxLength='16'
                                    value={this.state.confirm} onChange={this.handleChange}
                                />
                            </div>
                            <center>
                                <button className='buttonsignup' onClick={() => { this.signupHandle() }}>ลงทะเบียน</button>
                            </center>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(SignUp);

const backup = () => {
    return (
        <div>
            <div className="navbar-container">
                <h1 className="Text">Stamps Collection</h1>

                <form className="inputSignin">
                    <input className="login-input" placeholder="E-mail"></input>
                    <input className="login-input" placeholder="รหัสผ่าน" type="password"></input>
                    <Link to='home' params={{ test: '123 LO LO' }}>
                        <button className="sing-in-btn" >เข้าสู่ระบบ</button>
                    </Link>
                </form>
            </div>
            <div className="background" >
                <div >
                    <div className="heardersignup">
                        <h1>สมัครสมาชิก</h1>
                    </div>

                    <div className="signup">

                        <div className="testLeft">

                            <p className="textsup" type="email">email address</p>
                            <input className="inputt" placeholder="E-mail"></input>
                            <p className="textsup">รหัสผ่าน</p>
                            <input className="inputt" type="password" placeholder="รหัสผ่าน"></input>
                            <p className="textsup">ยืนยัน รหัสผ่าน</p>
                            <input className="inputt" type="password" placeholder="ยืนยันรหัสผ่าน"></input>

                        </div>



                    </div>
                    <div className="foodersignup">
                        <button className="button">ยืนยัน</button>

                    </div>
                </div>
            </div>
        </div>
    )
}