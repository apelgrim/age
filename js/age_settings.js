/*
 

{name:'go',_public:false,playersSize:4,table:{style:{height:333,width:333,bgColor:'rgb(83, 39, 0)',bgImageName:'go_brett.png',left:0,top:0}},resourcen:[{id:8,name:'go_figuren',visibility:true,stacked:false,randomgenerator:false,ordered:true,style:{height:33,width:33,bgColor:'rgb(27, 13, 0)',bgImageName:'go_black.png',left:0,top:0},items:[{style:{height:22,width:22,bgColor:'rgb(255, 248, 239)',bgImageName:'go_white.png',left:0,top:0},name:'weiss',size:1,visibility:true,id:10},{style:{height:22,width:22,bgColor:'rgb(15, 11, 0)',bgImageName:'go_black.png',left:0,top:0},name:'schwarz',size:1,visibility:true,id:11}]}],players:[]}
{name:'go',_public:false,playersSize:4,table:{style:{height:333,width:333,bgColor:'',                imageName:'go_brett.png',left:0,top:0}},resourcen:[{id:8,name:'go_figuren',visibility:true,stacked:false,randomgenerator:false,ordered:true,style:{height:33,width:33,bgColor:'',                imageName:'go_black.png',left:0,top:0},items:[{style:{height:22,width:22,bgColor:'',                    imageName:'go_white.png',left:0,top:0},name:'weiss',size:1,visibility:true,id:10},{style:{height:22,width:22,bgColor:'',                imageName:'go_black.png',left:0,top:0},name:'schwarz',size:1,visibility:true,id:11}]}],players:[]} 
  
 */


var AgeSettings = {
		//go http://localhost:8080/webapps/game/edit.htm?key=1282510115809
		serverContext:'/age/',
		imagePath:'/age/images/',
		userImagePath:'/age/images/game/',
		imageTmpPath:'/age/images/tmp/',
		playerAreaTitleNoPlayer:'-- Player --',
		resourcenTitle:'Resourcen',
		gameSettingTitle:'Algemeineinstellungen',
		defaultItemName:'Name',
		defaultGroupName:'Name',
		defaultGameName:'Name',
		pingpongPeriod:25000,
		chatContenerId:'ageChat',
		chatContenerMsgId:'ageChatMsg',
		chatContenerInputId:'ageChatInput',
		imageVisible:'sichtbar.png',
		imageUnVisible:'unsichtbar.png',
		ageConnectionStatusId:'ageConnectionStatus',
		responseTimeout:5000
};
