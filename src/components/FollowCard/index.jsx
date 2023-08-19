import React from "react";
import './followcard.css'
import axios from 'axios';

function FollowCard({id,name,setChangeFollowers,changefollowers,setSection,setFeed}){

    const unfollow=()=>{
        const userId=localStorage.getItem('id');
        const token=localStorage.getItem('token');
        axios.put('http://localhost:3001/following',{
            userId:userId,
            followerId:id,
            operation:'remove'
        },{
            headers:{
                token:token
            }
        }).then((res)=>{
            setChangeFollowers(!changefollowers);
        }).catch((err)=>{
            alert(err.response.data);
        })
    }

    const changeFeed=()=>{
        let token=localStorage.getItem('token');
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

    return (
    <div id="list">
        <div style={{'display':'flex','alignContents':'center'}}>
            <p onClick={changeFeed}>{name}</p>
        </div>
        <button className="button3" onClick={unfollow}>
                            Unfollow
                        </button>
    </div>
    );
}
export default FollowCard;