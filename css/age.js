
var debug = true;


function Style(height, width,bgColor,bgImage,id,_class,left,top,position) {
    var _style = DEFAULTS.style;
    this.height = height || _style.height;
    this.width = width || _style.width;
    this.bgColor = bgColor || _style.bgColor;
    this.bgImage = bgImage || _style.bgImage;
    this.imagesPath = '';
    this.imageName = '';
    this.angle='0';
    this.getBgColor = function(){
    	if(bgColor=='') return 'transparent';
    	else return this.bgColor;
    };
    this.getImagePath = function(){
    	if(this.imagesPath != '' && this.imageName!='') return 'url('+this.imagesPath+this.angle+'_'+this.imageName+')';
    	else return 'none';
    };
    this.id = id || _style.id;
    this._class = _class || _style._class;
    this.left= left;
    this.top= top;
    //position: absolute or relative
    this.position = position || _style.position;
    this.setPosition = function(pos){
        this.left = pos.left;
        this.top = pos.top;
    };
   this.loadFromJSON = function(s){
	    this.height = s.height;
	    this.width = s.width;
	    this.bgColor = s.bgColor;
	    this.imagesPath = '/age/images/'+GameManager.key+'/';
	    this.imageName = s.bgImageName;
	    this.bgImage = '/age/images/'+GameManager.key+'/'+s.bgImageName;
	    this.left= s.left;
	    this.top= s.top;
    	return this;
    };
}
function Item(name,count,visibility,style){
    var _item = DEFAULTS.item;
    this.id = -1;
    this.name = name || _item.name;
    this.count = count || _item.count;
    this.visibility = visibility || _item.visibility;
    this.style=style || new Style();
   this.loadFromJSON = function(i){
	   this.name = i.name;
	    this.count = i.size;
	    this.visibility = i.visibility;
	    var style = new Style();
	    style.id = 'item-'+this.id;
	    style._class = 'item';
	    this.style=style.loadFromJSON(i.style);
	    return this;
    };
}

function Player(name,id){
    this.id = id;
    this.name = name;
    this.style = new Style(90, 150,'red',null,'player_'+id,'player',-1,-1,'absolute');
}

function Group(name,visibility,stacked,order,randomgenerator,style){
    var _group = DEFAULTS.group;
    this.id = -1;
    this.name = name || _group.name;
    this.stacked = stacked || _group.stacked;
    this.visibility = visibility || _group.visibility;
    this.order = order || _group.order;
    this.randomgenerator = randomgenerator || _group.randomgenerator;
    this.items= new Array();
    this.style=style || new Style();
   this.loadFromJSON = function(g){
	    this.name = g.name;
	    this.stacked = g.stacked;
	    this.visibility = g.visibility;
	    this.order = g.order;
	    this.randomgenerator = g.randomgenerator;
	    var style = new Style();
	    style._class = 'group';
	    style.id = 'group-'+this.id;
	    this.style=style.loadFromJSON(g.style);
	    var itms = g.items;
	    for ( var i = 0; i < itms.length; i++) {
    		var item = new Item();
      		item.id = this.id+'-'+i;
     		this.items.push(item.loadFromJSON(itms[i]));
		}
//	    Log('Erstelle Group:'+g.name,'i');
	    return this;
	   
    };
}

function Table(style){
  //  var _table = DEFAULTS.table;
    this.items = new Array();
    this.style=style;// || _table.style;
    this.loadFromJSON = function(t){
    	var style = new Style();
	    style._class = 'table';
	    style.id = 'table';
	    this.style=style.loadFromJSON(t.style);
//	    Log('Erstelle Table:','i');
	    return this;
    };
    
}

function Game(name,_public){
    var _game = DEFAULTS.game;
    this.name = name || _game.name;
    this._public = _public || _game._public;
    this.style = new Style(900, 900,'gray',null,'game','game',0,0,'relative');
    this.ressourcen = new Array();
    this.playersSize=-1;
    this.player = -1,
    this.players = [];
    this.getTablePlayersOrder=function(){
        if(this.player == -1) return this.players;
        var players =this.players.slice(0, this.players.length);
        for (var i = 0; i < players.length;  i++) {
            if(i < this.player) players.push(players.shift());
        }
        return players;
    };
    this.table = Table;
    this.setCurrentPlayer = function(player_id){
    	for ( var j = 0; j < this.players.length; j++) {
    		var player = this.players[j];
    		if(player.id ==player_id) this.player=j;
		}
    };
    this.render=function(contener){
        var renderer = new Renderer(this);
        renderer.start(contener);
    };
    this.loadFromJSON = function(g){
    	this.name = g.name;
    	this.playersSize = g.playersSize;
    	this._public = g._public;
    	var players = g.players;
    	for ( var j = 0; j < players .length; j++) {
    		var player = new Player(players[j].name,players[j].id);
    		this.players.push(player);
		}
    	
    //	this.players = g.players;
    	
    	
    	var table = new Table();
    	this.table = table.loadFromJSON(g.table);
    	var res = g.resourcen;
    	for ( var i = 0; i < res.length; i++) {
    		var group = new Group();
    		group.id = i;
    		this.ressourcen.push(group.loadFromJSON(res[i]));
		}
    	return this;
    };
}

