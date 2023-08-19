import React from "react";
import './register.css'
import Icon from '../../public/twitter_icon.png'
import { useState, } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Register(){
    const [userName,setUserName]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();

    const registerUser=async()=>{
        if(userName==='' || password===''){
            alert("Please enter all the fields");
            return ;
        }
        try{
            const response=await axios.post('http://localhost:3000/user',{
            userName:userName,
            password:password
            })
            navigate('/login');
            alert(response.data);
        }
        catch(e){
            alert(e.response.data);
        }
    }

    return (
        <div id="registerBack">
            <div id="registerBox">
                <div id="icon">
                    <img src={Icon} alt="TwitterIcon" height="75px" width="75px"/>
                </div>
                <div id="title">
                    <p style={{'margin-top':'2%'}}>Register</p>
                </div>
                <div id="input">
                    <input className="input" type="text" placeholder="User Name" onChange={(e)=>setUserName(e.target.value)}/>
                    <input className="input" type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                <div id="registerButton">
                    <button type="button" className="button" onClick={registerUser}>Register</button>
                <div id="diff">
                    <p style={{'cursor':'pointer'}} onClick={()=>navigate('/Login')}>Login</p>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Register;