
var debug = true;

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
    this.isNull=function(e){
    	if(e==null | e == '' | e=='null') return true;
    	return false;
    };
    this.getBgColor = function(){
    	if(bgColor=='') return 'transparent';
    	else return this.bgColor;
    };
    this.getImagePath = function(url){
    	if(!this.isNull(this.bgImage)){ 
    		if(debug) Log('Style.getImagePath image name is:'+this.bgImage,'d');
    		
    		
    		return url ? 'url('+this.bgImage+')' : this.bgImage ;}
    	if(!(this.isNull(this.imagesPath) | this.isNull(this.imageName))) {
    		if(debug) Log('Style.getImagePath image name is:'+this.imageName,'d');
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
    //position: absolute or relative
    this.position = position || _style.position;
    this.setPosition = function(pos){
        this.left = Math.round(pos.left);
        this.top = Math.round(pos.top);
    };
    this.setDomId = function(domid){
        this.id = domid;
    };
    this.copy = function(){
    	var style = new Style(this.height, this.width,this.bgColor,null,this.id,this._class,this.left,this.top,this.position);
    	style.imagesPath=this.imagesPath;
    	style.imageName=this.imageName;
    	style.angle = this.angle;
    	return style;
    };
    this.setStyle = function(s){
        this.height = s.height;
	    this.width = s.width;
	    this.bgColor = s.bgColor;
	    this.imageName = s.imageName;
	    this.imagesPath = s.imagesPath;
	    this.left= Math.round(s.left);
	    this.top= Math.round(s.top);
    };
   this.loadFromJSON = function(s){
        this.setStyle(s);
	    this.imagesPath = AgeSettings.userImagePath+GameManager.key+'/';
	    if(s.imageName) this.bgImage = this.imagesPath+this.angle+'_'+s.imageName;
	    else this.bgImage=null;
	    if(debug) Log('Style.loadFromJSON: bgImage:'+this.bgImage,'d');
    	return this;
    };
}
function Item(id,name,count,visibility,style){
    var _item = DEFAULTS.item;
    this.id = id ||-1;
    this.domid=null;
    this.HTMLElement=null;
    this.actionBar=null;
    this.copies=new Array();
    this.isItem=true;
    this.getDomIdPrefix = function(){
        return 'ageItem-';
    };
    this.getDomId=function(){
    	if(this.id!=-1) return this.getDomIdPrefix()+this.id;
    	return null;
    };
    this.name = name || _item.name;
    this.count = count || _item.count;
//    this.styleInstancen = new Array(this.count);
    this.visibility = visibility || _item.visibility;
    this.style=style || new Style();
    this.positionComponent={left:null,top:null};
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
    this.copy = function(){
        var cpItem=new Item(null,this.name,this.count,this.visibility,this.style);
        return cpItem;
    };
    this.setVisibility=function(vsbl){
    	this.visibility=vsbl;
    	var image_path = this.style.imagesPath+this.style.angle+'_'+this.style.imageName;
    	if(debug) Log('Item,setVisibility() setze image path:'+image_path+' and visibility: '+vsbl,'d');
    	this.setItemVisibilityIcon(this.visibility);
    	var img_e = this.HTMLElement.children('img').first();
    	if(img_e) img_e.attr('src',image_path);
    };
    this.setItemVisibilityIcon=function(vsbl){
    	if(vsbl) this.actionBar.children('img').first().attr('src',AgeSettings.imagePath+AgeSettings.imageUnVisible);
    	else this.actionBar.children('img').first().attr('src',AgeSettings.imagePath+AgeSettings.imageVisible);
    };
    this.sendItemVisibilityUpdate=function(vsbl){
    	var player_name=GameManager.instance.players[GameManager.instance.player].name;
    	var domid=this.HTMLElement.attr('id');
    	this.setItemVisibilityIcon(this.visibility);
    	if(this.visibility) var update = 'action=v&i='+this.id+'&dom='+domid+'&player='+player_name+'&v=false';	
    	else update = 'action=v&i='+this.id+'&dom='+domid+'&player='+player_name+'&v=true';
    	if(debug) Log('Item send visibility update this.visibility:'+this.visibility+' vsbl:'+vsbl+' this.visibility ^ vsbl:'+(this.visibility ^ vsbl),'d');
   // 	if(this.visibility ^ vsbl ) AgeUpdater.sendUpdate(update);
    	 AgeUpdater.sendUpdate(update);
    };
    this.createActionBar=function(){
    	if(this.actionBar==null){
    		
    		this.actionBar=HTMLRenderer.div({_class:'ItemActionBar'}).css('display','none');
    		var _item = this;
    		if(this.visibility) var img = HTMLRenderer.img({src:AgeSettings.imagePath+AgeSettings.imageVisible});
    		else img = HTMLRenderer.img({src:AgeSettings.imagePath+AgeSettings.imageUnVisible});
    		img.bind('click', function () {_item.sendItemVisibilityUpdate(_item.visibility); });
    		this.actionBar.append(img);
    		this.HTMLElement.append(this.actionBar);
    		
    	}
    };
    
    this.bindAction = function(){
    	if(this.actionBar==null) this.createActionBar();
    	var visibility = this.actionBar.css('display');
    	if(debug) Log('Item:bindAction visibility:'+visibility,'d');
    	if(visibility=='none') this.actionBar.css({display:'block'});
    	else this.actionBar.css({display:'none'});
    	//(1*this.HTMLElement.css('top')-16)
   // 	this.actionBar.css({left:this.HTMLElement.css('left'),top:333});
       return this;
    };
    this.createCopies=function(){
        for (var i = 1; i < count; i++) {
            this.copies.push(this.copy());
        }
    };
    this.loadFromJSON = function(i){
	 this.name = i.name;
	 this.count = i.size;
	 this.id = i.id;
	 this.visibility = i.visibility;
	 var style = new Style();
	 style.id = this.getDomIdPrefix()+this.id;
	 style._class = 'item';
	 this.style=style.loadFromJSON(i.style);
	 return this;
    };
}

function Player(name,id){
    this.id = id;
    this.name = name;
    this.angle = null;
    this.getDomIdPrefix = function(){
        return 'agePlayer-';
    };
    this.getName=function(){
    	if(debug) Log('Player.getName() id='+this.id+', name:'+this.name,'d');
        if(this.id == -1) return AgeSettings.playerAreaTitleNoPlayer;
        else return this.name;
    };
    this.setDomId=function(_id){
        this.style.setDomId(this.getDomIdPrefix()+_id);
    };
    this.style = new Style(130, 150,'transparent',null,this.getDomIdPrefix()+id,'agePlayer',-1,-1,'absolute');
    this.loadFromJSON = function(p){
    	this.name = p.name;
    	if(debug) Log('Player load form json angle:'+p.angle,'d');
    	this.angle = p.angle;
    	this.id = p.id;
    	this.style.left=p.style.left;
    	this.style.top=p.style.top;
    	return this;
   };
}

function Group(name,visibility,stacked,order,randomgenerator,style){
    var _group = DEFAULTS.group;
    this.id = -1;
    this.getDomIdPrefix = function(){
        return 'ageGroup-';
    };
    this.getDomId=function(){
    	if(this.id!=-1) return this.getDomIdPrefix()+this.id;
    	return null;
    };
    this.isItem=false;
    this.HTMLElement=null;
    this.name = name || _group.name;
    this.stacked = stacked || _group.stacked;
    this.visibility = visibility || _group.visibility;
    this.order = order || _group.order;
    this.randomgenerator = randomgenerator || _group.randomgenerator;
    this.items= new Array();
    this.style=style || new Style();
    this.animateRandom = function(item_id){
    	if(debug) Log('Group.animateRandom() item_id:'+item_id+', this.randomgenerator:'+this.randomgenerator,'d');	
    	if(this.randomgenerator){ 	
    		var item_image=null;
    		var image = this.HTMLElement.children('img').first();
    		for ( var i = 0; i < this.items.length; i++) {
    			var itm = this.items[i];
    			if(itm.id==item_id) item_image = itm.HTMLElement.children('img').first();
    		}
    	//	Log('Timeout = '+(150*(i+1)),'e');
			image.attr('src',item_image.attr('src'));
    		
    	}else Log('Group.animateRandom() randomgenerator is false.','e');
    };
    this.findItem=function(item_id){
    	for ( var i = 0; i < items.length; i++) {
			var itm = items[i];
			if(itm.id==item_id) return itm;
			
		}
    	return null;
    };
    this.renderItem=function(item){
            return HTMLRenderer.createGameItem(item.style,{});
    };
    
    this.positionComponent={left:null,top:null};
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
    
    
   this.loadFromJSON = function(g){
	    this.name = g.name;
	    this.stacked = g.stacked;
	    this.visibility = g.visibility;
	    this.order = g.order;
	    this.id=g.id;
	    this.randomgenerator = g.randomgenerator;
	    var style = new Style();
	    style._class = 'group';
	    style.id = this.getDomIdPrefix()+this.id;
	    this.style=style.loadFromJSON(g.style);
	    var itms = g.items;
	    for ( var i = 0; i < itms.length; i++) {
    		var item = new Item();
      //		item.id = this.id+'-'+i;
     		this.items.push(item.loadFromJSON(itms[i]));
		}
//	    Log('Erstelle Group:'+g.name,'i');
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
    this.getPlayer=function(player_id){
    	for ( var i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			if(player.id == player_id) return player;
		}
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
    	if(game.player >= 0 && game.players.length > game.player) this.degree = game.players[game.player].angle;
        var contener = $(contener_id);
    	Log('Starte Rendering in '+contener,'i');
    	Perspective.gamePosition=contener.position();
    	this.init();;
        //create game wrapper with 3 div's areas: header, content and footer
        var gameWrapper = HTMLRenderer.div({id:'ageWrapper'});
        var gameHeader = HTMLRenderer.div({id:'ageHeader'});
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
        var gameResourcenHdr = HTMLRenderer.div({id:'ageResourcenHdr'}).append('<p>'+AgeSettings.resourcenTitle+'</p>');
        gameResourcen.append(gameResourcenHdr);
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
    	if(this.degree==0) return style;
    	var _style = style.copy();
    	if(debug) Log('Renderer.setStyle _style:'+_style+' _style.degree:'+_style.angle,'d');
    	var newPos = Perspective.rotateElement(this.degree, _style);
    	_style.left=newPos.left;
    	_style.top=newPos.top;
    	_style.width=newPos.width;
    	_style.height=newPos.height;
    	_style.angle = ''+this.degree;
    	return _style;
    };
    this.createElement = function(style){

    	 Log('create element imageName'+style.imageName+', width:'+style.width+', height:'+style.height+',imagesPath():'+style.getImagePath(true)+''
    			 +',bgColor():'+style.getBgColor()+',id:'+style.id+',_class:'+style._class+' pos:'+style.position+' pos:'+style.top+' pos:'+style.left,'i');
        var imagePath = style.getImagePath(true);
        if(imagePath==null) imagePath=undefined;
        return $(document.createElement('div')).css( {backgroundColor : style.getBgColor(),backgroundImage: imagePath,width: style.width, height:style.height,left: style.left,top:style.top,position:style.position}).attr( {id : style.id}).addClass(style._class);
    };
    this.renderResourcen = function(resourcen){
        if(debug) Log('Renderer: Resourcen length is '+resourcen.length,'d');
        var gameResourcenCnt = HTMLRenderer.div({id:'ageResourcenCnt'});
        for (var i = 0; i < resourcen.length;  i++) {
        	var grp = resourcen[i];
        	 if(debug) Log('########### ##### this.renderResourcen grp.randomgenerator:'+grp.randomgenerator,'e');
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
        var grps_contener = HTMLRenderer.div({});
        var items = grp.items;
       
        if(!grp.order){
               items=AgeUtil.randomShuffle(items);
               items=AgeUtil.randomShuffle(items);
        }
            
         for (var j = 0; j < items.length;  j++) {
            var itm = items[j];
            if(debug) Log('Renderer: renderGroup itm.visibility:'+itm.visibility,'d');

            var itm_style = new Style();
            itm_style.setStyle(itm.style);     
            Log('### renderer copy style(itm.style.imagesPath:'+itm.style.imageName+') to style :'+itm_style.imageName,'d');
            itm_style.bgColor= itm.style.bgColor;
            
            if(!itm.visibility){
                itm_style.bgColor = grp.style.bgColor;
                itm_style.imageName = grp.style.imageName;
                if(debug) Log('Renderer: renderGroup !itm.visibility grp.style.imageName: '+grp.style.imageName+' grp.style.bgColor:'+grp.style.bgColor,'d');
            }
      //      itm_style.left = itm.style.left + j*itm.style.width;
      //      itm_style.top = itm.style.top;
            if(debug) Log('Renderer: renderGroup itm_style.left:'+itm_style.left+', itm_style.top:'+itm_style.top,'d');
            if(grp.stacked){
       //        itm_style.left = itm.style.left + (j+1);
       //        itm_style._class=itm.style._class+' stacked';
            }


        	itm_style.id = itm.getDomIdPrefix()+itm.id;
                
            if(debug) Log('Renderer: renderGroup itm_style.id:'+itm_style.id,'d');
      //  	if(game.player>0) itm.style.angle='180';
        	
        	var item = HTMLRenderer.createGameItem(this.getStyle(itm_style),{title:(grp.name+'-'+itm.name)});
            var HTMLElement = this.makeDraggable(item,itm);
            itm.HTMLElement=this.bindItemAction(HTMLElement,itm);
            itm.createActionBar();
        	grps_contener.append(itm.HTMLElement);
       }
      return grps_contener;
    };
    this.renderItem = function(grp,item_index){

    };
    this.bindItemAction=function(HTMLElement,itm){	
    	if(debug) Log('BINDE ACTION DBCLICK for itm.id:'+itm.id,'d');
    	return HTMLElement.bind('dblclick', function () {itm.bindAction(); });
    };
    this.makeDraggable = function(itemDOM,itemObject){
    	itemDOM.draggable({
    		containment :  this.gameContent,
    		zIndex: 2700,
    		scroll : false,
    		drag: function(event, ui) {
    			AgeUpdater.setPosition(event,ui,itemObject);
    			if(itemObject.randomgenerator){
    				var image = itemDOM.children('img').first();
    				image.attr('src',itemObject.style.getImagePath(false));
    			}
              },
            stop: function(event, ui) {
            	//  if(debug) Log('MAKE DRAGGABLA actio STOP itemObject.randomgenerator ist '+itemObject.randomgenerator,'d');
            	  if(itemObject.randomgenerator) AgeUpdater.randomizeGroup(itemObject);
              }
    	   
            });
    	return itemDOM;
    };
    this.renderPlayers=function(){
    	 var players = game.getPlayers();
    	 for (i = 0; i < players.length;  i++) {
             var player = players[i];
             var playerElement = this.createElement(this.getStyle(player.style));
             var name = player.name;
             if(name == null || name =='') name ="Player - "+(i+1);
             player.name = name;
             if(debug) Log('Renderer.renderPlayers() name is null t? :'+(typeof player.name),'d');
             var playerHeader = HTMLRenderer.p({_class:'agePlayerHeader',content:name});
             playerElement.append(playerHeader);
        	 this.gameContent.append(playerElement);
         }
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

function RandomGenerator(){

}


/*
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

*/

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
    //muss man die Name Ã¤ndern. Verschiebt eigene Element so die symetrisch zu anderen ist.
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
    },
    gamePosition:null

};


function Log(text,level) {
	var msg;
	if(level=='w')msg = '<span style="color:yellow;">WARNING: '+text+'</span>';
	else if(level=='e') msg = '<span style="color:red;">ERROR: '+text+'</span>';
	else if(level=='d') msg = '<span style="color:black;">DEBUG: '+text+'</span>';
	else  msg = '<span style="color:green;">INFO: '+text+'</span>';
	$('#ageConsole').prepend(msg + '<br>');

}

function IConnector(onopen,onmessage,onclose,send,join){
    this.onopen =onopen;
    this.onmessage =onmessage;
    this.onclose = onclose;
    this.send =send;
    this.join = join;
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
	//   var data = eval('(' + msg.v + ')');
        var action = msg.n;
        var data = msg.v;
    //    Log('Bekomme Daten...action:'+action,'i');
        if(action=='init'){
        	if(data){
        		var status = data.status;
        		if(status == 0){
        			if(debug) Log('init status 0, nachricht:'+data.msg,'d');
        		}else if(status==1){
        			
        			if(data.game) GameManager.loadGame(data.game);
        			if(GameManager.instance != null) GameManager.instance.setCurrentPlayer(data.player);
        			GameManager.local=false;
        			if(data.player) GameManager.joined = true;
        			GameManager.renderGame();
        			setInterval("AgeUpdater.listenForUpdate()", 70);
        			$(window).unload( function () { GameManager.leaveGame(); } );
        		//	GameManager.connector.send("ping=");
        		}
        		else Log('Ich habe unbekannte Init antwort bekommen.!!! status:'+status,'e');
        	}else Log('Für eine Ation - init wurde keine Daten empfanden!!!','e');
        }
        if(action=='j'){
        	if(data.player){
        		var player = data.player;
        		Log('Bekomme Daten ...  Player '+player.name+' mit ID:'+player.id+' has joined.','i');
        	}
        	 
        }
        if(action=='m'){
        //	var data = eval('(' + msg.v + ')');')
         try{
        	var item_id=data.i;
        	var pos=data.pos;
        	var player_id=data.player;
        	var cur_player = GameManager.instance.players[GameManager.instance.player];
        	
        	if(player_id!=cur_player.id){
        		var player = GameManager.instance.getPlayer(player_id);
                var angle = cur_player.angle-player.angle;
        		if(debug) Log('Bekomme Daten:move item_id '+item_id+', dom:'+pos.dom+',  pos x '+pos.x+' y:'+pos.y+', w:'+pos.w+' h:'+pos.h+' player:'+player.id,'d');
         		var style = Perspective.rotateElement(angle,{left:pos.x,top:pos.y,width:pos.w,height:pos.h});
        		$('#'+pos.dom).css( {left : style.left,top : style.top});
        	}
    	   }catch(e){
    		Log('CometConnector.onmessage() action:move msg:'+e,'e');
    	   }
        }
        if(action=='r'){
        	var grp_id = data.grp;
        	var itm_id = data.itm;
        	if(debug) Log('CometConnector.onmessage()  action:random grp_id:'+grp_id+', itm_id:'+itm_id,'d');
        	var groups = GameManager.instance.ressourcen;
        	for ( var i = 0; i < groups.length; i++) {
				var grp = groups[i];
				if(grp.id == grp_id) grp.animateRandom(itm_id);
			}
        }
        if(action=='chat'){
        	var text = $('#'+AgeSettings.chatContenerId).children('div').first();
        	text.prepend('<p><span class="label">['+data.from+']<span> '+data.msg+'</p>');
        }
        if(action=='v'){	
        	var itm_id = data.itm;
        	var player_name = data.player;
        	var itm_dom = data.domid;
        	var visibility = data.v;
        	var img_name = data.img;
        	if(debug) Log('CometConnector.onmessage()  action:visibility itm_id:'+itm_id+', player_name:'+player_name+' itm_dom:'+itm_dom+' visibility'+visibility+' img_name:'+img_name ,'d');
        	var groups = GameManager.instance.ressourcen;
        	for ( var i = 0; i < groups.length; i++) {
				var grp = groups[i];			
				for ( var j = 0; j < grp.items.length; j++) {
					var itm  = grp.items[j];
					if(debug) Log('CometConnector.onmessage()  if(itm.id==itm_id) itm.id:'+itm.id ,'d');
		        	
					if(itm.id==itm_id){
						if(visibility)  itm.style.imageName = img_name;
						else itm.style.imageName=grp.style.imageName;
						var game = GameManager.instance;
						itm.style.angle = game.players[game.player].angle;
						itm.setVisibility(visibility);
						var text = $('#'+AgeSettings.chatContenerId).children('div').first();
						if(debug) Log('itm.style.imageName: '+itm.style.imageName+' Chat MSG text_element:'+text,'d');
			        	text.prepend('<p><span class="label">['+player_name+']<span> hat <strong>'+itm.name+'</strong> umgedreht.</p>');
			        	
					}
				}
			}
        }
      //  else  Log('Empfange undefinierte Aktion.','e');
   },function(key){
        alert("onclose"+key);
   },function(data){
	   
	  
		$.ajax({type : "POST", url:GameManager.url, data:data,
			success: function(data) {
			 Log('on succses:'+data,'d');
			GameManager.connector.onmessage(data);
		  }	});
   },function(url,query){
	 if(debug) Log(' Erstelle eine IFRAME...','d');
	// GameManager.connector.send("init=1&"+query);
		$('body').append('<iframe name="hidden" src="' +url+'?'+query+'" id="comet-frame" style="display: none;"></iframe>');
   });

}
WebSocketConnector.prototype = new IConnector;
CometConnector.prototype = new IConnector;
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
	    leaveGame:function(){
	    	var cur_player = GameManager.instance.players[GameManager.instance.player].id;
	    	AgeUpdater.sendUpdate('l=player&id='+cur_player);
	    },
	    init:function(initParams){
	    	Log('Setze init Parameters...','i');
	    	if(initParams.key) this.key = initParams.key;
	        this.url = initParams.url;
	        if(initParams.contener) this.contener = initParams.contener;
	        Log('Setze init contener :'+this.contener,'e');
	        Log('Erstelle eine Connector...','i');
	        this.connector = new CometConnector();
	        Log('Verbinde sich mit den Server...','i');
	       
	        var query='key='+this.key;
	        if(this.instance==null) query += '&loadGame=true'; 
	        
	        this.connector.join(this.url,query);
	        Log('Url: '+this.url+'?'+query,'i');
	    },
	    loadGame:function(gameparams){
	    	var game = new Game();
	    	Log('loadGame '+gameparams,'i');
	    	this.instance = game.loadFromJSON(gameparams);

	    //	this.instance.setCurrentPlayer(player_id);
	    //    Log('Rendere the Game  in '+this.contener,'i');
	    //	this.instance.render($(this.contener));
	    //	setInterval("AgeUpdater.listenForUpdate()", 2000);
	    },
	    renderGame:function(){
	    	if(debug) Log('GameManager.renderGame this.contener:'+this.contener,'e');
	    	this.instance.render($(this.contener));
	    }
	   
};
AgeUpdater={
    update:{r:'',c:[],l:''},
    lastUpdateTime:null,
    setPosition:function(event, ui,itm){
        if(!GameManager.local){
            var cur_player = GameManager.instance.players[GameManager.instance.player];
            var dom = itm.getDomIdPrefix()+itm.id;
            var groupTyp='norm';
            if(itm.randomgenerator) groupTyp='random';
            if(itm.isItem) var isItm = 'true';
            else isItm = 'false';
            var _update = "action=m&isItm="+isItm+"&groupTyp="+groupTyp+"&p=" + cur_player.id + "&i="+itm.id+"&dom="+dom+"&x=" + Math.round(ui.position.left) + "&y=" + Math.round(ui.position.top)+"&h="+Math.round(itm.style.height)+"&w="+Math.round(itm.style.width);
            this.update.r = _update;
        }
        else{
            itm.setLeft(ui.position.left);
            itm.setTop(ui.position.top);  
            return;
        }
    },
    randomizeGroup:function(grp){
    	var cur_player = GameManager.instance.players[GameManager.instance.player];
    	this.sendUpdate('action=random&grp='+grp.id+'&p='+cur_player.name);
    },
    sendChatMessage:function(){
    	var input_text = $('#'+AgeSettings.chatContenerId).children('input').first();
    	var cur_player = GameManager.instance.players[GameManager.instance.player];
    	this.sendUpdate('action=chat&msg='+input_text.val()+'&from='+cur_player.name);
    	input_text.attr('value','');  	
    },
    sendUpdate:function(updateMsg){
        if(!GameManager.local){
            Log('sende : '+updateMsg,'i');
            GameManager.connector.send(updateMsg);
        }
        else{
            Log('AgeUpdater.sendUpdate(): Game ist Local.','w');
        }
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
        		this.sendUpdate('action=ping');
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
    }
};