function Renderer(game){
    this.start = function(contener){
    	 Log('Starte Rendering in '+contener,'i');
        Perspective.gamePosition=contener.position();
        Perspective.WIDTH =  game.style.width;
        Perspective.HEIGHT =  game.style.height;
        
        //create game wrapper
        var gameWrapper = this.createElement(game.style);
       
        //create table in the center of contener
       
        var gameTablePos = Perspective.translateToRelativePosition([0,0],{width:game.table.style.width,height:game.table.style.height});
        Log('gameTablePos '+gameTablePos,'i');
         game.table.style.setPosition({left:gameTablePos[0],top:gameTablePos[1]});
         
        if(game.player>0) game.table.style.angle='180'; //  TODO schlecht
        var gameTable = this.createElement(game.table.style);
        gameWrapper.append(gameTable);
        
        
        var resourcen = game.ressourcen;
        for (var i = 0; i < resourcen.length;  i++) {
        	var grp = resourcen[i];
        	var items = grp.items;
        	for (var j = 0; j < items.length;  j++) {
        		var itm = items[j];
        		for (var k = 0; k < itm.count;  k++) {
        			itm.style.id = 'item-'+itm.id+'-'+k;
        			if(game.player>0) itm.style.angle='180';
        			var item = this.createElement(itm.style);
        			item.draggable( {
        				containment :  contener,
        				scroll : false,
        				drag: function(event, ui) { 
        				  sendUpdate(event, ui,this);
        			}
        			});
        			gameWrapper.append(item);
        		}
        	}
        }
        
        //create players
        var players = this.renderPlayers(game);
        // add all elements to a contener and display
        gameWrapper.append('<p>'+game.name+'</p>');
    
        
        
         for (var i = 0; i < players.length;  i++) {
            gameWrapper.append(players[i]);
        }
        
        contener.append(gameWrapper);
        
        //########################
/*
   		var angle = Perspective.getAngle(0,0);
   		var new_point = Perspective.rotatePoint([0-43/2,0-37/2],angle+Math.PI);
   	 //   Perspective.translateToRelativePosition(new_point,{width:43,height:37});
   		var left = Perspective.getLeft(new_point[0]);
   		var top = Perspective.getTop(new_point[1]);
   		//ende
   		Log(' in der mitte !  new_point: ['+new_point[0]+','+new_point[1]+'] left:'+left+' top:'+top);
   		$('#item-0-1-1').css( {
   			left : left,
   			top : top
   		});
        
  */      
        
        //###################
        
        
    };

    
    this.createElement = function(style){
    
    	/*
    	 Log('create element style.imageName'+style.imageName+',style.imagesPath:'+style.imagesPath+''
    			 
    			 +',image:'+image+',style.bgColor:'+bgColor+',left:'+style.left+
    			 ',top:'+style.top+',position:'+style.position+',id:'+style.id+',_class:'+style._class,'i'); 
    			 */
        return $(document.createElement('div')).css( {
                    backgroundColor : style.getBgColor(),
                    backgroundImage: style.getImagePath(),
                    width: style.width,
                    height: style.height,
                    left: style.left,
                    top:  style.top,
                    position:style.position
                }).attr( {id : style.id}).addClass(style._class);
    };
    this.renderPlayers = function(game){
        var output = new Array();
        var players = game.getTablePlayersOrder();
        Log('# a renderPlayers ','i');
        var SITES = 4;
        var C = 30;
        var p_size = players.length;
        var p_c = Math.floor(p_size/SITES);
        var p_i = p_size % SITES;
        var table_style = game.table.style;
        var player_index = 0;
        for (var i = 1; i <= SITES; i++) {
            var players_per_site = p_c + (i<=p_i ? 1 : 0 );
            for (var j = 1; j <= players_per_site; j++) {
                var y;
                var x;
                
                var player = players[player_index++];
                Log('#  player = players[player_index++] player.style:'+player.style,'i');
                switch (i) {
                    //BOTTOM
                    case 1:
                        y =  table_style.height + table_style.top + C;
                        x = Math.round(table_style.left + table_style.width+(table_style.width / players_per_site)*((1-2*j)/2) - player.style.width/2);
                      Log(' # 1 player name:'+player.name+' x='+x+' y='+y,'i');
                     break;
                    //LEFT
                    case 2:
                        if(p_size==2){
                            y =  table_style.top - C - player.style.height;
                            x = Math.round(table_style.left + table_style.width+(table_style.width / players_per_site)*((1-2*j)/2)  - player.style.width/2);
                   
                        }
                        else{
                            x =  table_style.left - C-player.style.width;
                            y = Math.round(table_style.top +table_style.height+(table_style.height / players_per_site)*((1-2*j)/2) - player.style.height/2);
                    
                        }
                         Log(' # 2 player name:'+player.name+' x='+x+' y='+y,'i');
                        break;
                    //TOP
                    case 3:
                        y =  table_style.top - C - player.style.height; //      interval = table_style.width / players_per_site;
                        x = Math.round(table_style.left + table_style.width+(table_style.width / players_per_site)*((1-2*j)/2)  - player.style.width/2);
                        Log(' # 3 player name:'+player.name+' x='+x+' y='+y,'i');
                       break;
                    //RIGHT
                    case 4:
                        x =  table_style.left + table_style.width + C;
                        y = Math.round(table_style.top+table_style.height+(table_style.height / players_per_site)*((1-2*j)/2) - player.style.height/2);
                         Log(' # 4  player name:'+player.name+' x='+x+' y='+y,'i');
                        break;
                    default:
                        Log(' ERROR: Swich.drawPlayers','e');
                        break;
                }
             
                player.style.setPosition({left:x, top:y});
                var playerElement = this.createElement(player.style);
                playerElement.append('<p>'+player.id+'</p>');
                output.push(playerElement);

            }

        }



        return output;
    };
     }
   
