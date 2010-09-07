var Item_colors = [ 'red', 'yellow', 'green', 'blue', '#666666', 'gray','magenta ', 'GoldenRod' ];
var AGEConnection = null;
var AGEPlayer = null;
var AGEItems = new Array;
var GameUrl = "";
var server = null;
var game_id;
var x = -1;
var y = -1;
var count = 0;
var date = null;
var start_time = -1;
var websocket;

var AGE = function(domid) {
	return new AGE.init(domid);
};
AGE.prototype = AGE.init = function(domid) {
	this.connect = function(data) {
		game_id = domid;
		Log('start connection', '');
		server = data.url;
		websocket = data.ws;
	//	if(!window.WebSocket) alert("WEBSOCKET NOT SUPORTED!");
		if (!(window.WebSocket && websocket)){
			Log('WEBSOCKET is NOT supported or Comet selected', '');
			connect_to_server(data.url);
		}
		else{Log('WEBSOCKET is supported :)', '');
		    ws.host = data.host;
			ws.join(data.host,data.url);
		}
		
	};
};

function connect_to_server(url) {
	GameUrl = url;
	Log('connect_to_server, url:', GameUrl);
	$('body')
			.append(
					'<iframe name="hidden" src="' + url + '" id="comet-frame" style="display: none;"></iframe>');

}

function checkConnection() {
	Log('checkConnection()', '');
}
function drawGame(domid, res) {
	item = res.item;
	var offset = $("#" + domid).offset();
	var top = offset.top + item.pos.y;
	var left = offset.left + item.pos.x;
	var div = $(document.createElement('div')).css( {
		height : item.dim.h,
		width : item.dim.w,
		position : 'absolute',
		backgroundColor : item.color,
		border: '2px solid black',
		left : left,
		top : top
	}).attr( {
		id : item.id,
		class : 'game_item'
	});

	$("#" + domid).append(div);
	makeDragable(domid, div);

}
function setInitParams(id, posxy_m, items) {
	AGEPlayer = {
		name : id
	};
	posxy = posxy_m.pos;
	res = {
		item : {
			id : 'item_' + id,
			pos : {
				x : posxy.x,
				y : posxy.y
			},
			color : Item_colors[id % 8],
			dim : {
				h : 30,
				w : 30
			}
		}
	};
	AGEConnection = {
		time_interval : 60,
		player : AGEPlayer,
		resources : res
	};
	Log('starte draw game domid:' + game_id, '');
	drawGame(game_id, AGEConnection.resources);
	AGEItems.push( {
		id : id
	});
	drawItems(items);
	Log('starte game', '');
	startGame(AGEConnection);
}
function makeDragable(containment, div) {
	div.draggable( {
		containment : '#' + containment,
		scroll : false
	});
}
function startGame(age_conn) {
	setInterval("updateGame()", 70);
}

