
var debug = false;

//document.write('<script src="/age/js/age_settings.js" type="text/javascript"></script>');
function Style(height, width,bgColor,bgImage,id,_class,left,top,position) {
    var _style = DEFAULTS.style;
    this.height = height || _style.height;
    this.width = width || _style.width;
    this.bgColor = bgColor || _style.bgColor;
    this.bgImage = bgImage || _style.bgImage;
    this.imagesPath = '';
    this.imageName = '';
    this.angle='0';
    this.zIndex=0;
    this.isNull=function(e){
    	if(e==null | e == '' | e=='null') return true;
    	return false;
    };
    this.getBgColor = function(){
    	if(bgColor=='') return 'transparent';
    	else return this.bgColor;
    };
    this.getImagePath = function(url){
    	if(debug) Log('getImagePath this.bgImage:'+this.bgImage+' imageNam:'+this.imageName+' this.angle:'+this.angle+' this.imagesPath:'+this.imagesPath,'d');
    	if(!this.isNull(this.bgImage)){ 
    		return url ? 'url('+this.bgImage+')' : this.bgImage ;}
    	if(!(this.isNull(this.imagesPath) | this.isNull(this.imageName))) {
    		var path = this.imagesPath+this.angle+'_'+this.imageName;
    		if(url) return 'url('+path+')';
    		else return path; 		
    	}
    	else return null;
    };

    this.id = id || _style.id;
    this._class = _class || _style._class;
    this.left= left || 0;
    this.top= top || 0;
    this.position = position || _style.position;
    this.setPosition = function(pos){
        this.left = Math.round(pos.left);
        this.top = Math.round(pos.top);
    };
    this.setDomId = function(domid){
        this.id = domid;
    };
    this.copy = function(){
    	var style = new Style(this.height, this.width,this.bgColor,this.bgImage,this.id,this._class,this.left,this.top,this.position);
    	style.imagesPath=this.imagesPath;
    	style.imageName=this.imageName;
    	style.angle = this.angle;
    	style.zIndex = this.zIndex;
    	return style;
    };
    this.setStyle = function(s){
        this.height = s.height;
	    this.width = s.width;
	    this.bgColor = s.bgColor;
	    this.bgImage=s.bgImage;
	    this.imageName = s.imageName;
	    this.imagesPath = s.imagesPath;
	    this.left= Math.round(s.left);
	    this.top= Math.round(s.top);
	    this.zIndex = s.zIndex;
    };
   this.loadFromJSON = function(s){
        this.setStyle(s);
	    this.imagesPath = AgeSettings.userImagePath+GameManager.key+'/';
	 //   if(s.imageName) this.bgImage = this.imagesPath+this.angle+'_'+s.imageName;
	 //   else this.bgImage=null;
	    if(s.bgImage) this.bgImage=s.bgImage;
    	return this;
    };
}
function Item(id,name,count,visibility,style){
    var _item = DEFAULTS.item;
    this.id = id ||-1;
    this.domid=null;
    this.HTMLElement=null;
    this.actionBar=null;
    this.isItem=true;
    this.group=null;
    this.groupBy=-1;
    this.owner=-1;
    this.getDomIdPrefix = function(){
        return AgeSettings.itemDomIdPrefix;
    };
    this.getDomId=function(){
    	if(this.id > -1) return this.getDomIdPrefix()+'-'+this.id;
    	return null;
    };
    this.name = name || _item.name;
    this.count = count || _item.count;
//    this.styleInstancen = new Array(this.count);
    this.visibility = visibility || _item.visibility;
    this.style=style || new Style();
    this.positionComponent={left:null,top:null,zIndex:null};
    this.setPositionComponent=function(pos){
    	this.positionComponent = pos;
    };
    this.getPositionComponent = function(){
    	return this.positionComponent;
    };
    this.setLeft = function(left){
    	var _left = Math.round(left);
    	this.style.left = _left;
    	if(this.positionComponent.left != null) this.positionComponent.left.attr('value',_left);
    };
    this.setTop = function(top){
    	var _top = Math.round(top);
    	this.style.top = _top;
    	if(this.positionComponent.top != null) this.positionComponent.top.attr('value',_top);
    };
    this.setZIndex=function(zIndex){
    //	if(debug) Log('Item.setZIndex:'+zIndex,'d')
    	this.style.zIndex = zIndex;
    	if(this.positionComponent.zIndex != null) this.positionComponent.zIndex.attr('value',zIndex);
    };
    this.copy = function(){
        var cpItem=new Item(null,this.name,this.count,this.visibility,this.style);
        cpItem.group=this.group;
        cpItem.groupBy = this.groupBy;
        return cpItem;
    };
    
    this.setVisibility=function(vsbl){
    	this.visibility=vsbl;
    	
    	if(vsbl){
    		var imageName = this.style.imageName;
    		var bgColor = this.style.bgColor;
    		this.group.visibility=true;
    	}
    	else{
    		imageName=this.group.style.imageName;
    		bgColor = this.group.style.bgColor;
    	}
    	
    	var image_path = this.style.imagesPath+this.style.angle+'_'+imageName;
    	
    	this.setItemVisibilityIcon(this.visibility);
    	this.HTMLElement.css({backgroundColor:bgColor});
    	var img_e = this.HTMLElement.children('img').first();
    	if(img_e) img_e.attr('src',image_path);
    };
    this.setItemVisibilityIcon=function(vsbl){
    	if(vsbl) this.actionBar.children('img').first().attr('src',AgeSettings.imagePath+AgeSettings.imageUnVisible);
    	else this.actionBar.children('img').first().attr('src',AgeSettings.imagePath+AgeSettings.imageVisible);
    };
    this.sendItemVisibilityUpdate=function(vsbl){
    	try{
    		var player = GameManager.instance.players[GameManager.instance.player];
	    	var player_name=player.name;
	    	var domid=this.HTMLElement.attr('id');
	    	this.setItemVisibilityIcon(vsbl);
	    	var update = 'action=v&i='+this.id+'&dom='+domid+'&player='+player_name+'&v='+vsbl+'&private='+(this.owner==player.id);
	    	if(debug) Log('Item send visibility update:'+update,'d');
	    	AgeUpdater.sendUpdate(update);
    	}catch(e){Log('Item.sendItemVisibilityUpdate() - '+e,'e');}
    };
    this.createActionBar=function(){
    	if(this.actionBar==null){
    		
    		this.actionBar=HTMLRenderer.div({_class:'ItemActionBar'}).css('display','none');
    		var _item = this;
    		
    		if(this.visibility) var img = HTMLRenderer.img({src:AgeSettings.imagePath+AgeSettings.imageUnVisible});
    		else img = HTMLRenderer.img({src:AgeSettings.imagePath+AgeSettings.imageVisible});
    		if(debug) Log('this.group.stacked:'+this.group.stacked,'d');
    		var img_s = HTMLRenderer.img({src:AgeSettings.imagePath+'stacked0.png'});
    		
    		img.bind('click', function () {_item.sendItemVisibilityUpdate(!_item.visibility); });
    		img_s.bind('click', function () {_item.group.sendGroupStackedUpdate(!_item.group.stacked,_item.id); });
    		
    		this.actionBar.append(img);
    		this.actionBar.append(img_s);
    		
    		this.HTMLElement.append(this.actionBar);
    		
    	}
    };
    
    this.bindAction = function(){
    	if(this.actionBar==null) this.createActionBar();
    	var visibility = this.actionBar.css('display');
    	if(debug) Log('Item:bindAction visibility:'+visibility,'d');
    	if(visibility=='none') this.actionBar.css({display:'block'});
    	else this.actionBar.css({display:'none'});
       return this;
    };
    this.update=function(data){
 		if(data.visibility){
 			this.style.bgColor = data.style.bgColor;
 			this.style.imageName = data.style.imageName;
		}
		var game = GameManager.instance;
		this.style.angle = game.players[game.player].angle;
		this.setVisibility(data.visibility);
    };
     this.loadFromJSON = function(i){
		 this.name = i.name;
		 this.count = i.count;
		 this.id = i.id;
		 if(debug) Log('Item.lade from JSON id:'+i.id,'d');
		 this.actionBar=null;
		 this.HTMLElement=null;
		 this.groupBy=i.groupBy;
		 this.owner=i.owner;
		 this.visibility = i.visibility;
		 var style = new Style();
		 style.id = this.getDomId();
		 style._class = this.getDomIdPrefix();
		 this.style=style.loadFromJSON(i.style);
		 return this;
    };
}

function Player(name,id){
    this.id = id;
    this.name = name;
    this.angle = null;
    this.HTMLElement=null;
    this.active = false;
    this.getDomIdPrefix = function(){
        return 'agePlayer';
    };
    this.addActionInPlaceEditor = function(){
    	var header_name = this.HTMLElement.children('p').first();
    	var name = this.name;
    	var id = this.id;
    	header_name.bind('dblclick', function() {
    	//	  header_name.unbind('dblclick');
    		  var input_txt = HTMLRenderer.inputText({name:'playerName',value:name});
    		  header_name.html(input_txt);
    		  var img = HTMLRenderer.img({src:AgeSettings.imagePath+'ok.png'});
    		  img.bind('click', function() {
    			  if(input_txt.val() != name){
    				  AgeUpdater.sendUpdate('action=playerName&name='+input_txt.val()+'&player='+id);
        			  header_name.html(input_txt.val());
    			  }
    			  
    		  });
    		  input_txt.bind('blur', function() {
    			  if(input_txt.val() != name){
    				  AgeUpdater.sendUpdate('action=playerName&name='+input_txt.val()+'&player='+id);
        			  header_name.html(input_txt.val());
    			  }
    			  
    		  });
    		  header_name.append(img);
    	});
    };
    this.setName=function(name){
    	this.name=name;
    	var header_name = this.HTMLElement.children('p').first();
    	header_name.html(name);
    	header_name.unbind('dblclick');
    	this.addActionInPlaceEditor();
    };
    this.getDomId=function(){
    	if(this.id > -1) return this.getDomIdPrefix()+'-'+this.id;
    	return null;
    };
    this.getName=function(){
    	if(debug) Log('Player.getName() id='+this.id+', name:'+this.name,'d');
        if(this.id < 0) return AgeSettings.playerAreaTitleNoPlayer;
        else return this.name;
    };
    this.setDomId=function(_id){
        this.style.setDomId(this.getDomIdPrefix()+'-'+_id);
    };
    this.style = new Style(130, 150,'transparent',null,this.getDomId(),this.getDomIdPrefix(),-1,-1,'absolute');
    this.loadFromJSON = function(p){
    	this.name = p.name;
    	if(debug) Log('Player load form json angle:'+p.angle,'d');
    	this.angle = p.angle;
    	this.id = p.id;
    	this.active=p.active;
    	this.style.left=p.style.left;
    	this.style.top=p.style.top;
    	return this;
   };
}