function RandomGenerator(){
    
}
function WebSocketConnector(){
 this.base = IConnector;
   this.base(function(){
        alert("onopen");
   },function(){
        alert("onmessage");
   },function(){
        alert("onclose");
   },function(){
        alert("send");
   },function(){
        alert("join");
   });
}
/*
function CometConnector(){
   this.base = IConnector;
   this.base(function(){
        alert("onopen");
   },function(msg){
	   Log('Bekomme Daten...','i');
        var action = msg.n;
        if(action=='init'){
        	var data = msg.v;
        	var player_id = msg.p_id;
        	Log('Bekomme Daten ... init:'+data+", player id:"+player_id,'i');	
        	GameManager.loadGame(data,player_id);
        }
        else if(action=='j'){
        	var data = msg.v;
        	 Log('Bekomme Daten ...  Player '+data+' has joined.','i');
        }
        else if(action=='m'){
        //	var data = eval('(' + msg.v + ')');')
        	Log('Bekomme Daten');
        	var data = msg.v;
        	var id = data.id;
        	var pos = data.pos;
        	var cur_player = GameManager.instance.players[GameManager.instance.player];
        	Log('Bekomme Daten '+data+'...  pos id '+pos.id+' id:'+id,'i');
        	if(id!=cur_player.id){
        		$('#'+pos.id).css( {
        			left : pos.x,
        			top : pos.y
        		});
        	}
        }
        else  Log('Empfange undefinierte Aktion.','e');
   },function(key){
        alert("onclose"+key);
   },function(url,data){
		$.ajax( {
			type : "POST",
			url : url,
			data : data
		});
   },function(url){
	 if(debug) Log(' Erstelle eine IFRAME...','d');
	   
		$('body')
		.append(
				'<iframe name="hidden" src="' + url + '" id="comet-frame" style="display: none;"></iframe>');
	   
   });

}
*/
var app={
		update: function(msg){
//	Log('app update ...','i');
	var action = msg.n;
 	var data = eval('(' + msg.v + ')');
 	if(action=='j'){
 		Log('app update join...','i');
 		
 	}
 	if(action=='m'){

   	var id = data.id;
   	var pos = data.pos;
   	var cur_player = GameManager.instance.players[GameManager.instance.player];
   	if(id!=cur_player.id){
   	//	Log('cccBekomme Daten cur_player: '+cur_player.id+'...  pos id #'+pos.id+' id:'+id+' pos.x:'+pos.x+',pos.y:'+pos.y+
   	//			' verschiebie: '+$('#'+pos.id),'i');
   		//rotatePoint
   		//left und top
   		//var raltive_position = Perspective.translateToRelativePosition([parseInt(pos.x),parseInt(pos.y)],{width:43,height:37});
   		
   		
   		var leftTop = Perspective.shiftRightBottom({left:parseInt(pos.x),top:parseInt(pos.y)},{width:43,height:37});
   		
   		var x = Perspective.getX(leftTop.left);
   		var y = Perspective.getY(leftTop.top);
   		var angle = Perspective.getAngle(x,y);
   		var new_point = Perspective.rotatePoint([x-43/2,y-37/2],angle+Math.PI);
   		var left = Perspective.getLeft(new_point[0]);
   		var top = Perspective.getTop(new_point[1]);
   		var newleftTop = Perspective.shiftLeftTop({left:left,top:top},{width:43,height:37});
   		
   		//ende
   		Log('9xxx x:'+x+' y:'+y+' new_point: ['+new_point[0]+','+new_point[1]+'] left:'+left+' top:'+top);
   		$('#'+pos.id).css( {
   			left : newleftTop.left,
   			top : newleftTop.top
   		});
   	}
 	}
}
};
function IConnector(){
    this.onopen = null;
    this.onmessage = function(msg){
 	   Log('Bekomme Daten...','i');
 	
       var action = msg.n;
       if(action=='init'){
    	   Log('Bekomme Daten... init','i');
       	var data = msg.v;
       	var player_id = msg.p_id;
       	Log('Bekomme Daten ... init:'+data+", player id:"+player_id,'i');		
       	GameManager.loadGame(data,player_id);
       }
       else if(action=='j'){
    	   Log('Bekomme Daten... joined','i');
   //    	var data = msg.v;
   //    	 Log('Bekomme Daten ...  Player '+data+' has joined.','i');
       }
       else if(action=='m'){
       	var data = eval('(' + msg.v + ')');
       	Log('Bekomme Daten');
     //  	var data = msg.v;
       	var id = data.id;
       	var pos = data.pos;
       	var cur_player = GameManager.instance.players[GameManager.instance.player];
       	Log('Bekomme Daten '+data+'...  pos id '+pos.id+' id:'+id,'i');
       	if(id!=cur_player.id){
       		$('#'+pos.id).css( {
       			left : pos.x+'',
       			top : pos.y
       		});
       	}
       }
       else  Log('Empfange undefinierte Aktion.','e');
  };
    this.onclose = null;
    this.send = function(url,data){
		$.ajax( {
			type : "POST",
			url : url,
			data : data
		});
   };
    this.join = function(url){
   	 if(debug) Log(' Erstelle eine IFRAME...','d');
	   
		$('body')
		.append(
				'<iframe name="hidden" src="' + url + '" id="comet-frame" style="display: none;"></iframe>');
	   
};
}
/*
WebSocketConnector.prototype = new IConnector;
CometConnector.prototype = new IConnector;
*/
/*    #######################   GAME CREATOR #################################*/

