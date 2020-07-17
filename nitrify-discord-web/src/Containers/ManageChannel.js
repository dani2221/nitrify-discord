import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import firebase from 'firebase'
import './ManageChannel.css'
import ListPics from '../Components/ListPics';
import Popup from 'reactjs-popup';
import Compressor from 'compressorjs';

class ManageChannel extends Component{

    state={
        chanelNum: '',
        prefix: '',
        files: [],
        showContent: false,
        channelExist: '',
        isPaid: false,
        addedfile: [],
        uploaded: '',
        error: '',
        loading: false,
        donate: false
    }


    getFiles = ()=>{
        const listRef = firebase.storage().ref('/'+this.state.chanelNum+'/')
        const pics = []

        // Find all the prefixes and items.
        listRef.listAll().then(res=> {
            res.items.forEach(item=> {
                const file = listRef.child('/'+item.name+'/').getDownloadURL().then(url=>{
                    pics.push({prefix: item.name, url: url})
                }).then(()=>{
                    this.setState({files: pics})
                    console.log(pics)
                })
            });
        }).catch(function(error) {
            this.setState({error: 'There has been an error getting files. Please try again later!'})
        });
    }
    changeLoading = isLoading =>{
        this.setState({loading: isLoading})
    }
    initError = err =>{
        this.setState({error:err})
    }

    postFile = () =>{

        //prefix validation
        if(this.state.prefix.length>20){
            this.setState({error:'The command must not exceed 20 characters',});
            return;
        }
        if(this.state.prefix.length===0){
            this.setState({error:'Please enter a command for this file',});
            return;
        }
        if(this.state.prefix.includes(' ')){
            this.setState({error:'Whitespaces are not allowed in commands',});
            return;
        }


        //image validation
        if(this.state.addedfile.length===0){
            this.setState({error:'Please choose a file from the folowing types: jpg, jpeg, bmp, gif, png',uploaded:'Error!'})
            return;
        }
        if(this.state.files.length>5 && !this.state.isPaid){
            this.setState({donate:true})
            return;
        }
        const _validFileExtensions = ["jpg", "jpeg", "bmp", "gif", "png"]; 
        let typeVal = false;
        for (let i = 0; i < _validFileExtensions.length; i++) {
            const sCurExtension = _validFileExtensions[i];
            if (this.state.addedfile[0].type.substr(this.state.addedfile[0].type.length - sCurExtension.length, sCurExtension.length).toLowerCase() !== sCurExtension.toLowerCase()) {
                typeVal = false;
            }
            else{
                typeVal = true;
                break;
            }
        }
        if(!typeVal){
            this.setState({error:'Invalid file type. Supported types: jpg, jpeg, bmp, gif, png',prefix:'',addedfile:'',uploaded:'Error!'})
            return;
        }
        if(this.state.addedfile[0].size>2097152){
            this.setState({error:'File exceedes 2mb file size limit. Please upload it as an emoji!'})
            return;
        }

        //upload
        this.setState({loading:true})
            const storage = firebase.storage().ref('/'+this.state.chanelNum+'/'+this.state.prefix+'/');
            storage.put(this.state.addedfile[0]).then(()=>{
                this.setState({uploaded:'Uploaded file!',prefix:'',addedfile: [],loading:false})
                this.getFiles();
            }).catch(()=>{
                this.setState({loading:false,error: 'There has been an error uploading this file. Please try again later!'})
            })
    }
    uploadAsEmoji = ()=>{
        //prefix validation
        if(this.state.prefix.length>20){
            this.setState({error:'The command must not exceed 20 characters',});
            return;
        }
        if(this.state.prefix.length===0){
            this.setState({error:'Please enter a command for this file',});
            return;
        }
        if(this.state.prefix.includes(' ')){
            this.setState({error:'Whitespaces are not allowed in commands',});
            return;
        }


        //image validation
        if(this.state.addedfile.length===0){
            this.setState({error:'Please choose a file from the folowing types: jpg, jpeg, bmp, gif, png',uploaded:'Error!'})
            return;
        }
        if(this.state.files.length>5 && !this.state.isPaid){
            this.setState({donate:true})
            return;
        }
        const _validFileExtensions = ["jpg", "jpeg", "bmp", "gif", "png"]; 
        let typeVal = false;
        for (let i = 0; i < _validFileExtensions.length; i++) {
            const sCurExtension = _validFileExtensions[i];
            if (this.state.addedfile[0].type.substr(this.state.addedfile[0].type.length - sCurExtension.length, sCurExtension.length).toLowerCase() !== sCurExtension.toLowerCase()) {
                typeVal = false;
            }
            else{
                typeVal = true;
                break;
            }
        }
        if(!typeVal){
            this.setState({error:'Invalid file type. Supported types: jpg, jpeg, bmp, gif, png',prefix:'',addedfile:'',uploaded:'Error!'})
            return;
        }
        this.setState({loading:true})

        //refrences
        const chanelNum = this.state.chanelNum;
        const prefix = this.state.prefix;
        const setStateSuccessRef = () =>this.setState({uploaded:'Uploaded file!',prefix:'',addedfile: [],loading:false})
        const getFilesRef = ()=>this.getFiles();
        const setStateErrorRef = ()=>this.setState({loading:false,error: 'There has been an error uploading this file. Please try again later!'});

        //resize image to emoji
        const compr = new Compressor(this.state.addedfile[0],{
            quality: 0.6,
            maxHeight: 50,
            maxWidth: 50,
            success(result){
                const storage = firebase.storage().ref('/'+chanelNum+'/'+prefix+'/');
                storage.put(result).then(()=>{
                    setStateSuccessRef();
                    getFilesRef();
                }).catch(()=>{
                    setStateErrorRef()
                })
            }})
            
    

    }