function Log(label, text) {
	$('#info').prepend(
			'<span class="label">' + label + '</span>' + text + '<br>');
}
var app = {
	game_id:null,	
	update : function(data) {
		rec_name = data.name;
		rec_data = eval('(' + data.message + ')');
		if (rec_name == 'j') {
			Log('Joined: ', ' p_' + rec_data.id);
			if (AGEPlayer.name != rec_data.id) {
				if (!exists(AGEItems, rec_data.id)) {
					drawItem(rec_data);
					Log('Draw item from : ', ' p_' + rec_data.id);
				}
			}
		}
		if (rec_name == 'm') {
			if (AGEPlayer.name != rec_data.id) {
				moveItem(rec_data.id, rec_data.pos);
			}
			else{
        		if(start_time > 0){
        			date = new Date();
        			var end_time = date.getTime();
        			Log('Time hin und zur�ck: ',  (end_time-start_time)+' Milisekunden.');
        			start_time=-1;
        		}
        	}

		}

	},
	send : function(data,query) {
		
		$.ajax( {
			type : "POST",
			url : server+''+query,
			data : data
		});
		
	},
	listen : function() {
		$('comet-frame').src = GameUrl + '?' + count;
		count++;
	}
};
function drawItem(rec_data) {
	var id = rec_data.id;
	if (!exists(AGEItems, id)) {
		var offset = $("#" + game_id).offset();
		var top = offset.top + rec_data.pos.y;
		var left = offset.left + rec_data.pos.x;

		var item = {
			id : 'item_' + id,
			color : Item_colors[id % 8],
			dim : {
				h : 30,
				w : 30
			}
		};
		var div = $(document.createElement('div')).css( {
			height : item.dim.h,
			width : item.dim.w,
			position : 'absolute',
			backgroundColor : item.color,
			left : left,
			top : top
		}).attr( {
			id : item.id,
			class : 'game_item'
		});
		AGEItems.push(rec_data);
		$("#" + game_id).append(div);
		
	}
}
function drawItems(items) {
	var i = 0;
	for (i = 0; i < items.length; i++) {
		var item = items[i];
		Log('drawItems', ' schleife');
		if (!exists(AGEItems, item.id)) {
			Log('drawItems', 'id:' + item.id + " pos:x" + item.pos.x + ", y"
					+ item.pos.y);
			drawItem(item);
		}
	}
}
function exists(items, id) {
	var i = 0;
	for (i = 0; i < items.length; i++) {
		if (items[i].id == id)
			return true;
	}
	return false;
}
function findItem(id) {
	var i = 0;
	for (i = 0; i < AGEItems.length; i++) {
		if (AGEItems[i].id == id)
			return AGEItems[i];
	}
	return null;
}
function moveItem(id, pos) {
//	Log('moveItem ','AGEItems.length:'+AGEItems.length);
//	if (exists(AGEItems, id)) {
//		Log('exists(AGEItems, id) ','');
		$('#item_' + id).css( {
			left : pos.x,
			top : pos.y
		});
//	}
}
function updateGame() {

	var game_offset = $("#" + game_id).offset();
	var myitem_offset = $("#item_" + AGEPlayer.name).offset();

	var top = myitem_offset.top - game_offset.top;

	var left = myitem_offset.left - game_offset.left;

	if (y < 0 || x < 0) {
		x = left;
		y = top;
	} else if (top != y | left != x) {
//		Log('update game4', 'x:' + x + ',y:' + y + ',top:' + top + ',left:'
//				+ left);
		x = left;
		y = top;
	//	var data = "m**{id:"+id+",pos:"+pos+"}";
		date = new Date();
		start_time = date.getTime();
		if (!(window.WebSocket && websocket)){
			$.ajax( {
				type : "POST",
				url : server,
				data : "id=" + AGEPlayer.name + "&m={x:" + x + ",y:" + y + "}"
			});
		}
		else{
			ws._send("m**{id:"+AGEPlayer.name+",pos:{x:" + x + ",y:" + y + "}}");
		}
	
	}
}
var ws={
	host: null,
	join: function(host,url) {
	    var location = 'ws://'+host+':8080'+url;//document.location.toString().replace('http:', 'ws:');
	    Log('location: ', location);
	    this._ws = new WebSocket(location);
	    this._ws.onopen = this._onopen;
	    this._ws.onmessage = this._onmessage;
	    this._ws.onclose = this._onclose;
	},
	
	_onopen: function() {
		Log('_onopen', '');
	    room._send('connect');
	},
	_send: function(data) {
	//	Log('sende: ', data);
	    if (this._ws)
	        this._ws.send(data);
	},
	_onmessage: function(m) {
	    if (m.data) {
	    	var msg = (m.data).split("**");
	   // 	Log('msg: ', msg);
            var action = msg[0];
            var data = eval('(' + msg[1] + ')');
            if (action == 'j'){
            	Log('Joined: '+data.id+', Data:', data);
            	if (AGEPlayer.name != data.id) {
    				if (!exists(AGEItems,data.id)) {

    					drawItem(data);
    					Log('Draw item from (Items.length ist '+AGEItems.length+'): ', ' p_' + data.id);
    				}
    			}
            	
            }
            if(action == 'init'){
            	setInitParams(data.id, data, data.items);
            	Log('init id: ', data.id);
            }
            if(action == 'm'){
            	if (AGEPlayer.name != data.id) {
    				moveItem(data.id, data.pos);
    			}
            	else{
            		if(start_time > 0){
            			date = new Date();
            			var end_time = date.getTime();
            			Log('Time hin und zur�ck: ',  (end_time-start_time)+' Milisekunden.');
            			start_time=-1;
            		}
            	}
            }
	    	
	    }
	},
	_onclose: function() {
		Log('_onclose: ','');
	    this._ws = null;
	}
};










































