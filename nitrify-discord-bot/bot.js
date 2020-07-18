const Discord = require('discord.js');
const client = new Discord.Client();

const admin = require("firebase-admin");
const serviceAccount = require('./service-account-file.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nitrifydiscord.firebaseio.com"
});

generateV4ReadSignedUrl = async (channelNum,prefix) => {
    const bucket = admin.storage()
    // These options will allow temporary read access to the file
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 1500 * 60 * 1000, // 1500 minutes
    };
  
    // Get a v4 signed URL for reading the file
    try{
    const [url] = await bucket
      .bucket('nitrifydiscord.appspot.com')
      .file(channelNum+'/'+prefix)
      .getSignedUrl(options);
      console.log(url);
      return url;
    }catch{
        return '';
    }
}
const SUCCESS = 'Channel storage initialized succesfully';
const FAIL = 'There has been a problem initializng this channel';
const EXISTS = 'Channel already initialized'

initializeChannelDatabase = async channelNum => {
    const db = admin.firestore();
    try {
        let channelDoc = await db.collection('channels').doc(channelNum).get();
        if (!channelDoc.exists) {
            await db.collection('channels').doc(channelNum).set({ isPremium: false });
            return SUCCESS;
        } else {
            return EXISTS;
        }
    } catch (err) {
        return FAIL;
    }
}
client.on("ready", () => {
    console.log("Ready");
    client.user.setActivity("\'help");
})

client.on('message', async msg => {
    if (msg.author.bot) return;
    if(msg.content.toLowerCase()==='\'init'){
        msg.channel.startTyping(3);
        initializeChannelDatabase(msg.channel.id).then(result=>{
            console.log(result);
            if(result===SUCCESS){
                const embed = new Discord.MessageEmbed()
                .setTitle('Channel storage initialized succesfully')
                .setURL('https://nitrifydiscord.web.app/manage')
                .addFields(
                    {name: '1.',value: 'Go to https://nitrifydiscord.web.app/manage'},
                    {name: '2.',value: 'Enter the code for this channel: '+msg.channel.id},
                    {name: '3.',value: 'Add photos/gifs/emojis and specify commands'},
                    {name: '4.',value: 'Use those commands in this channel eg: \'my_photo'},
                    {name: '5.',value: 'Enjoy'}
                    )
                .setColor('#0099ff')
                .setTimestamp()
                msg.channel.send(embed);
            }else if(result===FAIL){
                msg.channel.send(FAIL);
            }else if(result===EXISTS){
                msg.channel.send(EXISTS+'. To manage/add/delete media go to https://nitrifydiscord.web.app/manage and enter '+msg.channel.id);
            }
            msg.channel.stopTyping(true);
    });
    
    }else if (msg.content.toLowerCase() === '\'about') {
     const embed = new Discord.MessageEmbed()
          .setTitle('Nitrify-discord')
          .setURL('https://nitrifydiscord.web.app/')
          .addFields(
            { name: 'About', value: 'Nitrify is a javascript project made of two parts. A website where users can upload media and specify commands, and a discord bot to directly interact with that media in the channel through the specified commands. Every channel has an unique id that can be used on the website to manage the media specificly for that channel.' },
            { name: 'Main features', value: '+Send cloud stored photos and emojis directly to your channel with a simple command, Option to Automaticly down-scale the image, so that it will be send in the discord channel as an emoji, GIFs supported, Easily manage all your media in one place'},
            { name: 'Tools and hosting', value: 'The website is built using React.js, while the discord bot is developed with the discord.js library. Google\'s Firebase is used for cloud storage, database and hosting of the website. The discord bot is hosted thru heroku' }
          )
          .setColor('#0099ff')
          .setTimestamp()
        msg.channel.send(embed);
    }
    else if(msg.content.toLowerCase()==='\'id'){
          msg.channel.send(msg.channel.id);
    }else if(msg.content.toLowerCase()==='\'help'){
        const embed = new Discord.MessageEmbed()
        .setTitle('Help')
        .setURL('https://nitrifydiscord.web.app')
        .addFields(
            {name: '\'init',value: 'Initialize storage'},
            {name: '\'id',value: 'Get this channel\'s id'},
            {name: '\'{command}',value: 'Send media from the cloud storage'},
            {name: '\'about',value: 'Some stuff about this project'},
            )
        .setColor('#0099ff')
        .setTimestamp()
        msg.channel.send(embed);
    }
    else if(msg.content.includes('\'')){
        msg.channel.startTyping(3);
        const command = msg.content.split('\'')[1].split(' ')[0];
        generateV4ReadSignedUrl(msg.channel.id, command).then(url=>{
            if(url!==''){
                const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(msg.author.username)
                .setImage(url)
                console.log(url);
                msg.channel.stopTyping(true);
                msg.channel.send(embed)

            }
        })
    }
});

client.login('id');
