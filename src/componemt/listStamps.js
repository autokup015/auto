import React, { Component } from 'react';
import '../css/list_starmps.css';
import { Link } from 'react-router';
import { NavLink, Route, HashRouter } from 'react-router-dom';

var p1 = require("../img/p1.jpg");
var p2 = require("../img/p2.jpg");
var p3 = require("../img/p3.jpg");
var p4 = require("../img/p4.jpg");

var name = 'Stamp No.1'
var Stamps = [
    { Name: 'Stamp 1' }
]

class ListStamps extends Component {
    render() {
        return (
            <div className="testcontainer">
                <div className="header">
                    <h1>โปรโมชั่น</h1>
                </div>

                <div className="testDetail">

                    <center>
                        <NavLink to={`/details/${name}`} style={{ textDecoration: 'none' }} >
                            <div className="gallery">
                                <img className="imgsize" src={p1}></img>
                                <div className="desc"> Stamp 1</div>
                            </div>

                        </NavLink>
                    </center>

                </div>


            </div>
        );
    }
}

export default ListStamps;