var debug = true;

function Style(height, width,bgColor,bgImage,id,_class,left,top,position) {
    var _style = DEFAULTS.style;
    this.height = height || _style.height;
    this.width = width || _style.width;
    this.bgColor = bgColor || _style.bgColor;
    this.bgImage = bgImage || _style.bgImage;
    this.id = id || _style.id;
    this._class = _class || _style._class;
    this.left= left;// || _style.left;
    this.top= top;// || _style.top;
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
	    this.bgImage = '/age/images/'+GameManager.key+'/'+s.bgImage;
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
	    style.id = 'item:'+this.id;
	    style._class = 'item';
	    this.style=style.loadFromJSON(i.style);
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
	    this.visibility = gup.visibility;
	    this.order = g.order;
	    this.randomgenerator = g.randomgenerator;
	    var style = new Style();
	    style._class = 'group';
	    style.id = 'group:'+this.id;
	    this.style=style.loadFromJSON(g.style);
	    var itms = g.items;
	    for ( var int = 0; int < itms.length; int++) {
    		var item = new Item();
    		item.id = this.id+':'i;
    		this.items.push(item.loadFromJSON(itms[i]));
		}
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
	    return this;
    };
    
}
function Game(name,_public){
    var _game = DEFAULTS.game;
    this.name = name || _game.name;
    this._public = _public || _game._public;
    this.style = new Style(800, 800,'gray',null,'game','game',0,0,'relative');
    this.ressourcen = new Array();
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
    this.render=function(contener){
        var renderer = new Renderer(this);
        renderer.start(contener);
    };
    this.loadFromJSON = function(g){
    	this.name = g.name;
    	this._public = g._public;
    	var table = new Table();
    	this.table = table.loadFromJSON(g.table);
    	var res = g.resourcen;
    	for ( var int = 0; int < res.length; int++) {
    		var group = new Group();
    		group.id = i;
    		this.ressourcen.push(group.loadFromJSON(res[i]));
		}
    	return this;
    };
}
function Renderer(game){
    this.start = function(contener){

        Perspective.gamePosition=contener.position();
        Perspective.WIDTH =  game.style.width;
        Perspective.HEIGHT =  game.style.height;

        //create game wrapper
        var gameWrapper = this.createElement(game.style);

        //create table in the center of contener
        var gameTablePos = Perspective.translateToRelativePosition([0,0],{width:game.table.style.width,height:game.table.style.height});
        game.table.style.setPosition({left:gameTablePos[0],top:gameTablePos[1]});
        var gameTable = this.createElement(game.table.style);

        //create players
        var players = this.renderPlayers(game);
        Log(' #current player ist '+game.players[game.player].name,'i');
        // add all elements to a contener and display
        gameWrapper.append('<p>'+game.name+'</p>');
        gameWrapper.append(gameTable);
         for (var i = 0; i < players.length;  i++) {
            gameWrapper.append(players[i]);
        }
        contener.append(gameWrapper);
    };

    
    this.createElement = function(style){
        return $(document.createElement('div')).css( {
                    backgroundColor : style.bgColor,
                    width: style.width,
                    height: style.height,
                    left: style.left,
                    top:  style.top,
                    position:style.position
                }).attr( {id : style.id}).addClass(style._class);
    }
    this.renderPlayers = function(game){
        var output = new Array();
        var players = game.getTablePlayersOrder();
         Log('#  players first name'+players[0].name,'i');
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
                playerElement.append('<p>'+player.name+'</p>');
                output.push(playerElement);

            }

        }



        return output;
    }
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
function CometConnector(){
   this.base = IConnector;
   this.base(function(){
        alert("onopen");
   },function(msg){
	   if(debug) Log('CometConnector.onmessage '+msg,'d');
        var action = msg.n;
        if(action=='init'){
        	var data = msg.v;
        	Log('Bekomme Daten ... init:'+data,'i');	
        	GameManager.loadGame(data);
        }
        else if(action=='j'){
        	var data = msg.v;
        	 Log('Bekomme Daten ...  Player '+data+' has joined.','i');
        }
        else  Log('Empfange undefinierte Aktion.','e');
   },function(key){
        alert("onclose"+key);
   },function(key){
        alert("send"+key);
   },function(url){
	 if(debug) Log(' Erstelle eine IFRAME...','d');
	   
		$('body')
		.append(
				'<iframe name="hidden" src="' + url + '" id="comet-frame" style="display: none;"></iframe>');
	   
   });

}
function IConnector(onopen,onmessage,onclose,send,join){
    this.onopen = onopen;
    this.onmessage = onmessage;
    this.onclose = onclose;
    this.send = send;
    this.join = join;
    /*
    if (!window.WebSocket){
        Log('WEBSOCKET is NOT supported or Comet selected');
        connect_to_server(data.url);
    }
    else{
        Log('WEBSOCKET is supported :)');
        ws.host = data.host;
        ws.join(data.host,data.url);
    }
    */

}
WebSocketConnector.prototype = new IConnector;
CometConnector.prototype = new IConnector;

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
      return this.getPoint(r, angle);
    },
    gamePosition:null  /*,
    drawPlayers: function(players){
        var SITES = 4;
        var C = 0;
        var p_size = this.PLAYERS;
        var p_c = Math.floor(p_size/SITES);
        var p_i = p_size % SITES;
        var table_style = GameManager.table().style();
        for (var i = 1; i <= SITES; i++) {
            var players_per_site = p_c + (i<=p_i ? 1 : 0 );
            for (var j = 1; j < players_per_site; j++) {
                switch (i) {
                    case 1:
                       var y =  -Math.round(table_style.height/2);
                        break;
                    case 2:
                        var x =  -Math.round(table_style.width/2);

                        break;
                    case 3:
var y =  Math.round(table_style.height/2);
                        break;
                    case 4:
                        var x =  Math.round(table_style.width/2);

                        break;
                    default:
                        alert('ERROR: Swich.drawPlayers');
                        break;
                }

            }
           
        }
    },
    createPerspektive: function(players_size){
        this.PLAYERS = players_size;
        this.gamePosition=$("#game").position();

Perspective.drawPlayers(1);
 var trelPos = Perspective.translateToRelativePosition([0,0],{width:400,height:400});
          var table = $(document.createElement('div')).css( {
                    left:(trelPos[0]+Perspective.gamePosition.left),
                    top : (trelPos[1]+Perspective.gamePosition.top)
                }).attr( {
                    id : 'table', class : 'table'
                }).append('Table');
                $("#game").append(table);




        for (var i = 1; i <= players_size; i++) {


  var p_angle = Perspective.VIEW_ANGLE-Perspective.ANGLE()*(i-1);
 // Log('#p_angle:'+p_angle);
   var p_point = Perspective.getPoint(300,p_angle);
//    Log('#p_point:'+p_point[0]+' top:'+p_point[1]);
   var relPos = Perspective.translateToRelativePosition(p_point,{width:150,height:150});
   Log('#relPos player: left'+relPos[0]+' top:'+relPos[1]);
   var player = $(document.createElement('div')).css( {
                    left:(relPos[0]+Perspective.gamePosition.left),
                    top : (relPos[1]+Perspective.gamePosition.top)
                }).attr( {
                    id : 'player_'+i,
                    class : 'player'
                }).append('Player '+i);
                $("#game").append(player);




            
            if(i>1){
                var div = $(document.createElement('div')).css( {
                    backgroundColor : 'black',
                    left:15*i,
                    top : 10+i
                }).attr( {
                    id : 'item_'+i,
                    class : 'item'
                }).append(''+i);
                $("#game").append(div);
                
            }
        }
        
        Log('#game left:'+Perspective.gamePosition.left+' top:'+Perspective.gamePosition.top);
        $("#item_1").draggable({
		scroll : false,
                 appendTo: '#game',
                containment : '#game',
                drag: function(event, ui) {
                    var pos = Perspective.getCenterPosition(ui.position, $("#item_1"));
                    var point = [Perspective.getX(pos.left-$("#game").position().left),Perspective.getY(pos.top-$("#game").position().top)];
                    var view_angle = Perspective.getAngle(point[0],point[1]);
             //        Log('view_angle: '+view_angle+' step angle:'+Perspective.ANGLE()+' point x:'+point[0]+'   y:'+point[1]);
                    for (var i = 2; i <= players_size; i++) {
                         var div = $('#item_'+i);
                        var angle = view_angle-Perspective.ANGLE()*(i-1);
                 //       angle = angle < 0 ?  (angle +2*Math.PI) : angle;
                        var newPoint = Perspective.rotatePoint(point, angle);
                        var lefttop =Perspective.moveElementToCenter(newPoint,div);
   
                       
                        div.css({left:(lefttop[0]+Perspective.gamePosition.left),top:(lefttop[1]+Perspective.gamePosition.top)});

                    }
             //       Log('drag left:'+(pos.left-$("#game").position().left)+' top:'+(pos.top-$("#game").position().top));
                }
	});
        
    }*/

};



