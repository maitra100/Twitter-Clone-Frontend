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
import { useNavigate } from "react-router-dom";

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
    const navigate=useNavigate();
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
    const [openBox,setOpenBox]=useState(false);
    const [people,setPeople]=useState(undefined);

    const changeFeed=async(id,myName)=>{
        let token=localStorage.getItem('token');
        axios.get(`http://localhost:3001/tweets/${id}`,{
            headers:{
                token:token
            }
        }).then((result)=>{
            console.log(result.data,"tweets");
            setFeed(result.data);
            changeSection(myName);
            setOpenBox(false);
            setField('');
        }).catch((err)=>{
            alert(err.response.data);
            navigate('/login');
        });
    }

    const getPeople=(e)=>{
        setPeople(undefined);
        setField(e.target.value);
        const token=localStorage.getItem('token');
        setTimeout(()=>{
            let search=e.target.value;
            console.log(search,'1');
        search=search.split(' ').join('');
        if(search.length===0)
        return ;
            axios.get(`http://localhost:3001/getUsers/${e.target.value}`,{
                headers:{
                    token:token
                }
            }).then((res)=>{
                console.log(res.data);
                setPeople(res.data);
            }).catch((err)=>{
                alert(err.response.data);
                navigate('/login');
            })
        },1000)
    }



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
            alert(e.response.data);
            navigate('/login');
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
        let response;
        try{
            response=await axios.get(`http://localhost:3001/following/${id}`,{
            headers:{
                token:token
            }
        })
        }
        catch(e){
            alert(e.response.data);
            navigate('/login');
        }
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
            alert(e.response.data);
            navigate('/login');
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
        let response;
        try{
            response=await axios.get(`http://localhost:3001/userId/${section}`,{
            headers:{
                token:token
            }
        });
        }
        catch(e){
            alert(e.response.data);
            navigate('/login');
        }
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
            navigate('/login');
        })
    }

    const follow=async()=>{
        const userId=localStorage.getItem('id');
        const token=localStorage.getItem('token');
        let response;
        try{
            response=await axios.get(`http://localhost:3001/userId/${section}`,{
            headers:{
                token:token
            }
        });
        }
        catch(e){
            alert(e.response.data);
            navigate('/login');
        }
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
            navigate('/login');
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
            setTweetInput('');
        }).catch((err)=>{
            alert(err.response.data);
            navigate('/login');
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
        }).catch((err)=>{
            alert(err.response.data);
            navigate('/login');
        });
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
        }).catch((err)=>{
            alert(err.response.data);
            navigate('/login');
        });
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
            setFeed([]);
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
                    alert(err.response.data);
                    navigate('/login');
                })
            }) 

        }).catch((err)=>{
            alert(err.response.data);
            navigate('/login');
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
                <button className="button2" style={{'cursor':'pointer'}} onClick={setModalOpen}>Tweet</button>
                <button className="button2" style={{'cursor':'pointer'}} onClick={()=>{
                    navigate('/login');
                    localStorage.clear();
                }}>Log Out</button>
                <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} style={customStyles}>
                    <div id="modalBox">
                        <div id="modalheader">
                        <b>Tweet Here</b>
                        </div>
                        <textarea id="modalinput" onChange={(e)=>setTweetInput(e.target.value)} value={tweetInput} placeholder="Input" />
                        <div id="divbuttons">
                        <button className="button2" style={{'cursor':'pointer'}} onClick={() => setModalOpen(false)}>
                            Cancel
                        </button>
                        <button className="button2" style={{'cursor':'pointer'}} onClick={addTweet}>
                            Create
                        </button>
                        </div>
                    </div>
                    </Modal>
            </div>
            <div id="middle">
                <div id="header">
                    <h3>{section}</h3>
                    {section!=='My Profile' && section!=='Home' && follower && (<button className="button4" style={{'cursor':'pointer'}} onClick={unfollow}>
                            Unfollow
                        </button>)}
                        {section!=='My Profile' && section!=='Home' && !follower && (<button className="button4" style={{'cursor':'pointer'}} onClick={follow}>
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
                <input className="input2" type="text" placeholder="Search" onChange={getPeople} onClick={()=>setOpenBox(true)} value={field}/>
                </div>
                <div id="open">
                {openBox && people && people.map((folk)=>{
                    console.log(folk);
                    return (<div id="inside" style={{'cursor':'pointer'}} onClick={()=>changeFeed(folk.userId,folk.name)}>{folk.name}</div>)})}
                </div>
                <div id="followers">
                    <p>Following</p>
                    {followers && followers.map((res)=>{
                        return (<div>
                            <FollowCard key={res._id} id={res.userId} name={res.name} setChangeFollowers={setChangeFollowers} changefollowers={changefollowers} setSection={changeSection} setFeed={setFeed} section={section} update={update}/>
                        </div>)
                    })}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;