function Group(name,visibility,stacked,order,randomgenerator,style){
    var _group = DEFAULTS.group;
    this.id = -1;
    this.getDomIdPrefix = function(){
        return AgeSettings.groupDomIdPrefix;
    };
    this.getDomId=function(){
    	if(this.id > -1) return this.getDomIdPrefix()+'-'+this.id;
    	return null;
    };
    this.owner=-1;
    this.actionBar=null;
    this.isItem=false;
    this.templateId=null;
    this.HTMLElement=null;
    this.name = name || _group.name;
    this.stacked = stacked || _group.stacked;
    this.visibility = visibility || _group.visibility;
    this.order = order || _group.order;
    this.randomgenerator = randomgenerator || _group.randomgenerator;
    this.items= new Array();
    this.style=style || new Style();
    this.resetActions = function(){
    	 this.actionBar = null;
    	for ( var i = 0; i < this.items.length; i++) {
			var itm = this.items[i];
			itm.actionBar=null;
			
		}
    };
    this.animateRandom = function(item_id){
    	if(debug) Log('Group.animateRandom() item_id:'+item_id+', this.randomgenerator:'+this.randomgenerator,'d');	
    	if(this.randomgenerator){ 	
    		var item_image=null;
    		var image = this.HTMLElement.children('img').first();
    		for ( var i = 0; i < this.items.length; i++) {
    			var itm = this.items[i];
    			if(itm.id==item_id) item_image = itm.HTMLElement.children('img').first();
    		}
    		setTimeout(function(){ 
    			image.attr('src',item_image.attr('src')); 
    		  }, 500 ); 
			
    	}else Log('Group.animateRandom() randomgenerator is false.','e');
    };
    this.findItem=function(item_id){
    	for ( var i = 0; i < this.items.length; i++) {
			var itm = this.items[i];
			if(itm.id==item_id) return itm;
			
		}
    	return null;
    };
    this.sendGroupStackedUpdate=function(stacked,atItem){
    	try{
    		if(debug) Log('XXXXXXXX sendGroupStackedUpdate=function(stacked:'+stacked,'d');
	    	var player_name=GameManager.instance.players[GameManager.instance.player].name;
	    	var update = 'action=stack&id='+this.id+'&atItem='+atItem+'&playerName='+player_name+'&stacked='+stacked;	
	    	AgeUpdater.sendUpdate(update);
	    	
    	}catch(e){Log('Group.sendGroupStackedUpdate() - '+e,'e');}
    };
    this.renderItem=function(item){
            return HTMLRenderer.createGameItem(item.style,{});
    };
    this.resetItemsPosition = function(){
    	for ( var i = 0; i < this.items.length; i++) {
			var itm = this.items[i];
			itm.style.left = this.style.left;
			itm.style.top = this.style.top;
		}
    };
    this.positionComponent={left:null,top:null,zIndex:null};
    this.setPositionComponent=function(pos){
    	this.positionComponent = pos;
    };
    this.getPositionComponent = function(){
    	return this.positionComponent;
    };
    this.getFirstItem = function(){
    	if(this.items.length == 0) return null;
    	var f_itm = this.items[0];
    	for ( var i = 1; i < this.items.length; i++) {
			var itm = this.items[i];
			if(f_itm.style.zIndex < itm.style.zIndex) f_itm = itm;
		}
    	return f_itm;
    };
    this.setZIndex=function(zIndex){
    	this.style.zIndex = zIndex;
    	if(this.positionComponent.zIndex != null) this.positionComponent.zIndex.attr('value',zIndex);
    };
    this.setLeft = function(left){
    	var _left = Math.round(left);
    	this.style.left = _left;
    	if(this.positionComponent.left != null) this.positionComponent.left.attr('value',_left);
    };
    this.setTop = function(top){
    	var _top = Math.round(top);
    	this.style.top = _top;
    	if(this.positionComponent.top != null) this.positionComponent.top.attr('value',_top);
    };
    this.bindAction = function(){
    	if(this.actionBar==null) this.createActionBar();
    	var visibility = this.actionBar.css('display');
    	if(debug) Log('Group:bindAction visibility:'+visibility,'d');
    	if(visibility=='none') this.actionBar.css({display:'block'});
    	else this.actionBar.css({display:'none'});
       return this;
    };
    this.createActionBar=function(){
       if(this.actionBar==null){
    		
    		this.actionBar=HTMLRenderer.div({_class:'GroupActionBar'}).css('display','none');
    		var _group = this;
    		if(this.visibility) var img = HTMLRenderer.img({src:AgeSettings.imagePath+AgeSettings.imageUnVisible});
    		else img = HTMLRenderer.img({src:AgeSettings.imagePath+AgeSettings.imageVisible});
            
    		var img_s = HTMLRenderer.img({src:AgeSettings.imagePath+'stacked1.png'});
    		var img_r = HTMLRenderer.img({src:AgeSettings.imagePath+'random1.png'});
    		img_s.bind('click', function () {_group.sendGroupStackedUpdate(false,_group.id); });
    		img_r.bind('click', function () {_group.sendRandomizeUpdate(); });   		
    		img.bind('click', function () {_group.sendVisibilityUpdate(!_group.visibility); });
    		
    		this.actionBar.append(img);
    		this.actionBar.append(img_s);
    		this.actionBar.append(img_r);
    		this.HTMLElement.append(this.actionBar);
    		
    	}
    };
    this.sendRandomizeUpdate = function(){
    	if(debug) Log('group randomize send update','d');
    	var player_name=GameManager.instance.players[GameManager.instance.player].name;
    	var update = 'action=randomize&id='+this.id+'&player='+player_name;	
    	AgeUpdater.sendUpdate(update);
    };
    this.sendVisibilityUpdate=function(vsbl){
    	try{
    		
	    	var player_name=GameManager.instance.players[GameManager.instance.player].name;
	   // 	var domid=this.HTMLElement.attr('id');
	   // 	this.setItemVisibilityIcon(this.visibility);
	   // 	if(this.visibility) var update = 'action=v&i='+this.id+'&dom='+domid+'&player='+player_name+'&v=false';	
	   // 	else update = 'action=v&i='+this.id+'&dom='+domid+'&player='+player_name+'&v=true';
	   // 	if(debug) Log('Item send visibility update this.visibility:'+this.visibility+' vsbl:'+vsbl+' this.visibility ^ vsbl:'+(this.visibility ^ vsbl),'d');
	    	var update = 'action=v&i='+this.id+'&player='+player_name+'&v='+vsbl+'&isGroup=true';	
	    	AgeUpdater.sendUpdate(update);
	    	
    		if(debug) Log('****** Group. sendVisibilityUpdate: vsbl-'+vsbl,'d');
    	}catch(e){Log('Group.sendItemVisibilityUpdate() - '+e,'e');}
    };
    this.setVisibility=function(vsbl){
    	this.visibility=vsbl;
    	var image_path = this.style.imagesPath+this.style.angle+'_'+this.style.imageName;
    	this.setItemVisibilityIcon(this.visibility);
    	var img_e = this.HTMLElement.children('img').first();
    	if(img_e) img_e.attr('src',image_path);
    };
    this.setItemVisibilityIcon=function(vsbl){
    	if(vsbl) this.actionBar.children('img').first().attr('src',AgeSettings.imagePath+AgeSettings.imageUnVisible);
    	else this.actionBar.children('img').first().attr('src',AgeSettings.imagePath+AgeSettings.imageVisible);
    };
   this.loadFromJSON = function(g){
	    this.name = g.name;
	    this.stacked = g.stacked;
	    this.visibility = g.visibility;
	    this.order = g.order;
	    this.id=g.id;
	    this.actionBar=null;
	    this.HTMLElement=null;
	    if(g.templateId) this.templateId=g.templateId;
	    this.randomgenerator = g.randomgenerator;
	    var style = new Style();
	    style._class = this.getDomIdPrefix();
	    style.id = this.getDomId();
	    this.style=style.loadFromJSON(g.style);
	    var itms = g.items;
	    this.items= new Array();
	    for ( var i = 0; i < itms.length; i++) {
    		var item = new Item();
    		item.group=this;
     		this.items.push(item.loadFromJSON(itms[i]));
		}
	    return this;

    };
}

function Table(style){
  //  var _table = DEFAULTS.table;
    this.items = new Array();
    this.style=style || new Style(0, 0,null,null,'ageTable','ageTable',0,0,'absolute');
    this.loadFromJSON = function(t){
    	var style = new Style();
	    style._class = 'table';
	    style.id = 'table';
	    this.style=style.loadFromJSON(t.style);
//	    Log('Erstelle Table:','i');
	    return this;
    };
}

function Game(name){
    var _game = DEFAULTS.game;
    this.name = name || _game.name;
    this.style = new Style(900, 900,'#eeeeee',null,'ageContent','ageGame',0,0,'relative');
    this.ressourcen = new Array();

    this.playersSize=2;
    this.player = -1,
    this.players = [];
    this.computeGameDimension = function(){
        var _h = parseInt(this.table.style.height);
        var _w = parseInt(this.table.style.width);
        if(debug) Log('Game.computeGameDimension <b>h:'+_h+' w:'+_w+'</b>','d');
        var padding = 470;
        if(!isNaN(_w) & !isNaN(_h)){
            this.style.height=AgeUtil.max(_w,_h)+padding;
            this.style.width=AgeUtil.max(_w,_h)+padding;
        }
        else Log('Game.computeGameDimension - height or width are NaN','e');
    };
    this.getPlayerOwner=function(){
    	if(this.player>=0) return this.players[this.player];
    	return null;
    };
    this.setRessourcen = function(ressourcen){
        this.ressourcen = ressourcen;
    };
    this.getPlayers=function(){
        if(this.playersSize > 0 & (this.players.length==0)){
            for (var i = 0; i < this.playersSize; i++) {
                this.players.push(new Player('', -1));
            }
        }
        return this.players;
    };
    this.findGroup=function(grp_id){
    	for ( var i = 0; i < this.ressourcen.length; i++) {
    		var group = this.ressourcen[i];
    		if(group.id == grp_id) return group; //&& group.randomgenerator
		}
    	if(debug) Log('findGroup return NULL grp_id:'+grp_id,'d');
    	return null;
    };
    this.findItem=function(itm_id){
    	for ( var i = 0; i < this.ressourcen.length; i++) {
    		var group = this.ressourcen[i];
    		var item = group.findItem(itm_id);
    		if(item != null) return item;
		}
    	return null;
    };
    this.findPlayer=function(player_id){
    	for ( var i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			if(player.id == player_id) return player;
		}
    	return null;
    };
    this.getTablePlayersOrder=function(){
        var _players = this.getPlayers();
        if(this.player == -1) return _players;
        var players =_players.slice(0, _players.length);
        for (var i = 0; i < players.length;  i++) {
            if(i < this.player) players.push(players.shift());
        }
        return players;
    };
    this.table = new Table();
    this.setCurrentPlayer = function(player){
    	for ( var j = 0; j < this.players.length; j++) {
    		var _player = this.players[j];
    		if(_player.id == player.id) this.player=j;
		}
    };
    this.renderer=null;
    this.render=function(contener){
        this.getRenderer().start(contener);
    };
    this.getRenderer = function(){
    	this.computeGameDimension();
    	if(this.renderer==null){	
    		this.renderer = new Renderer(this);
    	}
    	return this.renderer;
    };
    this.loadFromJSON = function(g){
    	if(g!=null){
    	this.name = g.name;
    	this.playersSize = g.playersSize;
    	this._public = g._public;
    	var players = g.players;
    	for ( var j = 0; j < players .length; j++) {
    		var player = new Player(players[j].name,players[j].id);
    		player.loadFromJSON(players[j]);
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
    	}
    	return this;
    };
}

function Renderer(game){
    this.gameContent=null;
    this.degree = 0;
    this.init=function(){
        Perspective.WIDTH =  game.style.width;
        Perspective.HEIGHT =  game.style.height;
        
    };
    this.setTable=function(){
        var gameTablePos = Perspective.translateToRelativePosition([0,0],{width:game.table.style.width,height:game.table.style.height});
        game.table.style.setPosition({left:gameTablePos[0],top:gameTablePos[1]});
    };
    this.start = function(contener_id){
    	try{
   // 	Log('Renderer.start: angle '+game.players[game.player].angle,'d');
    	var cur_player = game.getPlayerOwner();	
    	if(cur_player != null) this.degree =  cur_player.angle;
        var contener = $(contener_id);
    	Log('Starte Rendering in '+contener,'i');
    	Perspective.gamePosition=contener.position();
    	this.init();;
        //create game wrapper with 3 div's areas: header, content and footer
        var gameWrapper = HTMLRenderer.div({id:'ageWrapper'});
        var gameHeader = HTMLRenderer.div({id:'ageHeader'});
     //   gameHeader.append(HTMLRenderer.div({id:AgeSettings.ageConnectionStatusId}).append('<img src="/age/images/connect_idle.gif"/>'));
        gameHeader.append(HTMLRenderer.h1({content:game.name}));
     
        var cont  = this.createElement(game.style);

        this.gameContent = cont;
        var gameFooter = HTMLRenderer.div({id:'ageFooter'});
        Log('game name :'+game.name,'i');
        //draw a table in the center of game
        this.setTable();
      
        var gameTable = HTMLRenderer.createGameItem(this.getStyle(game.table.style),{});
        gameTable.css({zIndex:0});
        this.gameContent.append(gameTable);


        //create players
        this.renderPlayers();

        var gameResourcen = HTMLRenderer.div({id:'ageResourcen',position:'absolute'});
     //   var gameResourcenHdr = HTMLRenderer.div({id:'ageResourcenHdr'}).append('<p>'+AgeSettings.resourcenTitle+'</p>');
     //   gameResourcen.append(gameResourcenHdr);
        gameResourcen.append(this.renderResourcen(game.ressourcen));
        this.gameContent.append(gameResourcen);

        gameWrapper.append(gameHeader);
        gameWrapper.append(this.gameContent);
        gameWrapper.append(gameFooter);
        contener.append(gameWrapper);
    	}catch(e){
    		Log('Renderer.start(): '+e,'e');
    		return;
    	}

    };
    this.getStyle = function(style){	
    	if(debug) Log('<b> renderer: setStyle angle:'+this.degree+' style.bgImage:'+style.bgImage+'</b>','d');
    	if(this.degree==0) return style;
    	var newPos = Perspective.rotateElement(this.degree, style);
    	style.left = newPos.left;
    	style.top = newPos.top;
    	style.width = newPos.width;
    	style.height = newPos.height;
    	style.angle = ''+this.degree;
    	return style;
    };
    this.createElement = function(style){

    	if(debug) Log('(depracted) create element imageName'+style.imageName+', width:'+style.width+', height:'+style.height+',imagesPath():'+style.getImagePath(true)+''
    			 +',bgColor():'+style.getBgColor()+',id:'+style.id+',_class:'+style._class+' pos:'+style.position+' pos:'+style.top+' pos:'+style.left,'d');
        var imagePath = style.getImagePath(true);
        if(imagePath==null) imagePath=undefined;
        return $(document.createElement('div')).css( {backgroundColor : style.getBgColor(),backgroundImage: imagePath,width: style.width, height:style.height,left: style.left,top:style.top,position:style.position}).attr( {id : style.id}).addClass(style._class);
    };
    this.renderResourcen = function(resourcen){
        if(debug) Log('Renderer: Resourcen length is '+resourcen.length,'d');
        var gameResourcenCnt = HTMLRenderer.div({id:'ageResourcenCnt'});
        for (var i = 0; i < resourcen.length;  i++) {
        	var grp = resourcen[i];
        	 if(grp.randomgenerator)  gameResourcenCnt.append(this.renderRandomGenerator(grp));        	
             else gameResourcenCnt.append(this.renderGroup(grp));
            
        }
        return gameResourcenCnt;
    };
    this.renderRandomGenerator=function(grp){
    	var grps_contener = HTMLRenderer.div({_class:'randomgenerator'});
    	try{
        var itm_style = new Style();
        itm_style.setStyle(grp.style); 
        
        itm_style.id=grp.getDomId();
    	var groupHTML = HTMLRenderer.createGameItem(this.getStyle(grp.style),{title:(grp.name)});
    	this.makeDraggable(groupHTML,grp);
    	grps_contener.append(groupHTML);
    	grp.HTMLElement =  groupHTML;
    	var items = grp.items;
    	for (var i = 0; i < items.length;  i++) {
    		var item = items[i];
    		itm_style.setStyle(item.style); 
    		itm_style.id = item.getDomId();
    		var itemHTML=HTMLRenderer.createGameItem(this.getStyle(itm_style),{});
    		itemHTML.css({display:'none'}); 		
    		grps_contener.append(itemHTML);
    		item.HTMLElement =  itemHTML;
    	}
    	}catch(e){ Log('Renderer.renderRandomGenerator(): '+e,'e'); } 	
    	return grps_contener;
    };
    this.renderGroup = function(grp){
        
    	
        var items = grp.items;
       if(debug) Log('Renderer.renderGroup() <b>grp.order:'+grp.order+', GameManager.local:'+GameManager.local+', items.length:'+items.length+' grp.visibility:'+grp.visibility+' items[0].visibility:'+items[0].visibility+'/<b>','d');
        if(!grp.order && GameManager.local){
               items=AgeUtil.randomShuffle(items);
               items=AgeUtil.randomShuffle(items);
        }     
        if(grp.stacked){
        	var grp_style = grp.style.copy();
        	grp_style._class=grp_style._class+' stacked';
        	if(items.length > 0){
        		var itm = grp.getFirstItem();
        		if(grp.visibility && itm.visibility) {
        			grp_style.imagesPath = itm.style.imagesPath;
        			grp_style.imageName = itm.style.imageName;
        			grp_style.bgImage = itm.style.bgImage;
        			grp_style.bgColor = itm.style.bgColor;
        		}
        	}
        	var groupDOM = HTMLRenderer.createGameItem(this.getStyle(grp_style),{title:(grp.name)});
        	this.makeDraggable(groupDOM,grp);
        	grp.HTMLElement=this.bindItemAction(groupDOM,grp);
        	grp.createActionBar();
        	return grp.HTMLElement; 	
        }else{
        	var grps_contener = HTMLRenderer.div({id:grp.style.id,_class:grp.style._class});
        	for (var j = 0; j < items.length;  j++) {
        		grps_contener.append(this.renderItem(grp,items[j]));
        	}
        	return grps_contener;
        }  
      
    };
    this.renderItem = function(grp,itm){
    	
        var itm_style = itm.style.copy();
        
        if(grp.style.width > 0) itm_style.width = grp.style.width;
        if(grp.style.height > 0) itm_style.height = grp.style.height;
        
        if(!(grp.visibility & itm.visibility)){
            itm_style.bgColor = grp.style.bgColor;
            itm_style.imageName = grp.style.imageName;
            itm_style.bgImage = grp.style.bgImage;
        }
        
       	var itemDOM = HTMLRenderer.createGameItem(this.getStyle(itm_style),{title:(grp.name)});
       	itemDOM.addClass(grp.getDomId());
        itm.HTMLElement=this.bindItemAction(this.makeDraggable(itemDOM,itm),itm);
        itm.createActionBar();      
    	return itm.HTMLElement;
    };
    this.bindItemAction=function(HTMLElement,itm){	
    	if(debug) Log('BINDE ACTION DBCLICK for element.id:'+itm.getDomId()+' HTMLElement.id:'+HTMLElement.attr('id'),'d');
    	return HTMLElement.bind('dblclick', function () {
    		itm.bindAction(); 
    		AgeItemLayer.layerSeqNr += 1;
    		itm.style.zIndex = AgeItemLayer.layerSeqNr;
    	});
    };
    this.makeDraggable = function(itemDOM,itemObject){
    	itemDOM.draggable({
    		containment :  this.gameContent,
    		scroll : false,
    		drag: function(event, ui) {
    		    var zIndex = GameManager.getNextLayerSeqNr(ui.helper.css('zIndex'));
    		    if(debug) Log('drag zIndex:'+zIndex+' typeof:'+(typeof zIndex),'d');
    		    itemDOM.css({zIndex:zIndex});
    		    itemObject.style.zIndex = zIndex;
    		    itemObject.style.left=ui.position.left;
    		    itemObject.style.top=ui.position.top;
    			AgeUpdater.setPosition(event,ui,itemObject);
    			if(itemObject.randomgenerator){
    				var image = itemDOM.children('img').first();
    				image.attr('src',itemObject.style.getImagePath(false));
    			}
              },
            stop: function(event, ui) {
            	  itemDOM.css({zIndex:ui.helper.css('zIndex')});
            	  if(itemObject.randomgenerator) AgeUpdater.randomizeGroup(itemObject);
              } 
            });
    	return itemDOM;
    };
    this.renderPlayers=function(){
    	 var players = game.getPlayers();
    	 if(debug) Log('Renderer.renderPlayers: players.length:'+players.length,'d');
    	 for (i = 0; i < players.length;  i++) {
             var player = players[i];
             var playerElement = this.createElement(this.getStyle(player.style));
             var name = player.name;
             if(name == null || name =='') name ="Player - "+(i+1);
             player.name = name;
            
             var playerHeader = HTMLRenderer.p({_class:'agePlayerHeader',content:name});
             playerElement.append(playerHeader);
             if(player.active) playerElement.addClass('activePlayer');
             else playerElement.addClass('unactivePlayer');
          
             player.HTMLElement=playerElement;
        	 this.gameContent.append(this.makeDroppable(player).HTMLElement);
         }
    };
    this.makeDroppable = function(player){
    	player.HTMLElement.droppable({
    		hoverClass: 'drophover',
    		over: function(event, ui) {
	    		var item = ui.draggable;
			 	var cur_player = GameManager.instance.players[GameManager.instance.player];
			 	if(cur_player.id == player.id) item.addClass('privateItem');
    	    },
    		drop: function( event, ui ) {
    	    	var item = ui.draggable;
    			GameManager.setElementOwner(item.attr('id'),player);
    	    },
    	    out: function(event, ui) {  
	    	    var item = ui.draggable;
	    	    var cur_player = GameManager.instance.players[GameManager.instance.player];
    		 	if(cur_player.id == player.id) item.removeClass('privateItem');
	        	GameManager.setElementOwner(item.attr('id'),null);
	        	var params = AgeUtil.extractDomId(item.attr('id'));
	        	if(params != null && player.active) AgeUpdater.sendUpdate('action=itemupdate&toPlayer='+item.owner+'&id='+params[0]);	  
    	    }	
    	});
    	return player;
    };
    this.setPlayers = function(){
    	this.init();
    	this.setTable();
        var players = game.getPlayers();
        Log('# berechne Spieler Position ','i');
        var SITES = 4;
        var C = 50;
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
                if(debug) Log('#  player = players[player_index++] player.style:'+player.style,'d');
                switch (i) {
                    //BOTTOM
                    case 1:
                        y =  table_style.height + table_style.top + C;
                        x = Math.round(table_style.left + table_style.width+(table_style.width / players_per_site)*((1-2*j)/2) - player.style.width/2);
                        player.angle = 0;
                        if(debug) Log(' # 1 player name:'+player.name+' x='+x+' y='+y,'d');
                     break;
                    //LEFT
                    case 2:
                        if(p_size==2){
                            y =  table_style.top - C - player.style.height;
                            x = Math.round(table_style.left + table_style.width+(table_style.width / players_per_site)*((1-2*j)/2)  - player.style.width/2);
                            player.angle = 180;
                        }
                        else{
                            x =  table_style.left - C-player.style.width;
                            y = Math.round(table_style.top +table_style.height+(table_style.height / players_per_site)*((1-2*j)/2) - player.style.height/2);
                            player.angle = 90;
                        }
                        if(debug) Log(' # 2 player name:'+player.name+' x='+x+' y='+y,'d');
                        break;
                    //TOP
                    case 3:
                        y =  table_style.top - C - player.style.height; //      interval = table_style.width / players_per_site;
                        x = Math.round(table_style.left + table_style.width+(table_style.width / players_per_site)*((1-2*j)/2)  - player.style.width/2);
                        player.angle = 180;
                        if(debug) Log(' # 3 player name:'+player.name+' x='+x+' y='+y,'d');
                       break;
                    //RIGHT
                    case 4:
                        x =  table_style.left + table_style.width + C;
                        y = Math.round(table_style.top+table_style.height+(table_style.height / players_per_site)*((1-2*j)/2) - player.style.height/2);
                        player.angle = 270; 
                        if(debug) Log(' # 4  player name:'+player.name+' x='+x+' y='+y,'d');
                        break;
                    default:
                        Log('RendererSwich.setPlayers SWITCH error','e');
                        break;
                }


                player.style.setPosition({left:x, top:y});
                if(player.id == -1) player.setDomId(player_index);
               
            }

        }
    };
     }

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
       return  Math.atan2(y, x);
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
      return this.getPoint(r, angle);
    },
    degreeToRad:function(degree){
    	return (degree * Math.PI)/180;
    },
    rotateElement:function(degree,style){
    	if(degree != 0){
	    	var leftTop = Perspective.shiftRightBottom({left:style.left,top:style.top},{width:style.width,height:style.height});
	    	var x = Perspective.getX(leftTop.left);
	   		var y = Perspective.getY(leftTop.top);
	   		var angle = Perspective.getAngle(x,y);
	   		var new_point = Perspective.rotatePoint([x,y],angle+this.degreeToRad(degree));
	   		var left = Perspective.getLeft(new_point[0]);
	   		var top = Perspective.getTop(new_point[1]);
	   		var dim = {width:style.width,height:style.height};
	   		if(degree == 90 | degree==270) dim = {width:style.height,height:style.width};
	   		var newleftTop = Perspective.shiftLeftTop({left:left,top:top},{width:dim.width,height:dim.height});
	   		return {left:newleftTop.left,top:newleftTop.top,width:dim.width,height:dim.height};  	
    	}else return style;
    },
    gamePosition:null

};


