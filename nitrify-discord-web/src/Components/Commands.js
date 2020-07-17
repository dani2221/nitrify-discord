import React from 'react';
import '../Containers/ManageChannel.css'
import Header from './Header'

const Commands = () => {
    return(
        <div>
            <Header/>
            <ul style={{fontSize:'20px',margin:'50px'}}>
                <p><b>'init</b>  Get started and initialize storage</p>
                <p><b>'id</b>  Get channel's id</p>
                <p><b>{'\'{command}'}</b>  Send media from the cloud storage with the command you have specified on this site</p>
                <p><b>'about</b>  General information about the project</p>
            </ul>
        </div>
    )
}
export default Commands;