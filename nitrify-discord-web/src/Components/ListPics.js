import React from 'react';
import firebase from 'firebase';

const ListPics = props =>{

    const deletePic = ix =>{
        props.changeLoading(true);
        firebase.storage().ref('/'+props.chanelNum+'/'+props.pics[ix].prefix).delete()
        .then(()=>{
            props.getFiles();
            props.changeLoading(false);
        }).catch(()=>{
            props.initError('There has been a problem removing this file. Please try again later!');
        });
    }

    return(
        <div style={{width:'96%', backgroundColor:'rgb(37,37,37)',padding:'20px',borderRadius:'10px',display:'block',marginRight:'30px'}}>
            <p style={{fontSize:'20px',fontWeight:'900'}}>Pictures/Emojis</p>
            <hr/>
            <div style={{textAlign:'start', alignItems:'start'}}>
                {props.pics.map((el,index)=>{
                    return(
                        <div key={el.prefix} style={{width:'250px',display:'inline-block',border:'1px solid rgb(20,20,20)',margin:'10px',padding:'5px',textAlign:'start',backgroundColor:'rgb(20,20,20)',borderRadius:'10px'}}>
                            <img style={{display:'inline-block',borderRadius:'10px'}} src={el.url} style={{width: '33%',height:'50px',}}/>
                            <p style={{display:'inline-block',verticalAlign:'top',width:'50%',marginLeft:'10px',marginRight:'10px'}}>:{el.prefix}</p>
                            <button onClick={()=>deletePic(index)} style={{display:'inline-block',backgroundColor:'rgba(0,0,0,0)',border:'none',margin:'0px',padding:'0px',verticalAlign:'top',height:'50px',width:'5%',cursor:'pointer'}}><p style={{color:'red',fontWeight:'900', fontSize:'20px',margin:'0px',padding:'0px',textAlign:'end'}}>x</p></button>
                        </div>
                )})}
            </div>
        </div>
    )
}

export default ListPics;