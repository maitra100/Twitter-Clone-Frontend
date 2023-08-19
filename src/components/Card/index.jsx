import React from "react";
import './card.css'
import { useState } from "react";
import axios from "axios";

function Card({id,text,date,name,setChangeTweets,changeTweets}){
    const month=new Date(date).getMonth();
    const year=new Date(date).getFullYear();
    const day=new Date(date).getDate();
    const [input,setInput]=useState('');
    const [inputBox,setInputBox]=useState(false);

    const changeInput=()=>{
        if(inputBox===false){
            setInputBox(true);
            return;
        }
        else{
            const token=localStorage.getItem('token');
            console.log(id);
            axios.put('http://localhost:3001/tweets',{
                id:id,
                tweet:input
            },{
                headers:{
                    token:token
                }
            }).then((res)=>{
                console.log(res);
                setChangeTweets(!changeTweets);
                setInputBox(false);
            }).catch((err)=>{
                console.log(err.response);
                alert(err.response);
            })
        }
    }

    const deleteTweet=()=>{
        const userId=localStorage.getItem('id');
        const token=localStorage.getItem('token');
        console.log('userId');
        axios.delete(`http://localhost:3001/tweets/${id}/${userId}`,{
            headers:{
                token:token
            }
        }).then((res)=>{
            setChangeTweets(!changeTweets);
            setInputBox(false);
        }).catch((err)=>{
            alert(err.response.data);
        })
    }

    return (
        <div id="card">
            <div id="display">
                <div>{name}</div>
                <div>{`${day}-${month}-${year}`}</div>
            </div>
            <div id="text">
                {text}
            </div>
            {inputBox && (<div >
                <textarea className="input1" type="text" placeholder="Enter Text" onChange={(e)=>setInput(e.target.value)}/>
</div>)}
            <div id="change">
                <button className="button1" onClick={changeInput}>Edit</button>
                <button className="button1" onClick={deleteTweet}>Delete</button>
            </div>
        </div>
    )
}

export default Card;