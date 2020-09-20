import React, { Component } from 'react';
var p1 = require("../img/p1.jpg");
var Qr = require("../img/Qr.png");
class StampPromotion extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div >
                <h1>Stamp No.1</h1>
                <div className="setcsp">
                    <img className="imgsize2" src={p1}></img>
                    <img className="Qr" src={Qr}></img>

                </div>
                <div className="text1">
                    <h3 >Stamp Description</h3>
                    <div className="det">
                        <p >xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                        <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                        <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                        <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                    </div>
                    <div >
                        <h3 >Promotion No.1</h3>
                        <div className="det">
                            <p  >xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                            <p>    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                            <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                            <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                        </div>
                        <div className="promotiondate">
                            <h4>Start date:24/01/2562</h4>
                            <h4>End date:24/12/2570</h4>
                        </div>
                    </div>
                    <div>
                        <h3>Use stamps: 3</h3>
                    </div>

                </div>
            </div>

        );
    }
}

export default StampPromotion;
