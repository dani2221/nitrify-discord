import React from 'react';
import '../Containers/ManageChannel.css'
import { withRouter } from 'react-router';

const Header = props => {
    const gotoCommands = () =>{
        props.history.push('/commands')
    }

    return(
        <header style={{background: 'rgba(0,0,0,0.9)',color:'white',padding:'5px',height:'60px'}}> 
            <p className='h1' style={{fontSize:'30px',display:'inline-block',float:'left',margin:'7px'}}>Nitrify-discord</p>
            <div style={{cursor:'pointer', float:'right'}}>
                <p onClick={()=>gotoCommands()} style={{display:'inline-block',marginRight:'50px',padding:'0px'}}><b>Commands</b></p>
                <p style={{display:'inline-block',marginRight:'50px',padding:'0px'}}><b>Github</b></p>
                <p style={{display:'inline-block',marginRight:'30px',padding:'0px'}}><a style={{textDecoration: 'none'}} href='https://patreon.com/nitrify'><b style={{color: 'white'}}>Support</b></a></p>
            </div>
        </header>
    )
}
export default withRouter(Header);