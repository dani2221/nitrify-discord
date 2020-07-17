import React from 'react';
import '../Containers/ManageChannel.css'
import { withRouter } from 'react-router';
import Header from './Header'

const LandingPage = props =>{
    const gotoCommands = () =>{
        props.history.push('/commands')
    }

    return(
        <div>
            <Header/>
            <div style={{margin:'20px',padding:'30px'}}>
                <p className='h1' style={{color:'rgba(0,0,0,0.8)'}}>Get started. It's free!</p>
                <a onClick={()=>gotoCommands()} href='https://discord.com/api/oauth2/authorize?client_id=729635938480947211&permissions=378944&scope=bot' target='_blank' className='btn' style={{textDecoration:'none',backgroundColor:'rgba(0,0,0,0.8)',color:'white',marginBottom:'30px',}}>Get the bot in your channel</a>
                <a style={{display:'block'}} href='/manage'>Already initialized the bot?</a>
            </div>
            <div style={{background: 'rgba(0,0,0,0.8)',color:'white',padding:'30px'}}>
                <p className='h1'>Features:</p>
                <ul>
                    <p><i>Send cloud stored photos and emojis directly to your channel with a simple command</i></p>
                    <p><i>Automaticly convert images to emojis on the site</i></p>
                    <p><i>GIFs supported</i></p>
                    <p><i>Easily manage all your media in one place</i></p>
                </ul>
            </div>
        </div>
    )
}

export default withRouter(LandingPage);