var AGECreator = function(domid) {
	return new AGECreator.init(domid);
};
AGECreator.prototype = AGECreator.init = function(domid) {
    this.edit = function() {
        AGEEditor.init($(domid));
    };
};

var AGEEditor={
    gameElement:null,
    init: function(gameElement){
        this.gameElement = gameElement;
        this.editGameParams();
        this.editGameItems();
    },
    editGameParams: function(){
    //    $(this.gameElement)
 //   var game = new Game();

      for (i in  Game) {
        alert(i); // shows getMethods, but not private methods
    }

       
    },
    editGameItems:  function(){
         alert('editGameItems');
    }
};
var Perspective={
    PLAYERS: -1,
    WIDTH: -1,
    HEIGHT: -1,
    //funktioniert nicht mit ((2*Math.PI)/this.PLAYERS - NaN Error
    ANGLE: function(){
        return ((2*Math.PI)/this.PLAYERS);
    },
    VIEW_ANGLE: ((3*Math.PI)/2),

    // positive x Achse
    X:function(){
        return Math.ceil(this.WIDTH/2);
    },
     // positive y Achse
    Y:function(){
        return Math.ceil(this.HEIGHT/2);
    },
    getR: function(x,y){
        return Math.sqrt(Math.pow(x,2) + Math.pow(y, 2));
    },
    getLeft:function(x){
        return x + (this.WIDTH-this.X());
    },
    getTop: function(y){
        return this.Y() - y;
    },
    getX:function(left){
       return left - (this.WIDTH-this.X());
    },
    getY: function(top){
        return this.Y() - top;
    },
    getAngle:function(x,y){
   //    var _angle =  Math.atan2(y, x);
       return  Math.atan2(y, x);//_angle;// < 0 ? _angle+2*Math.PI : _angle;
    },
    getPoint: function(r,angle){
        return [Math.round(r*Math.cos(angle)), Math.round(r*Math.sin(angle))];
    },
    //muss man die Name ändern. Verschiebt eigene Element so die symetrisch zu anderen ist.
    getCenterPosition:function(position,element){
        return {left:(position.left+Math.round(element.width()/2)),top:(position.top+Math.round(element.height()/2))};
    },
    shiftRightBottom:function(position,element){
        return {left:(position.left+Math.round(element.width/2)),top:(position.top+Math.round(element.height/2))};
    },
    shiftLeftTop:function(position,element){
    	return {left:(position.left-Math.round(element.width/2)),top:(position.top-Math.round(element.height/2))};
    },
    translateToRelativePosition: function(point,dim){
         var _top =Perspective.getTop(point[1]);
         var _left=Perspective.getLeft(point[0]);
         return [_left-Math.round(dim.width/2),_top-Math.round(dim.height/2)];
    },
    moveElementToCenter: function(point,element){ 
         return this.translateToRelativePosition(point,{width:element.width(),height:element.height()});
    },
    rotatePoint: function(point, angle){
    	
      var r = this.getR(point[0],point[1]);
  //    Log('ccc rotatePoint r:'+r);
      return this.getPoint(r, angle);
    },
    gamePosition:null

};



