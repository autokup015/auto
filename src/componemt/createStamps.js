import React, { Component } from 'react';
import '../css/createstamps.css';
var pro1 = require("../img/pro1.png");
var ps21 = require("../img/ps21.jpg");

class CreateStamps extends Component {

    constructor(props) {
        super(props);
        this.state = { file: '',
         imagePreviewUrl: '',
         upst:'',
        imgupst:'' };
    }

    _handleSubmit(e) {
        e.preventDefault();
        console.log('handle uploading-', this.state.file);
        
    }
    _handleSubmit1(e) {
        e.preventDefault();
        console.log('handle uploading-', this.state.file);
        
    }
    

    _handleImageChange(e) {
        e.preventDefault();

        

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }
        

        reader.readAsDataURL(file)
    }
    _handleImageChange1(e) {
        e.preventDefault();

        

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                upst: file,
                imgupst: reader.result
            });
        }
        

        reader.readAsDataURL(file)
    }
    _handleSubmit1(e) {
        e.preventDefault();
        console.log('handle uploading-', this.state.file);
        
    }
    render() {
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img className="img" src={imagePreviewUrl} />);
        } else {
            $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }

        
        
        return (
            
           
           <div className="previewComponent">

                <div className="header">
                    <h1>สร้างโปรโมชั่น</h1>
                </div>
                <center>
                    <form onSubmit={(e) => this._handleSubmit(e)}>
                        <input className="fileInput"
                            type="file"
                            onChange={(e) => this._handleImageChange(e)} />
                        <button className="submitButton"
                            type="submit"
                            onClick={(e) => this._handleSubmit(e)}>Upload Image</button>
                    </form>
                    <div className="imgPreview">
                        {$imagePreview}
                    </div>
                    
                </center>
                   

                <div className="dtcs">
                    <h3 className="h2dtcs">ชื่อโปรโมชั่น :</h3>
                    <input className="inputName" placeholder="ชือโปรโมชั่น "></input>
                </div>
                <div className="dtcs">
                    <h3 className="h2dtcs">รายละเอียด โปรโมชั่น :</h3>
                    <textarea className="textarea"></textarea>
                </div>
                <div className="dtcs">
                    <h3 className="h2dtcs">ของรางวัล :</h3>
                    <input className="input"></input>
                </div>
                <div className="dtcs">
                    <h3 className="h2dtcs">วันที่เริ่ม:</h3>
                    <input type="date" name="bday" className="input" placeholder="dd/mm/yyyy"></input>
                </div>
                <div className="dtcs">
                    <h3 className="h2dtcs">วันที่สิ้นสุด:</h3>
                    <input type="date" name="bday" className="input" placeholder="dd/mm/yyyy"></input>
                </div>
                <div className="dtcs">
                    <h3 className="h2dtcs">แลกได้ถึง:</h3>
                    <input type="date" name="bday" className="input" placeholder="dd/mm/yyyy"></input>
                </div>
                <div className="dtcs">
                <h3 className="h2dtcs">ใช้แสมตป์จำนวน:</h3>
                    <select className="input">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                    </select>
                    </div>
                    <center
                    >
                        <h2>อัพโหลดรูปแสมตป์</h2>
                    <form onSubmit={(e) => this._handleSubmit1(e)}>
                        <input className="fileInput"
                            type="file"
                            onChange={(e) => this._handleImageChange1(e)} />
                        <button className="submitButton"
                            type="submit"
                            onClick={(e) => this._handleSubmit(e)}>Upload Image</button>
                    </form>
                    <div className="imgPreview">
                        {$imagePreview}
                    </div>
                </center>
                <div>

                    <button className="savebtn">Save</button>
                </div>
                </div>
               
            



        );
    }
}

export default CreateStamps;
