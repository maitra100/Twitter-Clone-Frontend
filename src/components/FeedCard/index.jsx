import React from "react";
import axios from 'axios';

function FeedCard({id,text,date,name,setSection,setFeed}){
    const month=new Date(date).getMonth();
    const year=new Date(date).getFullYear();
    const day=new Date(date).getDate();

    const changeFeed=async()=>{
        let token=localStorage.getItem('token');
        let response=await axios.get(`http://localhost:3001/userId/${name}`,{
            headers:{
                token:token
            }
        });
        let id=response.data;
        console.log(id);
        axios.get(`http://localhost:3001/tweets/${id}`,{
            headers:{
                token:token
            }
        }).then((result)=>{
            console.log(result.data,"tweets");
            setFeed(result.data);
            setSection(name);
        }).catch((err)=>alert(err.message));
    }
    return (<div id="card">
    <div id="display">
        <div onClick={changeFeed}>{name}</div>
        <div>{`${day}-${month}-${year}`}</div>
    </div>
    <div id="text">
        {text}
    </div>
</div>)
}

export default FeedCard;