var DEFAULTS={
    style:{height:30, width:30,bgColor:'transparent',_class:'',left:0,top:0, bgImage:null,id:'',position:'absolute'},
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
    update: function(){
       if(mColorPicker != null) mColorPicker.main();
       else Log('GameCreatorManager:update Color Picker ist nicht VerfÃ¼gbar !!!','e');
       
       this.bindActions();
    },
    bind:function(p){
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
    	thisRes.newGroup();
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
		//	this.playersInputHiddenElements.append(HTMLRenderer.inputHidden({name:'players['+i+'].name',value:player.name}));
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
            	return this.getInputTextComponent({id:'GameSettingHeigth',inputValue:this.game.table.style.height,_class:'GameSettingInput',label:'HÃ¶he:',FOR:'GameSettingWidthInput',
                    bind:'GameCreatorManager.gameCreator.gameSetting.setGameHeight(this.value)',name : 'table.style.height',inputId:'GGameSettingWidthInput',inputValue: this.game.table.style.height,size : '15'});

        };

    this.setGameHeight = function(height){
    	this.game.table.style.height = parseInt(height);
        if(debug) Log('game.table.style.height:'+this.game.table.style.height,'d');
	};

     this.getBgColorComponent = function(){
            var inputColor = HTMLRenderer.inputColorField( {name : 'table.style.bgColor',id:'GameSettingBgColorInput',value : this.game.table.style.bgColor,_class:'color',style:'height:20px;width:20px;'});
            //GameCreatorManager.gameCreator.gameSetting.setGameBgColor
	    var inputColorLabel = HTMLRenderer.label({FOR:'GameSettingBgColorInput',label:'Background Color: '});
            GameCreatorManager.actions.push({action:'',object:GameCreatorManager.gameCreator.gameSetting,domid:'GameSettingBgColorInput'});
            return HTMLRenderer.p( {id : 'GameSettingColor',_class : 'GameSettingInput'}).append(inputColorLabel).append(inputColor);
        };
        this.setBgColor = function(bgcolor){
		this.game.table.style.bgColor = bgcolor;
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
                    Log('lösche gruppe mit DOMID:'+this.groups[i].groupWrapper.attr('id'),'i');
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

		var _new = HTMLRenderer.buttonItem({_class:'RsrcnFooter',title:'Neue Group',image:'new.png'});
		var _edit = HTMLRenderer.buttonItem({_class:'RsrcnFooter',title:'Edit Group',image:'edit.png'});
		var _del = HTMLRenderer.buttonItem({_class:'RsrcnFooter',title:'Delete Group',image:'delete.png'});

		var thisRes = this;

		_new.bind('click', function() {GameCreatorManager.addGroup(thisRes);});
		_del.bind('click', function() {alert('uppss.. noch nicht implementiert.');});
		_edit.bind('click', function() {alert('uppss.. noch nicht implementiert.');});

		footer.append(_new);
		footer.append(_edit);
		footer.append(_del);

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
    this.top=HTMLRenderer.inputHidden({name:'resourcen['+index+'].style.top',value:this.group.style.top});
    this.left=HTMLRenderer.inputHidden({name:'resourcen['+index+'].style.left',value:this.group.style.left});
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
            itms.push(itm.getItem());
        }
	}
    return itms;
    };
    this.removeItem = function(itm_id){
                  
             for (var i = 0; i < this.items.length; i++) {
                if(itm_id == this.items[i].id){
                    Log('lösche Element mit DOMID:'+this.items[i].itemWrapper.attr('id'),'i');
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
            return HTMLRenderer.inputColorField( {name : 'resourcen['+index+'].style.bgColor',id:this.getBgColorComponentId(),value : this.group.style.bgColor,_class:'color',style:'height:18px;width:18px;'});
        };
        this.setBgColor = function(bgcolor){
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
	this.createGroupSetting = function() {
		this.domid ='GroupSetting-' + id;
		var gs = HTMLRenderer.div({id :this.domid ,_class : 'GroupSetting',position:'relative'});

		var div_left = HTMLRenderer.div({_class : 'GrpSettingLft'});
                div_left.append(HTMLRenderer.checkBox({}));

                var div_center = HTMLRenderer.div({_class : 'GrpSettingCntr'});
                if(GameManager.key != null) this.setBGImage(this.group.style.imageName);
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
		this.groupContener.append(this.left);
		this.groupContener.append(this.top);
	    this.group.setPositionComponent({left:this.left,top:this.top});
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
    this.top=HTMLRenderer.inputHidden({name:this.namePrefix+'.style.top',value:this.item.style.top});
    this.left=HTMLRenderer.inputHidden({name:this.namePrefix+'.style.left',value:this.item.style.left});
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
        if(debug) Log('ItemCreator.setBgColort: '+this.item.style.bgColor,'d');
    };
    this.getBgColorComponentId=function(){
        return 'ItemBgColorInput-'+id;
    };
    this.getBgColorComponent = function(){
        return HTMLRenderer.inputColorField( {name : this.namePrefix+'.style.bgColor',id:this.getBgColorComponentId(),value : this.item.style.bgColor,_class:'color',style:'height:18px;width:18px;'});
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
        this.itemWrapper = this.createItemWrapper();
        var div_left = HTMLRenderer.div({_class : 'ItmWrpprLft'});
        div_left.append(HTMLRenderer.checkBox({}));
//        div_left.append(HTMLRenderer.p({content:(index[1]+1)}));

        var div_center = HTMLRenderer.div({_class : 'ItmWrpprCntr'});

        var div_right = HTMLRenderer.div({_class : 'ItmWrpprRght'});
        if(GameManager.key != null) this.setBgImage(this.item.style.imageName,false);
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
        this.item.setPositionComponent({left:this.left,top:this.top});
        div_center.append(HTMLRenderer.inputHidden({name:'resourcen['+index[0]+'].items['+index[1]+'].id',value:''+this.item.id}));

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
		//wenn TYPE klein ist, gibt es ein Problem unter IE8 - "JQuerry unterstï¿½tz dieser Aktion nicht"
		var imagePath=AgeSettings.imagePath;
		var button = $(document.createElement('button')).attr( {TYPE:'button',id : p.id,title:p.title}).addClass(p._class);
		button.append('<img src="'+imagePath+p.image+'"/>');
		return button;
   },

    clear: function(){
             return $(document.createElement('br')).addClass('clear');
    },

    div : function(style) {
	return $(document.createElement('div')).css( {width : style.width,height : style.height,left : style.left,top : style.top,
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

    createGameItem : function(_style,p){
        var style = _style;
        var itm = this.div({id : style.id,_class:style._class,width: style.width, height: style.height,left: style.left,
            top:  style.top, position:style.position,backgroundColor : style.getBgColor()});
        var imagePath=style.getImagePath(false);
        if(imagePath!=null) itm.append(this.img({src:style.getImagePath(false),width:style.width,height:style.height,title:p.title}));
    	if(debug) Log('create element imageName'+style.imageName+', width:'+style.width+', height:'+style.height+',imagesPath:'+style.imagesPath+''
    			 +',bgColor:'+style.bgColor+',id:'+style.id+',_class:'+style._class,'i');
                     
        return itm;
    }

};