    checkChanelNum = ev =>{
        this.setState({channelExist: ''})
            const db = firebase.firestore();
            db.collection('channels').doc(this.state.chanelNum).get().then(res=>{
                if(res.exists){
                    this.setState({showContent: true,isPaid: res.data().isPremium})
                    this.getFiles();

                }else{
                    this.setState({channelExist: 'That channel has not been found'})
                }
            }).catch(()=>{
                this.setState({error: 'There has been an error accessing this channel. Please try again later!'})
            })

    }

    render(){
        let channelIdcss = 'channel-form'
        let contentPlus=            
            <div className={channelIdcss}>
                <p className='h1'>Enter channel code</p>
                <input className='input' placeholder='Channel code' value={this.state.chanelNum} onChange={ev=>this.setState({chanelNum: ev.target.value})}/>
                <button className='btn' onClick={()=>this.checkChanelNum()}>Enter</button>
                <p>Send <b><i>:id</i></b> to your discord server to get your code</p>
                <p>{this.state.channelExist}</p>
            </div>;
        if(this.state.showContent){
            channelIdcss+=' fadeOut'
        }
        let managecss = 'channel-form-null'
        if(this.state.showContent){
            contentPlus=(
                <div className={managecss}>
                    <div style={{width:'300px', backgroundColor:'rgb(37,37,37)',padding:'20px',borderRadius:'10px',display:'inline-block',margin:'30px'}}>
                        <input className='input' placeholder='Enter prefix' value={this.state.prefix} onChange={(ev)=>this.setState({prefix:ev.target.value})}/>
                        <div style={{border: '1px solid gray'}}>
                            <Dropzone style={{height:'300px'}} onDrop={acceptedFile => this.setState({addedfile: acceptedFile,uploaded:'Added file!'})}>
                            {({getRootProps, getInputProps}) => (
                                <section style={{margin:'0px'}}>
                                    <div style={{margin:'0px'}} {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <pre style={{fontWeight:'900',height:'80px',verticalAlign:'middle',cursor:'pointer'}}>Click me to choose a photo {'\n\n\n'}
                                        <p style={{color:'cyan'}}>{this.state.uploaded}</p>
                                        </pre>
                                    </div>
                                </section>
                            )}
                            </Dropzone>
                        </div>
                        <button className='btn' style={{marginTop:'30px'}} onClick={()=>this.postFile()}>Upload</button>
                        <button className='btn' style={{marginTop:'30px'}} onClick={()=>this.uploadAsEmoji()}>Upload as emoji</button>
                    </div>
                    <ListPics pics={this.state.files} chanelNum={this.state.chanelNum} getFiles={()=>this.getFiles()} changeLoading={ev=>this.changeLoading(ev)} initError={er=>this.initError(er)}/>
                </div>
            )
        }

    return(
        <div>
            <Popup open={this.state.loading} >
                <div>
                    <p style={{display:'inline-block', fontSize:'20px',fontWeight:'900',color:'rgb(37,37,37)',verticalAlign:'top'}}>Loading...    </p>
                    <div style={{transform:'translateY(10px)',marginBottom:'30px'}}>
                    <div style={{display:'inline-block'}} class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>
                </div>
            </Popup>
            <Popup open={this.state.donate} onClose={()=>this.setState({donate:false})} >
                <div>
                <p style={{fontSize:'20px',color:'rgb(37,37,37)'}}>
                    Storing files on the cloud is expensive. Support this project on <a href='https://patreon.com/nitrify'><p style={{color:'rgb(240,94,35)',fontSize:'25px',fontWeight:'900',display:'inline'}}>Patreon</p></a> with any ammount and get unlimited file uploads!
                </p>
                <p style={{fontSize: '10px'}}><i>click outside this box to exit</i></p>
                </div>
            </Popup>
            <Popup open={this.state.error} onClose={()=>this.setState({error:''})}>
                <div>
                    <p>{this.state.error}</p>
                    <p style={{fontSize: '10px'}}><i>click outside this box to exit</i></p>
                </div>
            </Popup>
            {contentPlus}
        </div>
    )}
}

export default ManageChannel;