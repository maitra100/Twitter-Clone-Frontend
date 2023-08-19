import React from "react";
import './dashboard.css';
import Icon from '../../public/twitter_icon.png'
import Home from '../../public/home.png'
import Profile from '../../public/profile.png'
import { useEffect,useState } from "react";
import Card from '../../components/Card'
import axios from 'axios'
import Modal from 'react-modal';
import FeedCard from '../../components/FeedCard'
import FollowCard from "../../components/FollowCard";

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'aliceblue',
      width: 400,
      border:'solid 2px #1D9BF0',
      height:'30%'
    },
  };

function Dashboard(){
    const [followers,setFollowers]=useState([]);
    const [tweetIds,setTweetIds]=useState([]);
    const [changefollowers,setChangeFollowers]=useState(true);
    const [changeTweets,setChangeTweets]=useState(true);
    const [name,setName]=useState('');
    const [section,setSection]=useState('Home');
    const [modalOpen, setModalOpen] = useState(false);
    const [tweetInput,setTweetInput]=useState('');
    const [feed,setFeed]=useState([]);
    const [field,setField]=useState('');
    const [follower,setFollwer]=useState(true);

    const checkfollower=async(name)=>{
        const token=localStorage.getItem('token');
        let fId;
        try{
            const response=await axios.get(`http://localhost:3001/userId/${name}`,{
            headers:{
                token:token
            }
            })
            fId=response.data;
        }
        catch(e){
            alert(e.message);
        }
        console.log(fId,'fId');
        let bool=false;
        followers.forEach((res)=>{
            if(res.userId===fId)
            bool=true;
        })
        console.log(bool,'bool');
        if(bool===true)
        setFollwer(true);
        else
        setFollwer(false);
    }

    const changeSection=async(name)=>{
        setSection(name);
        if(name!=='My Profile' && name!=='Home')
        checkfollower(name);
    }
    
    const update=async()=>{
        let token=localStorage.getItem('token');
        let id=localStorage.getItem('id');
        let response=await axios.get(`http://localhost:3001/following/${id}`,{
            headers:{
                token:token
            }
        })
        console.log(response.data,"last")
        setFollowers(response.data);
        let fId;
        try{
            const response=await axios.get(`http://localhost:3001/userId/${section}`,{
            headers:{
                token:token
            }
            })
            fId=response.data;
        }
        catch(e){
            alert(e.message);
        }
        console.log(fId,'fId');
        let bool=false;
        response.data.forEach((res)=>{
            if(res.userId===fId)
            bool=true;
        })
        console.log(bool,'bool');
        if(bool===true)
        setFollwer(true);
        else
        setFollwer(false);
    }

    const unfollow=async ()=>{
        const userId=localStorage.getItem('id');
        const token=localStorage.getItem('token');
        let response=await axios.get(`http://localhost:3001/userId/${section}`,{
            headers:{
                token:token
            }
        });
        let id=response.data;
        axios.put('http://localhost:3001/following',{
            userId:userId,
            followerId:id,
            operation:'remove'
        },{
            headers:{
                token:token
            }
        }).then((res)=>{
            update();
        }).catch((err)=>{
            alert(err.response.data);
        })
    }

    const follow=async()=>{
        const userId=localStorage.getItem('id');
        const token=localStorage.getItem('token');
        let response=await axios.get(`http://localhost:3001/userId/${section}`,{
            headers:{
                token:token
            }
        });
        let id=response.data;
        axios.put('http://localhost:3001/following',{
            userId:userId,
            followerId:id,
            operation:'add'
        },{
            headers:{
                token:token
            }
        }).then((res)=>{
            update();
        }).catch((err)=>{
            alert(err.response.data);
        })
    }

    const addTweet=()=>{
        const id=localStorage.getItem('id');
        const token=localStorage.getItem('token');
        axios.post('http://localhost:3001/tweets',{
            userId:id,
            tweet:tweetInput,
            name:name
        },{
            headers:{
                token:token
            }
        }).then((res)=>{
            setChangeTweets(!changeTweets);
            setSection('My Profile');
            setModalOpen(false);
        }).catch((err)=>{
            alert(err.response.data);
        })
    }

    useEffect(()=>{
        let token=localStorage.getItem('token');
        let id=localStorage.getItem('id');
        axios.get(`http://localhost:3001/user/${id}`,{
            headers:{
                token:token
            }
        }).then((result)=>{
            console.log(result);
            setName(result.data.name);
        }).catch((err)=>alert(err.message));
    },[name])

    useEffect(()=>{
        let token=localStorage.getItem('token');
        let id=localStorage.getItem('id');
        console.log(token,id);
        axios.get(`http://localhost:3001/tweets/${id}`,{
            headers:{
                token:token
            }
        }).then((result)=>{
            console.log(result.data,"tweets");
            setTweetIds(result.data);
        }).catch((err)=>alert(err.message));
    },[changeTweets])

    useEffect(()=>{
        let token=localStorage.getItem('token');
        let id=localStorage.getItem('id');
        axios.get(`http://localhost:3001/following/${id}`,{
            headers:{
                token:token
            }
        }).then(async(result)=>{
            setFollowers(result.data);
            console.log(result.data,'followers');
            let tweets=[];
            result.data.map(async (res)=>{
                return axios.get(`http://localhost:3001/tweets/${res.userId}`,{
                    headers:{
                        token:token
                    }
                }).then((response)=>{
                    console.log(response.data,'response');
                    tweets=[...tweets,...response.data];
                    tweets.sort((a,b)=>{
                        return new Date(b.date) - new Date(a.date);
                    })
                    setFeed(tweets);
                }).catch((err)=>{
                    console.log(err)
                })
            }) 

        })
    },[changefollowers])

    return (
        <div id="main">
            <div id="left">
                <img src={Icon} alt="Icon"/>
                <div id="home">
                    <img src={Home} alt="Home" width="20px" height="20px"/>
                    <p style={{'paddingLeft':'5%','cursor':'pointer'}} onClick={()=>{setChangeFollowers(!changefollowers);changeSection('Home');
                    }} >Home</p>
                </div>
                <div id="home">
                    <img src={Profile} alt="Home" width="20px" height="20px"/>
                    <p style={{'paddingLeft':'5%','cursor':'pointer'}} onClick={()=>changeSection('My Profile')}>My Profile</p>
                </div>
                <button className="button2" onClick={setModalOpen}>Tweet</button>
                <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} style={customStyles}>
                    <div id="modalBox">
                        <div id="modalheader">
                        <b>Tweet Here</b>
                        </div>
                        <textarea id="modalinput" onChange={(e)=>setTweetInput(e.target.value)} value={tweetInput} placeholder="Input" />
                        <div id="divbuttons">
                        <button className="button2" onClick={() => setModalOpen(false)}>
                            Cancel
                        </button>
                        <button className="button2" onClick={addTweet}>
                            Create
                        </button>
                        </div>
                    </div>
                    </Modal>
            </div>
            <div id="middle">
                <div id="header">
                    <h3>{section}</h3>
                    {section!=='My Profile' && section!=='Home' && follower && (<button className="button3" onClick={unfollow}>
                            Unfollow
                        </button>)}
                        {section!=='My Profile' && section!=='Home' && !follower && (<button className="button3" onClick={follow}>
                            Follow
                        </button>)}
                </div>
                <div id="scroll">
                {section==='My Profile' && tweetIds && tweetIds.map((tweet)=>{
                    return (
                        <div>
                            <Card key={tweet.id} id={tweet._id} text={tweet.tweet} date={tweet.date} name={name} setChangeTweets={setChangeTweets} changeTweets={changeTweets} setSection={changeSection}/>
                        </div>
                    )
                })}
                {
                    section==='Home' && feed && feed.map((tweet)=>{
                        return (
                            <div>
                                <FeedCard key={tweet._id} id={tweet.userId} text={tweet.tweet} date={tweet.date} name={tweet.name} setSection={changeSection} setFeed={setFeed}/>
                            </div>
                        )
                    })
                }
                {section!=='My Profile' && section!=='Home' && feed && feed.map((tweet)=>{
                        return (
                            <div>
                                <FeedCard key={tweet._id} id={tweet.userId} text={tweet.tweet} date={tweet.date} name={tweet.name} setSection={changeSection} setFeed={setFeed}/>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div id="right">
                <div id="find">
                <input className="input2" type="text" placeholder="Search" onClick={(e)=>setField(e.target.value)}/>
                </div>
                <div id="followers">
                    <p>Following</p>
                    {followers && followers.map((res)=>{
                        return (<div>
                            <FollowCard key={res._id} id={res.userId} name={res.name} setChangeFollowers={setChangeFollowers} changefollowers={changefollowers} setSection={changeSection} setFeed={setFeed}/>
                        </div>)
                    })}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;