function Log(text,level) {
	var msg;

	if(level=='w')msg = '<span style="color:yellow;">WARNING: '+text+'</span>';
	else if(level=='e') msg = '<span style="color:red;">ERROR: '+text+'</span>';
	else if(level=='d') msg = '<span style="color:black;">DEBUG: '+text+'</span>';
	else  msg = '<span style="color:green;">INFO: '+text+'</span>';
	$('#info').prepend(msg + '<br>');

}
var Updater ={
		
};
var GameManager = {
    key:null,
    contener: null,
    connector:null,
    instance:null,
    joined:false,
    url:null,
    game: function(gameparams){
        if(this.instance==null){
        	 Log('The Game instance is NULL.','e');
 
        }
        return this.instance;
    },
    table:function(){
        return this.game().table;
    },
    init:function(initParams){
    	Log('Setze init Parameters...','i');
        this.key = initParams.key;
        this.url = initParams.url;
        this.contener = initParams.id;
        Log('Setze init contener :'+this.contener,'i');
        Log('Erstelle eine Connector...','i');
        this.connector = new IConnector();
        Log('Verbinde sich mit den Server...','i');
        this.connector.join(this.url+'?id='+this.key);
        Log('Url: '+this.url+'?id='+this.key,'i');
    },
    loadGame:function(gameparams,player_id){
    	var game = new Game();
    	Log('loadGame '+gameparams+' player id:'+player_id,'i');
    	this.instance = game.loadFromJSON(gameparams);
    	
    	this.instance.setCurrentPlayer(player_id);
    	 Log('Rendere the Game  in '+this.contener,'i');
    	this.instance.render($(this.contener));
    //	setInterval("GameManager.listenForUpdate()", 70);
    },
    listenForUpdate:function(){
    	
    }
};
function sendUpdate(event, ui,e){
	var url = GameManager.url;
	// Log('drag e'+e.id,'i');
	var cur_player = GameManager.instance.players[GameManager.instance.player];
	var data = "id=" + cur_player.id + "&m={x:" + ui.position.left + ",y:" + ui.position.top + ",id:'"+e.id+"'}";
	Log('sende : '+data,'i');
	GameManager.connector.send(url,data);
}






var ROLE={player:0, guest:1};
var ORDER={shuffled:0, sorted:1};
var DEFAULTS={
    style:{height:15, width:15,bgColor:'white',_class:'',left:0,top:0, bgImage:'',id:'',position:'absolute'},
    item:{name:'Item name',count:1, visibility:true},
    group:{name:'Group name', visibility:true,stacked:false, order:ORDER.sorted, randomgenerator:false},
    game:{name:'Game name',_public:true}
};

