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
		itemDomIdPrefix:'ageItem',
		groupDomIdPrefix:'ageGroup',
		resourcenTitle:'Resourcen',
		gameSettingTitle:'Allgemeine Einstellungen',
		defaultItemName:'Name',
		defaultGroupName:'Name',
		defaultGameName:'Age Name',
		pingpongPeriod:20000,
		chatContenerId:'ageChat',
		chatContenerMsgId:'ageChatMsg',
		chatContenerInputId:'ageChatInput',
		imageVisible:'sichtbar.png',
		imageUnVisible:'unsichtbar.png',
		ageConnectionStatusId:'ageConnectionStatus',
		gameName:'Speilname:',
		player_size:'Spieler Anzahl:',
		game_width:'Breite:',
		game_height:'Höhe:',
		background_color:'Hintergrundfarbe: ',
		background_image:'Hintergrundbild: ',
		msg_size:'Size:',
		responseTimeout:5000,
		dragZIndex:999999,
		updatePeriod:70,
		player:{width:150,height:130,margin:50}
};