function Log(text,level) {
	var msg;
	if(level=='w')msg = '<span style="color:yellow;">WARNING: '+text+'</span>';
	else if(level=='e') msg = '<span style="color:red;">ERROR: '+text+'</span>';
	else if(level=='d') msg = '<span style="color:black;">DEBUG: '+text+'</span>';
	else  msg = '<span style="color:green;">INFO: '+text+'</span>';
	$('#info').prepend(msg + '<br>');
}

var GameManager = {
    key:null,
    connector:null,
    instance:null,
    joined:false,
    url:null,
    game: function(gameparams){
        if(this.instance==null){
        	 Log('The Game instance is NULL.','e');
         //   this.instance = this.loadGame(gameparams);
            /*
            this.instance.table = new Table(new Style(600, 600,'DarkBlue',null,'table','table',-1,-1,'absolute'));
            var players = [new Player('Maciek',1),new Player('Igor',2),new Player('Claudia',3),new Player('Tom',4),new Player('Claudia',3)];
            //,new Player('Tomek',5),new Player('Basia',6),new Player('Izydpr',7),new Player('Monika',8),new Player('Patryk',9)
            this.instance.players = players;
            this.instance.player = 3;
            */
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
        Log('Erstelle eine Connector...','i');
        this.connector = new CometConnector();
        Log('Verbinde sich mit den Server...','i');
        this.connector.join(this.url+'?id='+this.key);
        Log('Url: '+this.url+'?id='+this.key,'i');
        	
   //     	var game = this.game(initParams.key);
   //         game.render($(initParams.id));
       
        
  
    },
    loadGame:function(gameparams){
    	var game = new Game();
    	this.instance = game.loadFromJSON(gameparams);
    	
    }
};








var ROLE={player:0, guest:1};
var ORDER={shuffled:0, sorted:1};
var DEFAULTS={
    style:{height:15, width:15,bgColor:'white',_class:'',left:0,top:0, bgImage:'',id:'',position:'absolute'},
    item:{name:'Item name',count:1, visibility:true},
    group:{name:'Group name', visibility:true,stacked:false, order:ORDER.sorted, randomgenerator:false},
    game:{name:'Game name',_public:true}
};

var tmp={
		test:function(msg){
	 Log('### TEST:'+msg,'d');
}
};