function Log(text,level) {
	var msg;
	if(level=='w')msg = '<p><span class="ageWarning"><span class="label">[W]:</span> '+text+'</span></p>';
	else if(level=='e') msg = '<p><span class="ageError"><span class="label">[E]:</span> '+text+'</span></p>';
	else if(level=='d') msg = '<p><span class="ageDebug"><span class="label">[D]:</span> '+text+'</span></p>';
	else  msg = '<p><span class="ageInfo"><span class="label">[I]:</span> '+text+'</span></p>';
	$('#ageConsole').prepend(msg);

}

function IConnector(onopen,onmessage,onclose,send,join){
    this.onopen =onopen;
    this.onmessage =onmessage;
    this.onclose = onclose;
    this.send =send;
    this.join = join;
    this.ajax=function(data){
	    AgeUtil.setConnectionStatus('active');
		$.ajax({type : "POST", url:GameManager.url+'?key='+GameManager.key, data:data,
			success: function(data, textStatus, xhr) {
		    if(data != ''){
		    	eval("var rec_data = "+data+";");
				GameManager.connector.onmessage(rec_data);
				var plyr = GameManager.instance.getPlayerOwner();
				var plyr_active = (plyr==null ? false : plyr.active);
				if(plyr_active) AgeUtil.setConnectionStatus('idle');
				else  AgeUtil.setConnectionStatus('disconnected');
		    }
		  },
		  error:function(xhr, textStatus, errorThrown) {
			     var status = textStatus; 
			     var errTwn = '';
			     if(status=='timeout') status='Timeout von '+AgeSettings.responseTimeout+' ms wurde überschritten.';
			     if(errorThrown) errTwn=', errorThrown: '+errorThrown;
				 Log('CometConnector.send(): '+status+errTwn,'e');
				 AgeUtil.setConnectionStatus('caution');
		  },
		  timeout:AgeSettings.responseTimeout
		});
    };
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
var AgeActionHandler={
	invokeAction:function(action,data){
		if(action=='init') this.actionInit(data);
		if(action=='j')	this.actionJoin(data);
		if(action=='pong') this.actionPong(data);
		if(action=='itemOwner') this.actionChangeOwner(data);
		if(action=='m') this.actionMove(data);
		if(action=='r') this.actionAnimateRandom(data);
		if(action=='randomize') this.actionShuffleItems(data);
		if(action=='updateItem') this.actionUpdateItem(data);
		if(action=='stack') this.actionStack(data);
		if(action=='playerName') this.actionChangePlayerName(data);
		if(action=='leave') this.actionLeave(data);
		if(action=='v') this.actionVisibility(data);
		if(action=='chat') this.actionChat(data);
		AgeUtil.setConnectionStatus('idle');
   },
   actionInit: function(data){
	   var status = data.status;
		if(status == 0){
			Log(data.msg,'e');
			GameManager.chat({n:'ageSystem',v:'<span class="ageSystem">*** keine Spieler zugewissen.</span>'});
		}else if(status==1){  
			try{
			if(data.game){
				Log('Comet.init loadGame:'+data.game,'i');
				GameManager.loadGame(data.game);
				
				Log('Comet.init setze curren Player:'+data.player.id+' winkel:'+data.player.angle,'i');
				GameManager.instance.setCurrentPlayer(data.player);
				
				Log('Comet.init rendere Game.','i');
				GameManager.renderGame();
			}
			GameManager.local=false;
			setInterval("AgeUpdater.listenForUpdate()", AgeSettings.updatePeriod);
		//	$(window).unload( function () { GameManager.leaveGame(); } );
			}catch(e){Log('CometConnector.init() - '+e,'e');}
		
		}
		else Log('Ich habe unbekannte Init antwort bekommen.!!! status:'+status,'e');
   },
   actionJoin: function(data){
	 if(data.player){
   		var player = data.player;
   		GameManager.joinGame(player);
   	 }
   },
   actionPong: function(data){
	   
   },
   actionChangeOwner: function(data){
	  var id=data.id;
	  var owner=data.owner;
	  var item = GameManager.instance.findItem(id);
	  if(item!=null){
   		item.owner = owner;
   		if(debug) Log('owner for item '+id+' changed:'+owner,'d');
   	 }
   },
   actionMove: function(data){
       try{
       	var item_id=data.i;
       	var pos=data.pos;
       	var player_id=data.player;
       	var cur_player = GameManager.instance.players[GameManager.instance.player];
        	if(player_id!=cur_player.id){
        		var cur_player = GameManager.instance.players[GameManager.instance.player];
       	//	var player = GameManager.instance.findPlayer(player_id);
               var angle = cur_player.angle;//-player.angle;
       		var style = Perspective.rotateElement(angle,{left:pos.x,top:pos.y,width:pos.w,height:pos.h});
       		var isItem=data.isItem;
       		var groupTyp=data.groupTyp;
       		if(!isItem && groupTyp=='random'){
       			var grp = GameManager.instance.findGroup(item_id);
       			if(grp != null && grp.randomgenerator) var bgImage = grp.style.getImagePath(false);
       		}  
       		 if(debug) Log('move data.zIndex:'+data.zIndex+' typeof:'+(typeof data.zIndex)+' pos.dom:'+pos.dom,'d');
     		   var zIndex = GameManager.getNextLayerSeqNr(data.zIndex);
       		
       		$('#'+pos.dom).css( {left : style.left,top : style.top,zIndex:zIndex});
       		if(bgImage){
       			var image = $('#'+pos.dom).children('img').first();
   				image.attr('src',bgImage);
       			
       		} 
       	}
   	   }catch(e){Log('CometConnector.onmessage() action:move msg:'+e,'e'); }
   },
   actionAnimateRandom: function(data){
	  var grp_id = data.grp;
   	  var itm_id = data.itm;
   	  var groups = GameManager.instance.ressourcen;
   	  for(var i = 0; i < groups.length; i++) {
			var grp = groups[i];
			if(grp.id == grp_id) grp.animateRandom(itm_id);
	  }
   },
   actionShuffleItems: function(data){
	   var grp_id = data.id;
       var playerName = data.playerName;
       var grp = GameManager.instance.findGroup(grp_id);
       if(grp != null){
       	$('#'+grp.getDomId()).remove();
       	var g = grp.loadFromJSON(data.grp);
       	var renderer = GameManager.instance.renderer; 
       	var renderedGrp = renderer.renderGroup(g);
       	renderer.gameContent.append(renderedGrp);
       	GameManager.chat({n:playerName,v:'*** hat die Gruppe '+g.name+' zuffälig geordnet.'});
       }else Log('Bekomme Randomize Update. Group mit id:'+grp_id+' wurde nicht gefunden.','w');
   	//{n:'randomize',v:{id:"+id+",playerName:'"+playerName+"',grp:"+grp.toJSON()+"}}";
   },
   actionUpdateItem: function(data){
	   var item = GameManager.instance.findItem(data.id);
	   	if(item != null){
	   		item.update(data);
	   	}else Log('Comet.action updateItem bekommen, aber keine Aktion augeführt.','w');
   },
   actionStack: function(data){
	   var grp_id = data.id;
       var playerName = data.playerName;
       var stacked = data.grp.stacked;
       var grp = GameManager.instance.findGroup(grp_id);
       if(debug) Log('++++++++++++++++ action stack grp.stacked:'+grp.stacked+' stacked:'+stacked,'d');
       if(grp != null && grp.stacked != stacked){
	       	$('#'+grp.getDomId()).remove();
	       	var g = grp.loadFromJSON(data.grp);
	       	var renderer = GameManager.instance.renderer; 
	       	var renderedGrp = renderer.renderGroup(g);
	       	renderer.gameContent.append(renderedGrp);
	       	if(g.stacked) GameManager.chat({n:playerName,v:'*** hat die Gruppe '+g.name+' gestapelt.'});
       }else Log('Stack Update bekommen, aber keine Aktion ausgeführt.','w');
   },
   actionChangePlayerName: function(data){
	   	var player = GameManager.instance.findPlayer(data.id);
   		if(player != null && data.name && data.name != ''){
   		GameManager.chat({n:player.name+':',v:'*** hat die Name auf <b>'+data.name+'</b> geändert.'});
   		player.setName(data.name);
   		
   	}  
   },
   actionLeave: function(data){
	   GameManager.removePlayer(data);
   },
   actionVisibility: function(data){
	   	var itm_id = data.itm;
		var player_name = data.player;
		var itm_dom = data.domid;
		var visibility = data.v;
		var isGroup = data.isGroup;
		var isPrivate = data.isPrivate;
		if(debug)Log(' update visibility','d');
		if(isGroup){
			var group = GameManager.instance.findGroup(itm_id);
			if(group != null){
				$('#'+group.getDomId()).remove();
				var g = group.loadFromJSON(data.grp);
				var renderer = GameManager.instance.renderer; 
	        	var renderedGrp = renderer.renderGroup(g);
	        	renderer.gameContent.append(renderedGrp);
	        	GameManager.chat({n:player_name,v:'*** hat Sichtbarkeit der Gruppe '+g.name+' geändert.'});
			}
		}else{
		var groups = GameManager.instance.ressourcen;
		for ( var i = 0; i < groups.length; i++) {
			var grp = groups[i];			
			for ( var j = 0; j < grp.items.length; j++) {
				var itm  = grp.items[j];
				if(itm.id==itm_id){
					if(visibility){
						itm.style.bgColor = data.bgColor;
						itm.style.imageName = data.img;
					}
					var game = GameManager.instance;
					itm.style.angle = game.players[game.player].angle;
					itm.setVisibility(visibility);
				 	if(!isPrivate) GameManager.chat({n:player_name,v:' hat eine Element von eine Gruppe <strong>'+grp.name+'</strong> umgedreht.'});
		        	
				}
			}
		}
	} 
   },
   actionChat:function(data){
	   GameManager.chat({n:data.from,v:data.msg});
   }
};
function LongPollingConnector(){
	this.base = IConnector;
	   this.base(function(){
	        alert("onopen");
	   },function(msg){
		    var action = msg.n;
	        var data = msg.v;
	        if(action && data) AgeActionHandler.invokeAction(action,data);
	        else Log('CometConnector.onMessage - bekome unbekannte Daten action: '+action+', data:'+data,'w');
	   },function(key){
	        alert("onclose"+key);
	   },function(data){
		   this.ajax(data);
	   },function(url,query){
			 if(debug) Log(' Erstelle eine IFRAME...','d');
			 AgeUtil.setConnectionStatus('active');
			 $('body').append('<iframe name="hidden" src="' +url+'?'+query+'" id="comet-frame" style="display: none;"></iframe>');
	   });
}
function HttpStreamingConnector(){
	this.base = IConnector;
	   this.base(function(){
	        alert("onopen");
	   },function(msg){
		    var action = msg.n;
	        var data = msg.v;
	        if(action && data) AgeActionHandler.invokeAction(action,data);
	        else Log('CometConnector.onMessage - bekome unbekannte Daten action: '+action+', data:'+data,'w');
	   },function(key){
	        alert("onclose"+key);
	   },function(data){
		   this.ajax(data);
	   },function(url,query){
			 if(debug) Log(' Erstelle eine IFRAME...','d');
			 AgeUtil.setConnectionStatus('active');
			 $('body').append('<iframe name="hidden" src="' +url+'?'+query+'" id="comet-frame" style="display: none;"></iframe>');
	   });
}
/*
function CometConnector(){
   this.base = IConnector;
   this.base(function(){
        alert("onopen");
   },function(msg){
	    var action = msg.n;
        var data = msg.v;
        if(action && data) AgeActionHandler.invokeAction(action,data);
        else Log('CometConnector.onMessage - bekome unbekannte Daten action: '+action+', data:'+data,'w');
   },function(key){
        alert("onclose"+key);
   },function(data){
	   this.ajax(data);
   },function(url,query){
		 if(debug) Log(' Erstelle eine IFRAME...','d');
		 AgeUtil.setConnectionStatus('active');
		 $('body').append('<iframe name="hidden" src="' +url+'?'+query+'" id="comet-frame" style="display: none;"></iframe>');
  });

}
*/
WebSocketConnector.prototype = new IConnector;
//CometConnector.prototype = new IConnector;
LongPollingConnector.prototype = new IConnector;
HttpStreamingConnector.prototype = new IConnector;
var AgeItemLayer = {
		id:0,
		layerSeqNr:100
};
var GameManager = {
	    key:null,
	    contener: null,
	    connector:null,
	    instance:null,
	    joined:false,
	    url:null,
	    local:true,
	    setLocal:function(local){
			this.local=local;
        },
	    game: function(gameparams){
	        if(this.instance==null){
	        	 Log('The Game instance is NULL.','e');

	        }
	        return this.instance;
	    },
	    table:function(){
	        return this.game().table;
	    },
	    getNextLayerSeqNr:function(_seq,id){
	    	var seq = 1*_seq;
	    	if(isNaN(seq)) seq=AgeItemLayer.layerSeqNr;
            if(AgeItemLayer.id != id || AgeItemLayer.layerSeqNr != seq){
            	AgeItemLayer.id = id;
            	if(AgeItemLayer.layerSeqNr < seq){
            		AgeItemLayer.layerSeqNr = seq;
            		if(debug) Log('getNextLayerSeqNr if(AgeItemLayer.layerSeqNr < seq):'+AgeItemLayer.layerSeqNr,'d');
    	    	}else{
    	    		AgeItemLayer.layerSeqNr += 1;
    	    		if(debug) Log('getNextLayerSeqNr else:'+AgeItemLayer.layerSeqNr,'d');
    	    	} 
            }
            return AgeItemLayer.layerSeqNr;
	    },
	    chat:function(data){
	    	var text = $('#'+AgeSettings.chatContenerMsgId);
        	text.prepend('<p><span class="label">'+data.n+':</span> '+data.v+'</p>');  	
	    },
	    setElementOwner:function(dom_id,player){
	    	var e_split = dom_id.split("-");
	    	if(e_split.length==2 && e_split[0]==AgeSettings.itemDomIdPrefix){
	    		var id = 1*e_split[1];
	    		var item = GameManager.instance.findItem(id);
	    		if(item != null){
	    			if(player == null) item.owner=-1;
		    		else item.owner=player.id;
		    	//	Log('Player.setOwner('+player+') elementId:'+id,'i');
		    		AgeUpdater.sendUpdate('action=itemowner&owner='+item.owner+'&id='+item.id);
	    		}
	    		
	    	}
	    },
	    removePlayer:function(player_id){
	    	var player = this.instance.findPlayer(player_id);
	    	if(player != null){
				player.HTMLElement.removeClass('activePlayer');
				player.HTMLElement.removeClass('playerOwner');
				player.HTMLElement.addClass('unactivePlayer');
			//	player.name = _player.name;
				player.active=false;
				this.chat({n:player.name,v:'<span class="ageSystem">*** verließ das Spiel.</span>'});
			//	Log('Player <strong>'+player.name+'</strong> mit ID:'+player.id+' hat das Spiel verlassen.','i');
	    	}else Log('GameManager.removePlayer(): Player mit id:'+player_id+' wurde nicht gefunden.','w');
	    },
	    joinGame:function(_player){
	    	if(debug) Log('GameManagar.join game player:'+_player.id,'d');
	    	try{
	    	var players=this.instance.players;
	    	for ( var i = 0; i < players.length; i++) {
				var player = players[i];
				if(player.id == _player.id){	
					if(debug) Log('player.id == _player.id:'+_player.id,'d');
					player.HTMLElement.removeClass('unactivePlayer');
					player.HTMLElement.addClass('activePlayer');
					var owner_id = this.instance.getPlayerOwner()==null? -1 : this.instance.getPlayerOwner().id;
					if(player.id == owner_id){
						player.HTMLElement.addClass('playerOwner');
						player.addActionInPlaceEditor();
						this.joined=true;
					}
					player.name = _player.name;
					player.active=true;
					this.chat({n:player.name,v:'<span class="ageSystem">*** has joined.</span>'});
					Log('Player <strong>'+player.name+'</strong> mit ID:'+player.id+' has joined.','i');
				}
			}
	    	}catch(e){Log('GameManager.joinGame() '+e,'e');}
	    },
	    leaveGame:function(){
	    	try{
	    		if(debug) Log('<strong>GameManager.leaveGame()</strong>','d');
		    	var cur_player = GameManager.instance.players[GameManager.instance.player];
		    	cur_player.HTMLElement.removeClass('activePlayer');
		    	cur_player.HTMLElement.removeClass('playerOwner');
		    	cur_player.HTMLElement.addClass('unactivePlayer');	    	
		    	AgeUpdater.sendUpdate('action=leave&player='+cur_player.id);
		    	this.joined=false;
		    	cur_player.active = false;
		    //	alert('leaveGame');
		    	
	    	}catch(e){Log('GameManager.leaveGame() - '+e,'e');}
	    //	return false;
	    },
	    init:function(data){
	    	Log('Setze init Parameters...','i');
	    	if(data.key && data.url && data.contener){
	    		this.key = data.key;
	    		this.url = data.url;
	    		this.contener = data.contener;
	    		Log('Game contenter is :'+this.contener,'i');
	    		Log('Erstelle eine Connector...','i');
	 	        this.connector = new HttpStreamingConnector();
	 	        Log('Verbinde sich mit den Server...','i');
	 	        var query='key='+this.key+'&action=join';
//	 	        if(data.game){
//	 	        	this.loadGame(data.game);
//	 	        	this.renderGame();
//	 	        }
	 	      //  if(this.instance==null) query += '&loadGame=true'; 	        
		        this.connector.join(this.url,query);
		        Log('Url: '+this.url+'?'+query,'i');
	    		
	    	}else Log('GameManager.init() key, url oder contener ist nicht defieniert.','e');

	    },
	    loadGame:function(gameparams){
	    	var game = new Game();
	    	Log('loadGame '+gameparams,'i');
	    	this.instance = game.loadFromJSON(gameparams);
	    },
	    renderGame:function(){
	    	if(debug) Log('GameManager.renderGame this.contener:'+this.contener,'d');
	    	this.instance.render($(this.contener));
	    }
	   
};
AgeUpdater={
    update:{r:'',c:[],l:''},
    lastUpdateTime:null,
    setPosition:function(event, ui,itm){
    	if(debug) Log('setPos GameManager.local?'+GameManager.local,'d');
        if(!GameManager.local){
        	try{		
        		var cur_player = GameManager.instance.players[GameManager.instance.player];
        		var style = Perspective.rotateElement(-cur_player.angle,{left:ui.position.left,top:ui.position.top,width:itm.style.width,height:itm.style.height});
                var dom = itm.getDomId();
	            var groupTyp='norm';
	            if(itm.randomgenerator) groupTyp='random';
	            if(itm.isItem) var isItm = 'true';
	            else isItm = 'false';
	            var _update = "action=m&zindex="+itm.style.zIndex+"&isItm="+isItm+"&groupTyp="+groupTyp+"&p=" + cur_player.id + "&i="+itm.id+"&dom="+dom+"&x=" + Math.round(style.left) + "&y=" + Math.round(style.top)+"&h="+Math.round(style.height)+"&w="+Math.round(style.width); 
	            this.update.r = _update;
        	}catch(e){Log('AgeUpdater.setPosition() - '+e,'e');}
        }
        else{
            itm.setLeft(ui.position.left);
            itm.setTop(ui.position.top); 
            itm.setZIndex(itm.style.zIndex);
            return;
        }
        
    },
    randomizeGroup:function(grp){
    	if(GameManager.instance){
	    	var cur_player = GameManager.instance.players[GameManager.instance.player];
	    	this.sendUpdate('action=random&grp='+grp.id+'&p='+cur_player.name);
    	}
    },
    sendChatMessage:function(){
    	try{
    	
    	var input_text = $('#'+AgeSettings.chatContenerInputId).children('input').first();
    	var msg = $.trim(input_text.val());
    	if(msg!=null && msg!='' && GameManager.instance.player >= 0){
	    	var cur_player = GameManager.instance.players[GameManager.instance.player];
	    	this.sendUpdate('action=chat&msg='+msg+'&from='+cur_player.name);
	    	input_text.attr('value','');  
    	}
    	return;
    	}catch(e){Log('AgeUpdater.sendChatMessage() - '+e,'e');}
    },
    sendUpdate:function(updateMsg){
        if(!GameManager.local){
            
            var cur_player = GameManager.instance.players[GameManager.instance.player];
       //     if(debug) Log('update : '+updateMsg+' gesendet?'+cur_player.active,'d');
            if(cur_player.active) GameManager.connector.send(updateMsg);
        }
        else{
            Log('AgeUpdater.sendUpdate(): Game ist Local.','w');
        }
        return;
    },
    listenForUpdate:function(){
    	var _date = new Date();
    	if(this.lastUpdateTime==null)this.lastUpdateTime=_date.getTime();
        if(this.update!=''){
        	if(this.update.r != this.update.l){
        		this.lastUpdateTime=_date.getTime();
        		this.update.l = (this.update.r).substring(0,this.update.r.length);
        		this.sendUpdate(this.update.r);
        	} 	
        	var diff = _date.getTime()-this.lastUpdateTime;
        	if(diff > AgeSettings.pingpongPeriod){
        		if(GameManager.instance.player >=0){
            		var cur_player = GameManager.instance.players[GameManager.instance.player];
            		
            		this.sendUpdate('action=ping&from='+cur_player.id);
            		
            	} 
        		if(debug) Log('send PING diff:'+diff+' GameManager.instance.player:'+GameManager.instance.player+' this.lastUpdateTime:'+this.lastUpdateTime,'d');
        		this.lastUpdateTime=_date.getTime();
        	}
        }    
    },
    ajaxFileUpload:function(p){
    	if(debug) Log('AgeUpdater: ajaxFileUpload','d');
    	var id = 'ajaxFileUpload';
    	var d = $('#'+id);
    	if(d != null) d.remove();
    	d = HTMLRenderer.div({id:id}); //,enctype:'multipart/form-data'
    	var div = $(document.createElement('div')).css( {display : 'none'}).attr( {id : id});
    	var form = $(document.createElement('form')).css( {display : 'none'}).attr( {action:AgeSettings.serverContext+'game/xhr.htm',method:'POST',enctype:'multipart/form-data'});
    	var input = p.input.clone();
    	input.attr({name:'tmp.image'});
    	form.append(input);
    	form.append('<input type="submit" value="submit" />');
    	div.append(form);
    	$('body').append(div);
    	form.ajaxForm( 			
    			{ dataType: null, 
    				success:function(data){
    				var msg = data.split('===');
   		   	  
   	   				if(debug) Log('AgeUpdater.ajaxFileUpload: bind:<b>'+p.bind+'(\''+msg[1]+'\',true)</b>','d');
    				eval(''+p.bind+'(\''+msg[1]+'\',true)');
	
    			}}
    			
    			/*
    			function(data) { 
 
    				if(debug) Log('AgeUpdater.ajaxFileUpload: bind:'+p.bind+'(\''+data+'\')','d');
    				eval(''+p.bind+'(\''+data+'\')');
                }*/
    	); //{success:eval(p.bind)}
    	form.submit();

    }
};
AgeUtil={
  max: function(a,b){
        var max = a;
        if(b>a) max = b;
        return max;
  },
  extractDomId:function(dom_id){
	  var e_split = dom_id.split("-");
  	  if(e_split.length==2){
  		return [1*e_split[1],e_split[0]];
  	  }
  	  return null;
  },
  randomShuffle: function(array){
        var i = array.length;
        if ( i == 0 ) return false;
        while ( --i ) {
            var j = Math.floor( Math.random() * ( i + 1 ) );
            var tempi = array[i];
            var tempj = array[j];
            array[i] = tempj;
            array[j] = tempi;
        }
        return array;
    },
    isNull:function(e){
    	if(e==null || e == '' || e=='null' || e == undefined) return true;
    	return false;
    },
    setConnectionStatus:function(s){
    	var status_img = AgeSettings.imagePath;
    	if(s=='idle') status_img += 'connect_idle.gif';
    	else if(s=='active') status_img += 'connect_active.gif';
    	else if(s=='caution')status_img += 'connect_caution.gif';
    	else if(s=='disconnected')status_img += 'connect_disconnected.gif';
    	else status_img += 'connect_idle.gif';
    	$('#'+AgeSettings.ageConnectionStatusId).html('<img  src="'+status_img+'" />');
    }
};



var DEFAULTS={
    style:{height:90, width:72,bgColor:'transparent',_class:'',left:0,top:0,id:'',position:'absolute'},
    item:{name:AgeSettings.defaultItemName,count:1, visibility:true},
    group:{name:AgeSettings.defaultGroupName, visibility:true,stacked:false, order:true, randomgenerator:false},
    game:{name:AgeSettings.defaultGameName,_public:true}
};









/*    #######################   GAME CREATOR #################################*/


var GameCreatorManager={
    domid:null,
    renderedGameCreator:null,
    renderedViewResults:null,
    renderedFormContent:null,
    renderedFooterBarWiz1:null,
    renderedFooterBarWiz2:null,
    form:null,
    key:null,
    editKey:'',
    actions: new Array(),
    gameCreator:null,
    _next:null,
    _back:null,
    _save:null,
    templates:new Array(),
    setTemplates: function(tmpls){
	  this.templates=tmpls;
    },
    update: function(){
       if(mColorPicker != null) mColorPicker.main();
       else Log('GameCreatorManager:update Color Picker ist nicht Verfügbar !!!','e');
       
       if(debug) Log('GameCreatorManager.update()','d');
       this.bindActions();
    },
    bind:function(p){
    	if(debug) Log('GameCreatorManager. bind: p.domid'+p.domid,'d');
        $('#'+p.domid).bind('colorpicked', function () {
            (p.object).setBgColor($(this).val());
            if(debug) Log('Color picked: '+$(this).val(),'d');
        });
        return
    },
    bindActions:function(){
        
       if(mColorPicker != null){
           for (var i = 0; i < this.actions.length; i++) {
            var p = this.actions[i];
            if(debug) Log('GameCreatorManager: binde Action colorpicked: '+p.domid,'d');
             this.bind(p);
              p = null;
        }
       }
       else Log('GameCreatorManager:bindActions Cann not bind a action to colorPicker, becouse is not avaible','e');
       
       this.actions = new Array();
       
    },
    addItem:function(grp){
	  grp.newItem();         
    },
    addGroup: function(thisRes){
    	thisRes.newGroup(true, new Group());
    	this.update();
    },
    closeGroup: function(grp){
        GameCreatorManager.gameCreator.resourcenCreator.removeGroup(grp);
    //	grp.groupWrapper.remove();
    },
    displayWizard:function(id){
    	if(id==1){
    	   this._next.css("display","inline");
    	   this.renderedGameCreator.css("display","block");
    	   if(this.renderedViewResults != null) this.renderedViewResults.css("display","none");
            this._back.css("display","none");
            this._save.css("display","none");
    	}else{
    	    this._next.css("display","none");
    	    this.renderedGameCreator.css("display","none");
            if(this.renderedViewResults != null) this.renderedViewResults.remove();
            this.renderedViewResults = this.createViewResults();
            this.renderedViewResults.css("display","block");
            this._back.css("display","inline");
            this._save.css("display","inline");
    	}
    },

    save:function(){
    	this.gameCreator.gameSetting.setPlayers();
    	this.form.submit();
    },
    showConfirmDialog:function(p){
        $("#dialog-confirm").attr({title:p.title}).dialog({resizable: false,height:140,modal: true,buttons: {
		Ja: function() {
                     //   eval(''+p.action+'()');
			$(this).dialog('close');
		},
		Nein: function() {
			$(this).dialog('close');

		}}});
    },
    createViewResults:function(){
    	var viewResults=HTMLRenderer.div({id:'GameViewResultsWrapper',_class:'ResultsWrapper'}).append('game rendering....');
        this.renderedFormContent.append(viewResults);
        viewResults.empty();
        var game = GameCreatorManager.gameCreator.gameSetting.game;
        game.setRessourcen(GameCreatorManager.gameCreator.resourcenCreator.getResourcen());
        game.player=-1;
        game.players=[];
        if(debug) Log('createViewResults <b>game.getRenderer().setPlayers()</b>','d');
        game.getRenderer().setPlayers();
        game.render('#GameViewResultsWrapper');
    	return viewResults;
    },
    create:function(domid,game){
       this.domid = domid;
       this.gameCreator = new GameCreator(game);
       this.renderedGameCreator = this.gameCreator.render();
       var gameCreatorManagerWrapper = this.createGameCreatorManagerWrapper(this.renderedGameCreator);
       $(domid).append(gameCreatorManagerWrapper);
       this.update();

    },
    loadTemplate: function(tmplt_id){
    	try{		
	    	var template = this.templates[tmplt_id];
	    	var grp = new Group();
	    	grp.loadFromJSON(template.value);
	    	grp.templateId=template.id;
	    	if(debug)Log('Lade templates template.value:'+template.value,'d');
	    	GameCreatorManager.gameCreator.resourcenCreator.newGroup(false, grp);
	    	this.update();
    	}catch(e){Log('GameCreatorManager.loadTemplate(): '+e,'e');}
    },
    edit:function(domid,gameManager,editKey){
    	this.editKey=editKey;
    	this.key = gameManager.key;
    	this.create(domid,gameManager.instance);
    },
    createGameCreatorManagerWrapper: function(formContentValues){
        var wrapperDiv = HTMLRenderer.div({id:'GameCreatorManagerWrapper',_class:'Wrapper'});

        this.renderedFormContent = HTMLRenderer.div({});
        this.renderedFormContent.append(formContentValues);
        var form = HTMLRenderer.form({id:'GameCreatorForm',formContent:this.renderedFormContent,enctype:'multipart/form-data'});


        var renderedFooterBar = HTMLRenderer.p({_class:'creatorFooter'});

        this._next = HTMLRenderer.button({content:'next',_class:'button'});
        this._back = HTMLRenderer.button({content:'back',_class:'button'});
        this._save = HTMLRenderer.button({content:'save',_class:'button'});

        this._back.css("display","none");
        this._save.css("display","none");

        this._next.bind('click', function() {GameCreatorManager.displayWizard(2);});
        this._back.bind('click', function() {GameCreatorManager.displayWizard(1);});
        this._save.bind('click', function() {GameCreatorManager.save();});

        renderedFooterBar.append(this._next);
        renderedFooterBar.append(this._back);
        renderedFooterBar.append(this._save);
        form.append(HTMLRenderer.inputHidden({name:'key',value:''+this.key}));
        form.append(HTMLRenderer.inputHidden({name:'editKey',value:''+this.editKey}));
        form.append(renderedFooterBar);
        this.form = form;
        return wrapperDiv.append(form);
    }
};
var AgeTemplates={
	contener:null,
	bind:function(e,i){
		e.bind('click', function() {
			GameCreatorManager.loadTemplate(i);
			if(AgeTemplates.contener!=null){
				AgeTemplates.contener.css({display:'none'});	
			} 			
		});
	return;
    },
    create:function(templates){
    	_templates = templates || GameCreatorManager.templates;
    	if(_templates.length>0){
    		var ul = HTMLRenderer.ul({_class:'ageTemplatesList'});
        	$.each(_templates, function(index, value) { 
        		var li = HTMLRenderer.li({});
        		li.append(value.name);
        		ul.append(li);
        		AgeTemplates.bind(li,index);
        	});
        	if(this.contener!=null) this.contener.append(ul);
    	}else Log('Es stehen keine Templates zu Verfügung.','w');
    		
    
    }
};

function GameCreator(game) {
	this.gameSetting=null;
	this.resourcenCreator=null;
	this.footerBar = '';//new FooterBar();
	this.createGameWrapper=function() {
		return HTMLRenderer.div({id:'GameCreatorWrapper',_class:'CreatorWrapper'});
	};
	this.getResourcenCreator = function(){
		return  this.resourcenCreator;
	};
	this.render = function() {
		this.gameSetting = new GameSetting(game);
		var creatorWrapper = this.createGameWrapper();
		var gameSetting = this.gameSetting.render();
		this.resourcenCreator = new ResourcenCreator(game);
		var resourcenArea = this.resourcenCreator.render();
		var footerBar = this.footerBar;//.render();
		creatorWrapper.append(gameSetting);
		creatorWrapper.append(resourcenArea);
		creatorWrapper.append(footerBar);
		return creatorWrapper;
	};
}


function GameSetting(game) {

	this.game = game;
	this.gameSettingview = null;
	this.gameSetting = HTMLRenderer.div( {id : 'GameSetting',_class : ''});
	this.playersInputHiddenElements=HTMLRenderer.div({});
	this.bgColor=HTMLRenderer.inputHidden({name:'table.style.bgColor',value:this.game.table.style.bgColor});
	this.createGameSettingWrapper = function() {
		var sw = HTMLRenderer.div({id:'GameSettingWrapper',_class:'Wrapper'});
		sw.append('<h2>'+AgeSettings.gameSettingTitle+'</h2>');
		return sw;
	};

	this.getNameComponent = function(){
		return this.getInputTextComponent({id:'GameSettingName',_class:'GameSettingInput',label:'Speilname:',FOR:'GameSettingNameInput',
                    bind:'GameCreatorManager.gameCreator.gameSetting.setGameName(this.value)',name : 'name',inputId:'GameSettingNameInput',inputValue: this.game.name,size : '15'});
	};

	this.setGameName = function(name){
                if(debug) Log('GameSetting.setGameName: '+name,'d');
		this.game.name = name;
	};

    this.getPlayersSizeComponent = function(){
            return this.getInputTextComponent({id:'GameSettingPlayers',_class:'GameSettingInput',label:'Spieler Anzahl:',FOR:'GameSettingPlayersInput',
                    bind:'GameCreatorManager.gameCreator.gameSetting.setGamePlayersSize(this.value)',name : 'playersSize',inputId:'GameSettingPlayersInput',inputValue: this.game.playersSize,size : '15'});
        };

    this.setGamePlayersSize = function(playerssize){
                if(debug) Log('GameSetting.setGamePlayersSize('+playerssize+')','d');
    this.game.playersSize = parseInt(playerssize);
	};
    this.setPlayers=function(){
    	this.playersInputHiddenElements.empty();
    	var players = this.game.players;
    	for ( var i = 0; i < players.length; i++) {
			var player = players[i];
			this.playersInputHiddenElements.append(HTMLRenderer.inputHidden({name:'players['+i+'].angle',value:player.angle}));
			this.playersInputHiddenElements.append(HTMLRenderer.inputHidden({name:'players['+i+'].name',value:player.name}));
			this.playersInputHiddenElements.append(HTMLRenderer.inputHidden({name:'players['+i+'].style.left',value:player.style.left}));
			this.playersInputHiddenElements.append(HTMLRenderer.inputHidden({name:'players['+i+'].style.top',value:player.style.top}));
		}
    	
    };
    this.getWidthComponent = function(){
            	return this.getInputTextComponent({id:'GameSettingWidth',inputValue:this.game.table.style.width,_class:'GameSettingInput',label:'Breite:',FOR:'GameSettingWidthInput',
                    bind:'GameCreatorManager.gameCreator.gameSetting.setGameWidth(this.value)',name : 'table.style.width',inputId:'GameSettingWidthInput',inputValue: this.game.table.style.width,size : '15'});

        };

    this.setGameWidth = function(width){
    	this.game.table.style.width = parseInt(width);
		if(debug) Log('this.game.table.style.width:'+this.game.table.style.width,'d');
	};

    this.getHeightComponent = function(){
            	return this.getInputTextComponent({id:'GameSettingHeigth',inputValue:this.game.table.style.height,_class:'GameSettingInput',label:'Höhe:',FOR:'GameSettingWidthInput',
                    bind:'GameCreatorManager.gameCreator.gameSetting.setGameHeight(this.value)',name : 'table.style.height',inputId:'GGameSettingWidthInput',inputValue: this.game.table.style.height,size : '15'});

        };

    this.setGameHeight = function(height){
    	this.game.table.style.height = parseInt(height);
        if(debug) Log('game.table.style.height:'+this.game.table.style.height,'d');
	};

     this.getBgColorComponent = function(){
            var inputColor = HTMLRenderer.inputColorField( {name : 'table.style.bgColorComponent',id:'GameSettingBgColorInput',value : this.game.table.style.bgColor,_class:'color',style:'height:20px;width:20px;'});
            //GameCreatorManager.gameCreator.gameSetting.setGameBgColor
	    var inputColorLabel = HTMLRenderer.label({FOR:'GameSettingBgColorInput',label:'Background Color: '});
            GameCreatorManager.actions.push({action:'',object:GameCreatorManager.gameCreator.gameSetting,domid:'GameSettingBgColorInput'});
            return HTMLRenderer.p( {id : 'GameSettingColor',_class : 'GameSettingInput'}).append(inputColorLabel).append(inputColor);
        };
    
    this.setBgColor = function(bgcolor){
		this.game.table.style.bgColor = bgcolor;
		this.bgColor.attr('value',bgcolor);
	};

	this.getInputTextComponent = function(p){
		var pn = HTMLRenderer.p( {id : p.id,_class :p._class,content:HTMLRenderer.label({label : p.label,FOR:p.FOR})});
		pn.append(HTMLRenderer.inputText({bind:p.bind,name : p.name,id:p.inputId,value : p.inputValue,size : p.size}));
		return pn;
	};
    this.setBGImage=function(fileName,tmp){
    //	var _tmp = tmp & true;
    	if(fileName){
    	this.gameSettingview.empty();
   // 	if($.browser.mozilla || $.browser.msie){
  //  		this.gameSettingview.append(HTMLRenderer.img({src:fileName}));
//		}else{
    	
    	    var image_path = AgeSettings.imageTmpPath;
    	    if(GameManager.key != null && !tmp) image_path = AgeSettings.userImagePath+GameManager.key+'/';
			var image = image_path+'0_'+fileName;
	    	if(debug) Log('GameSetting.setBGImage:'+fileName+' tmp? '+tmp+' GameManager.key: '+GameManager.key+' AgeSettings.imageTmpPath+fileName:'+image_path,'d');
	    	
	    	this.game.table.style.imageName = fileName;
	    	this.game.table.style.imagesPath = image_path;
	    	
	    	this.game.table.style.bgImage = image;
	    	this.gameSettingview.append('<img src="'+image+'" style="width:170px;"/>');//css({backgroundImage:'url("'+image_path+'")'});
    	}
//		}
    	
    };
	this.render = function() {
		var settingWrapper = this.createGameSettingWrapper();

		this.gameSetting.append(this.getNameComponent());
		this.gameSetting.append(this.getPlayersSizeComponent());
		this.gameSetting.append(this.getWidthComponent());
		this.gameSetting.append(this.getHeightComponent());
		this.gameSetting.append(this.getBgColorComponent());
		this.gameSetting.append(this.playersInputHiddenElements);
		this.gameSetting.append(this.bgColor);
		var inputFile = HTMLRenderer.inputImageField({bind:'GameCreatorManager.gameCreator.gameSetting.setBGImage',name:'table.style.bgImage',id:'GameSettingImageInput',size:'10'});
		var inputFileLabel = HTMLRenderer.label({FOR:'GameSettingImageInput',label:'Background Image: '});
		this.gameSetting.append(HTMLRenderer.p( {id : 'GameSettingImage',_class : 'GameSettingInput'}).append(inputFileLabel).append(inputFile));

		this.gameSettingview = HTMLRenderer.div({id:'GameSettingView',_class : ''});
        if(GameManager.key != null) this.setBGImage(this.game.table.style.imageName,false);
		settingWrapper.append(this.gameSetting);
		settingWrapper.append(this.gameSettingview );
		settingWrapper.append(HTMLRenderer.clear);
		
		return settingWrapper;
	};
}
function ResourcenCreator(game) {
	this.resourcenWrapper=null;
	this.resourcenFotoer = null;
	this.resourcenContent = null;
	this.groupList = null;
	this.hiddenGroupsSizeComponent=null;
	this.groups = null;
    this.groupIdSec=0;
    this.removeGroup=function(grp){
    	for (var i = 0; i < this.groups.length; i++) {
    		if(grp.id == this.groups[i].id){
    			Log('Lösche Gruppe mit DOMID:'+this.groups[i].groupWrapper.attr('id'),'i');
                this.groups[i].groupWrapper.remove();
                this.groups[i].id = null;
             //       this.hiddenGroupsSizeComponent.value =  parseInt(this.hiddenGroupsSizeComponent.value)-1;
             //       this.groups.splice(i, 1);
             //       break;
            }
       }  
    };
	this.newGroup=function(action,grp) {
		var _action = action || false;
		var _grp = grp || null;
		var idSec = 'new-'+this.groupIdSec;
		if(_grp != null) idSec=_grp.getDomId()==null ? idSec : _grp.getDomId();
		this.groupIdSec++;
		var newGroup = new GroupCreator(idSec,this.groups.length);
        newGroup.setGroup(_grp);
		this.groups.push(newGroup);
		if(_action) GameCreatorManager.actions.push({action:'',object:newGroup,domid:newGroup.getBgColorComponentId()});
		this.groupList.append(newGroup.render());
		this.hiddenGroupsSizeComponent.attr({value:''+this.groups.length});
	};
	this.render=function() {
		if(this.hiddenGroupsSizeComponent == null) this.hiddenGroupsSizeComponent =HTMLRenderer.inputHidden({name:'resourcenSize',value:'0'});
		if(this.groupList == null) this.groupList = this.createGroupList();
		if(this.groups == null){
			this.groups = new Array();
			this.setResourcen(game.ressourcen,true);
         }
		
		if(this.resourcenWrapper == null) this.resourcenWrapper = this.createResourcenWrapper();
		if(this.resourcenContent == null) this.resourcenContent = this.createResourcenContent();
		if(this.resourcenFotoer == null) this.resourcenFotoer = this.createResourcenFooter();
		this.resourcenContent.append(this.groupList);
		this.resourcenContent.append(HTMLRenderer.clear());
		this.resourcenWrapper.append(this.resourcenContent);
		this.resourcenWrapper.append(this.hiddenGroupsSizeComponent);
		this.resourcenWrapper.append(this.resourcenFotoer);
		return this.resourcenWrapper;
	};
	this.setResourcen = function(ressourcen,action){
		if(ressourcen.length==0)this.newGroup(action,null);
		for ( var i = 0; i < ressourcen.length; i++) {
			this.newGroup(action,ressourcen[i]);
		}
	};
	this.getResourcen = function(){
		var groups = new Array();
		if(debug) Log('ResourcenCreator.getResourcen - this.groups.length:'+this.groups.length,'d');
		for ( var i = 0; i < this.groups.length; i++) {
			var grp = this.groups[i];		
			if(grp.id != null){
				grp.group.items = grp.getItems();
                 if(debug) Log('--ResourcenCreator.getResourcen grp.group.items.length:'+(grp.group.items.length)+' - groups.push(grp.group).','d');
				groups.push(grp.group);
			}
		}
		return groups;
	};
	this.createGroupList = function(){
		return HTMLRenderer.div({});
	};
	this.createResourcenWrapper = function() {
		var rw = HTMLRenderer.div({id:'ResourcenWrapper',_class:'Wrapper'});
		rw.append('<h2>Resourcen</h2>');
		return rw;
	};
	this.createResourcenContent=function() {
		return HTMLRenderer.div({id:'ResourcenContent',_class:'Content'});
	};
	this.createResourcenFooter=function() {
		var footer = HTMLRenderer.div( {id : 'ResourcenFooterBar',_class : 'ResourcenFooterBar'});
        
		var _template = HTMLRenderer.div({_class:'RsrcnFooterButton'});
		var _template_show = HTMLRenderer.buttonItem({_class:'RsrcnFooter',title:'Load from template',image:'template.png'});
		var _template_list = HTMLRenderer.div({}).css({display:'none'});
		_template.append(_template_show);
		_template.append(_template_list);
		var _new = HTMLRenderer.buttonItem({_class:'RsrcnFooter',title:'Neue Group',image:'new.png'});
		var _edit = HTMLRenderer.buttonItem({_class:'RsrcnFooter',title:'Edit Group',image:'edit.png'});
		var _del = HTMLRenderer.buttonItem({_class:'RsrcnFooter',title:'Delete Group',image:'delete.png'});

		var thisRes = this;
		AgeTemplates.contener=_template_list;
		AgeTemplates.create(GameCreatorManager.templates);

		_template_show.bind('click', function() {_template_list.css({display:'block'});});
		_new.bind('click', function() {GameCreatorManager.addGroup(thisRes);});
		_del.bind('click', function() {alert('uppss.. noch nicht implementiert.');});
		_edit.bind('click', function() {alert('uppss.. noch nicht implementiert.');});

		
		footer.append(_new);
		footer.append(_edit);
		footer.append(_del);
		footer.append(_template);

        return footer;
	};
}
function GroupCreator(id,index) {
	this.domid = null;
    this.index = index;
    this.id = id;
    this.componentBind = 'GameCreatorManager.gameCreator.resourcenCreator.groups['+index+']';
	this.groupWrapper = null;
	this.groupContener = null;
	this.hiddenItemsSizeComponent = null;
	this.group = new Group();
	this.bgImageView=HTMLRenderer.div({_class:'bgImageView'});
	this.items = null;
    this.itemIdSec=0;
    this.zIndex=HTMLRenderer.inputHidden({name:'resourcen['+index+'].style.zIndex',value:this.group.style.zIndex});
    this.top=HTMLRenderer.inputHidden({name:'resourcen['+index+'].style.top',value:this.group.style.top});
    this.left=HTMLRenderer.inputHidden({name:'resourcen['+index+'].style.left',value:this.group.style.left});
    this.bgColor=HTMLRenderer.inputHidden({name:'resourcen['+index+'].style.bgColor',value:this.group.style.bgColor});
    this.setGroup=function(grp){
    	if(grp != null) this.group = grp;
    };
    this.getItems=function(){
        if(debug) Log('GroupCreator.getItems this.items.length:'+this.items.length,'d');
        var itms = new Array();
        for ( var i = 0; i < this.items.length; i++) {
        var itm = this.items[i];
    	if(itm.id != null){
            if(debug) Log('--GroupCreator.getItems - itms.push(itm.item)','d');
            var _item=itm.getItem();
            _item.group=this.group;
            itms.push(_item);
        }
	}
    return itms;
    };
    this.removeItem = function(itm_id){
                  
             for (var i = 0; i < this.items.length; i++) {
                if(itm_id == this.items[i].id){
                    Log('Lösche Element mit DOMID:'+this.items[i].itemWrapper.attr('id'),'i');
                    this.items[i].itemWrapper.remove();
                    this.items[i].id=null;                
                    //this.items.splice(i, 1);
               //     break;
                }
             }
        };
	this.newItem = function(action,itm) {
		var _action = action || false;
		var _itm = itm ||  null;
		var _id = id+'-new-'+this.itemIdSec;
		if(_itm != null) _id=_itm.getDomId() == null ? _id : _itm.getDomId();
        this.itemIdSec++;
		var newItem = new ItemCreator(_id,[index,this.items.length]);
		newItem.setItem(_itm);
		this.items.push(newItem);
		this.groupContener.append(newItem.render());
		if(_action){
			 GameCreatorManager.actions.push({action:'',object:newItem,domid:newItem.getBgColorComponentId()});
             if(debug) Log('GGroupCreator.render:  GameCreatorManager.actions.push: tmpItem.getBgColorComponentId():'+newItem.getBgColorComponentId(),'d');
		}
		else{
			 GameCreatorManager.update();
		        if(debug) Log('GameCreatorManager.addItem _id:'+_id,'d');
		        $('#'+newItem.getBgColorComponentId()).bind('colorpicked', function () {
		                    newItem.setBgColor($(this).val());
		             });       
		}
       
        this.hiddenItemsSizeComponent.attr({value:''+this.items.length});
        return newItem;
	};
	
	/*
	 * 
	 *    var tmpItem = new ItemCreator(id+'-'+this.itemIdSec,[index,0]); ok
                    this.itemIdSec++;
                    this.items = new Array(tmpItem);
                    GameCreatorManager.actions.push({action:'',object:tmpItem,domid:tmpItem.getBgColorComponentId()});
                    if(debug) Log('GGroupCreator.render:  GameCreatorManager.actions.push: tmpItem.getBgColorComponentId():'+tmpItem.getBgColorComponentId(),'d');
                    this.hiddenItemsSizeComponent.attr({value:''+this.items.length});
	 * 
	 * 
	 */

        this.getNameComponent = function(){
        	if(debug) Log('GroupCreator getNameComponent:'+this.group.name,'d');
            return HTMLRenderer.inputText({bind:this.componentBind+'.setName(this.value)',name : 'resourcen['+index+'].name',
                _class : 'GrpSttngNm',id:'GroupSettingNameInput-' + id,value :this.group.name,size : '8'});
        };
        this.setName = function(name){
            this.group.name = name;
        };
        this.getWidth = function(){
            if(this.group.style.width=='') return null;
            return this.group.style.width;
        };
        this.getHeight = function(){
            if(this.group.style.height=='') return null;
            return this.group.style.height;
        };
        this.getName = function(){
            if(this.group.name=='') return null;
            return this.group.name;
        };
        this.getStackedComponent = function(){
            return HTMLRenderer.inputImageCheckBox({bind:this.componentBind+'.setStacked(this.checked)',name : 'resourcen['+index+'].stacked',_class : 'GrpSttngStckd',id:'GroupSettingStckdInput-' +
                    id,value : 'true',checked:this.group.stacked,title:'(nicht) gestappelt'});
        };
        this.setStacked = function(stacked){
            if(debug) Log('GroupCreator.setStacked:'+stacked,'d');
            this.group.stacked = stacked;
        };
        this.getVisibilityComponent = function(){
            return HTMLRenderer.inputImageCheckBox({bind:this.componentBind+'.setVisibility(this.checked)',name : 'resourcen['+index+'].visibility',_class : 'GrpSttngVsblt ElmntVsblt',
                id:'GroupSettingVsbltInput-' + id,value :'true',checked:this.group.visibility,title:'(un)sichtbar'});
        };
        this.setVisibility = function(visibility){
            this.group.visibility = visibility;
        };
        this.getOrderComponent = function(){
            return HTMLRenderer.inputImageCheckBox({bind:this.componentBind+'.setOrder(this.checked)',name : 'resourcen['+index+'].order',_class : 'GrpSttngOrdr',id:'GroupSettingOrdrInput-' +
                    id,value :'true',checked:this.group.order,title:'(un)geordnet'});
        };
        this.setOrder = function(order){
            this.group.order = order;
        };
        this.getRandomgeneratorComponent = function(){
            return HTMLRenderer.inputImageCheckBox({bind:this.componentBind+'.setRandomgenerator(this.checked)',name : 'resourcen['+index+'].randomgenerator',_class : 'GrpSttngRndm',id:'GroupSettingRndmInput-' +
                    id,value : 'true',checked:this.group.randomgenerator,title:'(nicht) zufallig'});
        };
        this.setRandomgenerator = function(randomgenerator){
            this.group.randomgenerator = randomgenerator;
        };
        this.getSizeComponent = function(){
             var span = HTMLRenderer.span({});
             span.append('size:');
             span.append(HTMLRenderer.inputText( {bind:this.componentBind+'.setWidth(this.value)',name : 'resourcen['+index+'].style.width',_class : 'GrpSttngSz',
                 id:'GroupSettingWidthInput-' + id,value : this.group.style.width,size : '1'}));
             span.append('x');
             span.append(HTMLRenderer.inputText( {bind:this.componentBind+'.setHeight(this.value)',name : 'resourcen['+index+'].style.height',_class : 'GrpSttngSz',id:'GroupSettingHeightInput-' + id,value : this.group.style.height,size : '1'}));
	     return span;
        };
        this.setWidth = function(w){
            var _w = parseInt(w);
            if(!isNaN(_w)) this.group.style.width= _w;
            
            if(debug) Log('GroupCreator.this.setWidth:'+this.group.style.width,'d');
        };
        this.setHeight = function(h){
            var _h = parseInt(h);
            if(!isNaN(_h)) this.group.style.height = _h;
            
        };
        this.getBgColorComponentId=function(){
            return 'GameSettingBgColorInput-'+id;
        };
        this.getBgColorComponent = function(){
            return HTMLRenderer.inputColorField( {name : 'resourcen['+index+'].style.bgColorComponent',id:this.getBgColorComponentId(),value : this.group.style.bgColor,_class:'color',style:'height:18px;width:18px;'});
        };
        this.setBgColor = function(bgcolor){
        	Log('setBgColor:'+bgcolor,'d');
        	this.bgColor.attr('value',bgcolor);
            this.group.style.bgColor=bgcolor;
        };
        this.getBgImageComponent = function(){
            return HTMLRenderer.inputImageIcon({bind:this.componentBind+'.setBGImage',_class:'GrpBgInptCntnr',width:20,height:20,src:'image.png',name:'resourcen['+index+'].style.bgImage'});
        };
        this.setBGImage=function(fileName,tmp){
        	if(fileName != '' && fileName != null){
        		var image_path = AgeSettings.imageTmpPath;
        		if(GameManager.key != null & !tmp) image_path = AgeSettings.userImagePath+GameManager.key+'/';
        		var image = image_path+'0_'+fileName;
        		if(debug) Log('GroupCreator.setBGImage:'+fileName+' _tmp? '+tmp+' GameManager.key:'+GameManager.key+' AgeSettings.imageTmpPath+fileName:'+image_path,'d');
        		this.group.style.imageName = fileName;
        		this.group.style.imagesPath = image_path;
        		this.group.style.bgImage = image;
        		this.bgImageView.empty();
        		this.bgImageView.append('<img src="'+image+'"/>');	
        	}
        };
        this.getBgImageNameComponent=function(){
        	return HTMLRenderer.inputHidden({name:'resourcen['+index+'].style.bgImageName',value:this.group.style.bgImage});
        };
	this.createGroupSetting = function() {
		this.domid ='GroupSetting-' + id;
		this.group.style._class=this.group.getDomIdPrefix();
		var gs = HTMLRenderer.div({id :this.domid ,_class : 'GroupSetting',position:'relative'});

		var div_left = HTMLRenderer.div({_class : 'GrpSettingLft'});
                div_left.append(HTMLRenderer.checkBox({}));

                var div_center = HTMLRenderer.div({_class : 'GrpSettingCntr'});
                if(GameManager.key != null && !AgeUtil.isNull(this.group.style.imageName)) this.setBGImage(this.group.style.imageName);
                else{
                	if(!AgeUtil.isNull(this.group.style.bgImage)){
                		this.bgImageView.empty();
                		this.bgImageView.append('<img src="'+this.group.style.bgImage+'"/>');	
                	}
                }
                div_center.append(this.bgImageView);
                var ul = HTMLRenderer.ul();
                ul.append(HTMLRenderer.li({content:this.getNameComponent()}));
                ul.append(HTMLRenderer.li({content:this.getVisibilityComponent()}));
                ul.append(HTMLRenderer.li({content:this.getOrderComponent()}));
                ul.append(HTMLRenderer.li({content:this.getStackedComponent()}));
                ul.append(HTMLRenderer.li({content:this.getRandomgeneratorComponent()}));
                ul.append(HTMLRenderer.li({content:this.getBgColorComponent()}));
                ul.append(HTMLRenderer.li({content:this.getSizeComponent()}));
                ul.append(HTMLRenderer.li({content:this.getBgImageComponent()}));
                div_center.append(ul);
                div_center.append(this.getBgImageNameComponent());
                div_center.append(HTMLRenderer.clear());

                var div_right = HTMLRenderer.div({_class : 'GrpSettingRght'});

                var _close = HTMLRenderer.buttonItem({image:'closed.png',_class:'closebttn'});
                var thisGroup = this;

                _close.bind('click', function() {GameCreatorManager.closeGroup(thisGroup);});

                div_right.append(_close);

                gs.append(div_left);
                gs.append(div_center);
                gs.append(div_right);
                gs.append(HTMLRenderer.clear());

                return gs;
	};
	this.setItems=function(itms,action){
		if(itms.length==0)this.newItem(action,null);
		for ( var i = 0; i < itms.length; i++) {
			var tmp_itm=this.newItem(action,itms[i]);
		}
	};
	this.render = function() {
		if(this.hiddenItemsSizeComponent == null) this.hiddenItemsSizeComponent =HTMLRenderer.inputHidden({name:'resourcen['+index+'].items',value:'0'});
        if(this.groupWrapper == null) this.groupWrapper = this.createGroupWrapper();
		if(this.groupContener == null) this.groupContener = this.createGroupContener();
		if(this.items == null){	
			this.items = new Array();
			this.setItems(this.group.items,true);
			/*
                    var tmpItem = new ItemCreator(id+'-'+this.itemIdSec,[index,0]);
                    this.itemIdSec++;
                    this.items = new Array(tmpItem);
                    GameCreatorManager.actions.push({action:'',object:tmpItem,domid:tmpItem.getBgColorComponentId()});
                    if(debug) Log('GGroupCreator.render:  GameCreatorManager.actions.push: tmpItem.getBgColorComponentId():'+tmpItem.getBgColorComponentId(),'d');
                    this.hiddenItemsSizeComponent.attr({value:''+this.items.length});
                    */
        }
  

		if(this.domid == null) this.domid = id;

		this.groupWrapper.append(this.createGroupSetting());
		/*
		for ( var i = 0; i < this.items.length; i++) {
			var itemCreator = this.items[i];
			this.groupContener.append(itemCreator.render());
		}
		*/
		this.groupContener.append(HTMLRenderer.inputHidden({name:'resourcen['+index+'].id',value:''+this.group.id}));
		var tmpl_e = '';
		if(this.group.templateId != null) tmpl_e  = HTMLRenderer.inputHidden({name:'resourcen['+index+'].templateId',value:this.group.templateId});
		this.groupContener.append(tmpl_e);
		this.groupContener.append(this.left);
		this.groupContener.append(this.top);
		this.groupContener.append(this.bgColor);
	    this.group.setPositionComponent({left:this.left,top:this.top,zIndex:this.zIndex});
		this.groupWrapper.append(this.groupContener);
		this.groupWrapper.append(this.hiddenItemsSizeComponent);
		this.groupWrapper.append(this.createGroupFooterBar());

		return this.groupWrapper;

	};
	this.createGroupContener = function(){
		return HTMLRenderer.div( {id : 'GroupContener-' + id,_class : 'GroupContener'});
	};
	this.createGroupWrapper = function() {
		this.domid = 'GroupWrapper-' + id;
		return HTMLRenderer.div( {id : this.domid,_class : 'GroupWrapper'});
	};
	this.createGroupFooterBar = function() {

		var footer = HTMLRenderer.div( {id : 'GroupFooterBar-' + id,_class : 'GroupFooterBar'});
		var _new = HTMLRenderer.buttonItem( {_class : 'grpFooter',title : 'Neue Item',image : 'new.png'});
		var _edit = HTMLRenderer.buttonItem( {_class : 'grpFooter',title : 'Edit Item',image : 'edit.png'});
		var _del = HTMLRenderer.buttonItem( {_class : 'grpFooter',title : 'Delete Item',image : 'delete.png'});

		var thisGroup = this;

		_new.bind('click', function() {GameCreatorManager.addItem(thisGroup);});
		_del.bind('click', function() {alert('uppss.. noch nicht implementiert.');});
		_edit.bind('click', function() {alert('uppss.. noch nicht implementiert.');});
		footer.append(_new);
		footer.append(_edit);
		footer.append(_del);

		return footer;
	};
}

function ItemCreator(id,index) {
    this.domid = 'ItemWrapper-' + id;
    this.id = id;
    this._class = null;
    this.item = new Item();
    this.itemWrapper = null;
    this.componentBind = 'GameCreatorManager.gameCreator.resourcenCreator.groups['+index[0]+'].items['+index[1]+']';
    this.namePrefix='resourcen['+index[0]+'].items['+index[1]+']';
    this.bgImageView=HTMLRenderer.div({_class:'bgImageView'});
    this.zIndex=HTMLRenderer.inputHidden({name:this.namePrefix+'.style.zIndex',value:this.item.style.zIndex});
    this.top=HTMLRenderer.inputHidden({name:this.namePrefix+'.style.top',value:this.item.style.top});
    this.left=HTMLRenderer.inputHidden({name:this.namePrefix+'.style.left',value:this.item.style.left});
    this.bgColor=HTMLRenderer.inputHidden({name:this.namePrefix+'.style.bgColor',value:this.item.style.bgColor});
    this.getItem = function(){
        if(this.item.id == -1) this.item.id = id;
        return this.item;
    };
    this.setItem=function(itm){
    	if(itm != null){
    		 this.item = itm;
    		 this.top.attr('value',this.item.style.top);
    		 this.left.attr('value',this.item.style.left);
    	}
    };
    this.getNameComponent = function(){
        return HTMLRenderer.inputText({bind:this.componentBind+'.setName(this.value)',label : '',
        	name : this.namePrefix+'.name',id:'ItemNmInput-' + id,value :  this.item.name,size : '5'});
    };
    this.setName = function(name){
        this.item.name=name;
    };
    this.getName = function(){
        if(this.item.name=='') return null;
        return this.item.name;
    };
    this.getCountComponent = function(){
        return HTMLRenderer.inputText({bind:this.componentBind+'.setCount(this.value)',
        	name : this.namePrefix+'.size',id:'ItemStInput-' + id,value :  this.item.count,size : '5'});
    };
    this.setCount = function(count){
    	if(debug) Log('ItemCreator.setCount:'+count,'d');
        var _c = parseInt(count);
        if(!isNaN(_c)) this.item.count=_c;
    };
    this.getVisibilityComponent = function(){
        return HTMLRenderer.inputImageCheckBox({name : this.namePrefix+'.visibility',_class : 'ItemVsblt  ElmntVsblt',id:'ItemVsbltInput-' +
                id,value : 'true',checked:this.item.visibility,title:'(un)sichtbar',bind:this.componentBind+'.setVisibility(this.checked)'});
    };
    this.setVisibility = function(visibility){
        this.item.visibility=visibility;
    };
    this.getSizeComponent = function(){
             var span = HTMLRenderer.span({});
             span.append('size:');
             span.append(HTMLRenderer.inputText( {bind:this.componentBind+'.setWidth(this.value)',
            	 name : this.namePrefix+'.style.width',
                 id:'ItemWidthInput-' + id,value : this.item.style.width,size : '1'}));
             span.append('x');
             span.append(HTMLRenderer.inputText( {bind:this.componentBind+'.setHeight(this.value)',name : this.namePrefix+'.style.height',id:'ItemHeightInput-' + id,value : this.item.style.height,size : '1'}));
	     return span;
    };
    this.setWidth = function(width){
        var _w = parseInt(width);
        if(!isNaN(_w)) this.item.style.width=_w;
        if(debug) Log('ItemCreator.setWidth: '+this.item.style.width+' id:'+id+',index'+index,'d');
    };
    this.setHeight = function(height){
        var _h = parseInt(height);
        if(!isNaN(_h)) this.item.style.height=_h;
        if(debug) Log('ItemCreator.setHeight: '+this.item.style.width,'d');
    };
    this.getWidth = function(){
        return this.item.style.width;
    };
    this.getHeight = function(){
        return this.item.style.height;
    };
    this.getBgImageNameComponent=function(){
    	return HTMLRenderer.inputHidden({name:this.namePrefix+'.style.bgImageName',value:this.item.style.bgImage});
    };
    /*
    this.setPosition=function(pos){
    	this.top.attr('left',pos.left);
    	this.item.style.left=pos.left;
    	this.top.attr('top',pos.top);
    	this.item.style.top=pos.top;
    };
    */
    this.setBgColor = function(bgcolor){
        this.item.style.bgColor=bgcolor;
        this.bgColor.attr('value',bgcolor);
        if(debug) Log('ItemCreator.setBgColort: '+this.item.style.bgColor,'d');
    };
    this.getBgColorComponentId=function(){
        return 'ItemBgColorInput-'+id;
    };
    this.getBgColorComponent = function(){
        return HTMLRenderer.inputColorField( {name : this.namePrefix+'.style.bgColorComponent',id:this.getBgColorComponentId(),value : this.item.style.bgColor,_class:'color',style:'height:18px;width:18px;'});
    };
    this.getBgImageComponent = function(){
        return HTMLRenderer.inputImageIcon({bind:this.componentBind+'.setBgImage',_class:'ItemBgInptCntnr',width:17,height:17,src:'image.png',name:this.namePrefix+'.style.bgImage'});
    };
    this.setBgImage=function(fileName,tmp){
    	if(fileName != '' && fileName != null){
    	var image_path = AgeSettings.imageTmpPath;
 	    if(GameManager.key != null & !tmp) image_path = AgeSettings.userImagePath+GameManager.key+'/';
 	    var image = image_path+'0_'+fileName;
	    if(debug) Log('ItemCreator.setBGImage:'+fileName+' tmp? '+tmp+' AgeSettings.imageTmpPath+fileName:'+image_path,'d');
	    this.item.style.imageName = fileName;
	    this.item.style.imagesPath = image_path;
	    this.item.style.bgImage = image;
	    this.bgImageView.empty();
	    this.bgImageView.append('<img src="'+image+'"/>');	
    	}
    	
    };
    this.render = function() {
    	this.item.style._class=this.item.getDomIdPrefix();
        this.itemWrapper = this.createItemWrapper();
        var div_left = HTMLRenderer.div({_class : 'ItmWrpprLft'});
        div_left.append(HTMLRenderer.checkBox({}));
//        div_left.append(HTMLRenderer.p({content:(index[1]+1)}));

        var div_center = HTMLRenderer.div({_class : 'ItmWrpprCntr'});

        var div_right = HTMLRenderer.div({_class : 'ItmWrpprRght'});
        if(GameManager.key != null && !AgeUtil.isNull(this.item.style.imageName)) this.setBgImage(this.item.style.imageName,false);
        else{
        	if(!AgeUtil.isNull(this.item.style.bgImage)){
        		this.bgImageView.empty();
        		this.bgImageView.append('<img src="'+this.item.style.bgImage+'"/>');	
        	}
        }
        div_center.append(this.bgImageView);
        var ul = HTMLRenderer.ul();
        ul.append(HTMLRenderer.li({content:this.getNameComponent(),_class : 'ItemNm'}));
        ul.append(HTMLRenderer.li({content:this.getCountComponent(),_class :'ItemSt'}));
        ul.append(HTMLRenderer.li({content:this.getVisibilityComponent()}));
	    ul.append(HTMLRenderer.li({content:this.getSizeComponent(),_class : 'ItemSz'}));
        ul.append(HTMLRenderer.li({content:this.getBgColorComponent()}));
        ul.append(HTMLRenderer.li({content:this.getBgImageComponent()}));
        div_center.append(ul);
        div_center.append(this.left);
        div_center.append(this.top);
        div_center.append(this.bgColor);
        div_center.append(this.getBgImageNameComponent());
        this.item.setPositionComponent({left:this.left,top:this.top,zIndex:this.zIndex}); //groupBy
        div_center.append(HTMLRenderer.inputHidden({name:'resourcen['+index[0]+'].items['+index[1]+'].id',value:''+this.item.id}));
    //    div_center.append(HTMLRenderer.inputHidden({name:'resourcen['+index[0]+'].items['+index[1]+'].groupBy',value:''+this.item.groupBy}));

        var _close = HTMLRenderer.buttonItem({image:'closed.png',_class:'closebttn'});
        div_right.append(_close);

        _close.bind('click', function() {GameCreatorManager.gameCreator.resourcenCreator.groups[index[0]].removeItem(id);});


        this.itemWrapper.append(div_left);
        this.itemWrapper.append(div_center);
        this.itemWrapper.append(div_right);
        this.itemWrapper.append(HTMLRenderer.clear());

        return this.itemWrapper;
    };
    this.createItemWrapper = function() {
        return HTMLRenderer.div( {id :this.domid ,_class : 'ItemWrapper'});
    };
}

var HTMLRenderer = {

    p: function(params){
	return $(document.createElement('p')).attr({id : params.id}).addClass(params._class).append(params.content);
    },
    label: function(p){
            return $(document.createElement('label')).attr( {id : p.id,FOR:p.FOR,title:p.title}).addClass(p._class).append(p.label);
    },
    inputHidden:function(p){
    	return $(document.createElement('input')).attr( {name:p.name,value:p.value,type:'hidden',id : p.id}).addClass(p._class);
    },
    inputText: function(p){
    	var input = $(document.createElement('input')).attr( {name:p.name,value:p.value,type:'text',id : p.id,size:p.size}).addClass(p._class);
    	if(p.bind != null) input.bind('change click keyup', function() {eval(p.bind);});
    	if(debug) Log('inputtext name:'+p.name+' value:'+p.value,'d');
    	return input;
    },
    checkBox: function(p){
            return $(document.createElement('input')).attr( {checked:p.checked,name:p.name,value:p.value,type:'checkbox',id : p.id}).addClass(p._class);
    },
    inputCheckBox : function(params) {
            var input = HTMLRenderer.label(params);
            input.after(HTMLRenderer.checkBox(params));
            return input;
     },
    span: function(p){
		return $(document.createElement('span')).attr( {id : p.id}).addClass(p._class);
	},
    inputImageCheckBox : function(p) {
		var span = this.span({});
		var checkBX = this.checkBox(p);
		var label = this.label({_class:p._class,FOR:p.id});
		if($.browser.msie){
			label.bind('click', function(){

		//		var it = document.getElementById(this.htmlFor);
			//	alert(this.style.backgroundImage);
		//		});

			});
		}
		else{
			if(p.bind != null) checkBX.bind('click', function() {eval(p.bind);});
		}
		span.append(checkBX);
		span.append(label);
		return span;
	},
    inputTextField : function(params) {
		var input = '';
		if(params.label != null) input = '<label for="'+params.id+'">'+params.label+'</label>';

		input += '<input type="text" id="'+params.id	+ '" size="' + params.size + '" name="' + params.name+'" value="' + params.value + '"/>';
		return input;
	},
    inputColorField : function(param) {
		var colorPicker = $(document.createElement('input')).attr( {id : param.id,TYPE:'color',name: param.name,style:param.style,value:param.value,text:'hidden'})
			.addClass(param._class);
		return colorPicker;

    },
    inputImageField : function(param) {  	
    	var file_input = $(document.createElement('input')).attr( {id : param.id,TYPE:'file',name: param.name,size:param.size}).addClass(param._class);
    	file_input.bind('change', function(){
    		if(debug) Log('HTMLRenderer.inputImageField change ajax tmp.image='+file_input.val(),'d');
    		//HTMLRenderer.img({src:file_input.getAsDataURL()}); //firefox !!!!
    	//	Log(file_input.getAsDataURL(),'w');
    	
    		
    		/*	if($.browser.mozilla){
    			eval(''+param.bind+'(\''+this.files[0].getAsDataURL()+'\')');
    		}else if($.browser.msie){
    			if(debug) Log('IMAGE PATH:'+this.val(),'d');
    			eval(''+param.bind+'(\''+this.val()+'\')');
    			
    		}else{*/
    			AgeUpdater.ajaxFileUpload({input:file_input,bind:param.bind});
    	//	}
    	
    			
    			//	$('body').append(HTMLRenderer.img({src:this.files[0].getAsDataURL(),alt:'alt'}));
    	//	AgeUpdater.ajaxFileUpload({input:file_input,bind:param.bind});
    	//	var onsubmit = ;
/*
    		form.submit(function() {
    			if(debug) Log('HTMLRenderer.inputImageField change ajax submit','d');
    			  alert($(this).serialize());
    			  return false;
    			});
    			*/
    	/*	$.ajax({type: "POST", url: "/age/game/xhr.htm",
    			 data: .serialize(),
    			   success: function(msg){
    			 //    alert(msg);
    			     if(param.bind != null) eval(''+param.bind+'(\''+msg+'\')'); 
    			   }
    			 });*/
    	});
   // 	if(debug) Log('HTMLRenderer.inputImageField change bind:'+param.bind+'(msg)','d');
		return file_input;
    },
    inputImageIcon:function(p){
    	var imagePath=AgeSettings.imagePath;
	    var div_inputImage = HTMLRenderer.div({_class:p._class}).css({width: p.width,height: p.height, position:'relative',overflow: 'hidden'});
        var image_input = HTMLRenderer.img({id:'',_class:'GrpBgImg',alt:p.alt,src:(imagePath+p.src)}).css( {
            width: p.width,height: p.height, position:'absolute',zIndex:50});
        var file_input = HTMLRenderer.inputImageField({bind:p.bind,name:p.name,_class:'GrpBgInpt',size:'1'}).css( {
            width: p.width,opacity:0.0,height: p.height,position:'absolute', zIndex:100});   
        if($.browser.mozilla) file_input.css('left','-35px');
        div_inputImage.append(file_input);
        div_inputImage.append(image_input);
        return div_inputImage;
	},
	//buttonItem und button kann man durch eine Definition erstetzen.

    buttonItem : function(p) {
		//wenn TYPE klein ist, gibt es ein Problem unter IE8 - "JQuerry unterst�tz dieser Aktion nicht"
		var imagePath=AgeSettings.imagePath;
		var button = $(document.createElement('button')).attr( {TYPE:'button',id : p.id,title:p.title}).addClass(p._class);
		button.append('<img src="'+imagePath+p.image+'"/>');
		return button;
   },

    clear: function(){
             return $(document.createElement('br')).addClass('clear');
    },

    div : function(style) {
	return $(document.createElement('div')).css( {zIndex:style.zIndex,width : style.width,height : style.height,left : style.left,top : style.top,
            backgroundImage:style.backgroundImage,backgroundColor:style.backgroundColor,position : style.position}).attr( {id : style.id}).addClass(style._class);
    },

    form:function(param){
        var form = $(document.createElement('form')).attr( {id : param.id,action:param.action,method: 'post',enctype:param.enctype}).addClass(param._class);
	form.append(param.formContent);
	return form;
    },

    button : function(p){
       return  $(document.createElement('button')).attr({TYPE:'button',id : p.id}).addClass(p._class).append(p.content);
    },
    
    ul: function(p){
       if(p==null) p = {};
       return $(document.createElement('ul')).attr( {id : p.id}).addClass(p._class);
    },
    
    li: function(p){
         return $(document.createElement('li')).attr( {id : p.id}).addClass(p._class).append(p.content);
    },
    
    img: function(p){
    	 if(p.src) var src = p.src;
    	 else src='';
         return $(document.createElement('img')).attr( {src:src,id : p.id,alt:p.alt,width:p.width,height:p.height,title:p.title}).addClass(p._class);
    },

    h1: function(p){
        return $(document.createElement('h1')).attr( {id : p.id}).addClass(p._class).append(p.content);
    },

    createGameItem : function(style,p){
        var itm = this.div({id : style.id,_class:style._class,width: style.width, height: style.height,left: style.left,
            top:  style.top,zIndex:style.zIndex,position:style.position,backgroundColor : style.getBgColor()});
        var imagePath=style.getImagePath(false);
        if(imagePath!=null) itm.append(this.img({src:imagePath,width:style.width,height:style.height,title:p.title}));
    	if(debug) Log('** createGameItem imageName'+style.imageName+', width:'+style.width+', height:'+style.height+',imagesPath:'+imagePath+''
    			 +',bgColor:'+style.bgColor+',id:'+style.id+',_class:'+style._class,'d');
                     
        return itm;
    }

};
