package de.tubs.age.util;


import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.atmosphere.cpr.AtmosphereResource;


import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Groups;
import de.tubs.age.jpa.Item;
import de.tubs.age.jpa.Player;

public class AgeActionHandler {
	public static int TYPE_BROADCAST=0, TYPE_RESPONSE = 1, TYPE_BROADCAST_RESPONSE=2, PHASE_JOIN=3, PHASE_ONMESSAGE=4,PHASE_CLOSE=5,TYPE_NO_RESPONSE=6;
    private String response;
    private InstancePlayer instancePlayer;
    private int phase;
    private int type;
    private AtmosphereResource<HttpServletRequest, HttpServletResponse> atmoResource;
	private String rBroadcast;

	public AgeActionHandler(AtmosphereResource<HttpServletRequest, HttpServletResponse> atmoResource,InstancePlayer instancePlayer) {
		this.instancePlayer=instancePlayer;
		this.atmoResource = atmoResource;
		this.type=AgeActionHandler.TYPE_NO_RESPONSE;
		invokeAction(atmoResource.getRequest());
	}
   
   private void actionChat(HttpServletRequest req){
	   this.phase=AgeActionHandler.PHASE_ONMESSAGE;
	   this.type=AgeActionHandler.TYPE_BROADCAST;
	   String msg = req.getParameter("msg");
	   String from = req.getParameter("from");
	   this.response="{n:'chat',v:{from:'"+from+"',msg:'"+msg+"'}}";
   }
   public void actionJoin(HttpServletRequest req){
		this.phase=AgeActionHandler.PHASE_JOIN;
		Player player = this.instancePlayer.getPlayer();
		if(player != null){
			String playerJSON = player.toJSON();
			this.rBroadcast="{n:'j',v:{player:"+playerJSON+"}}";
			this.response="{n:'init',v:{status:1,player:"+playerJSON+",game:"+this.instancePlayer.getInstance().getGame().toJSON()+"}}";
			this.type=AgeActionHandler.TYPE_BROADCAST_RESPONSE;
			
		}else{
			this.response="{n:'init',v:{status:0,msg:'Es wurde keine Player zugewissen!!!'}}";
			this.type=AgeActionHandler.TYPE_RESPONSE;
		}
   }
   private void actionMove(HttpServletRequest req){
	   this.phase=AgeActionHandler.PHASE_ONMESSAGE;
	   this.type=AgeActionHandler.TYPE_BROADCAST;
		Game game = this.instancePlayer.getInstance().getGame();
		int x = convertToInt(req.getParameter("x"));
	    int y = convertToInt(req.getParameter("y"));
	    int w = convertToInt(req.getParameter("w"));
	    int h = convertToInt(req.getParameter("h"));
	    int zIndex = convertToInt(req.getParameter("zindex"));
	    String isItem = ""+req.getParameter("isItm");
	    String groupTyp=req.getParameter("groupTyp");
		int item = convertToInt(req.getParameter("i"));
		int  player = convertToInt(req.getParameter("p"));
		String dom = req.getParameter("dom");
		IAgeGameElement gameElement;	
		if(isItem.equals("true")) gameElement = game.findItem(item);
		else  gameElement = game.findGroup(item);
		
		gameElement.getStyle().setLeft(x);
		gameElement.getStyle().setTop(y);
		gameElement.getStyle().setzIndex(zIndex);
		
		this.response="{n:'m',v:{i:"+item+",pos:{x:"+x+",y:"+y+",dom:'"+dom+"',w:"+w+",h:"+h+"},groupTyp:'"+groupTyp+"',isItem:"+isItem+",zIndex:"+zIndex+",player:"+player+"}}";
	}

	private void actionPing(HttpServletRequest req) {
		this.phase=AgeActionHandler.PHASE_ONMESSAGE;
		this.type=AgeActionHandler.TYPE_RESPONSE;
		this.response="{n:'pong',v:'dumpData'}";
    }

	private void actionRandom(HttpServletRequest req) {
		this.phase=AgeActionHandler.PHASE_ONMESSAGE;
		this.type=AgeActionHandler.TYPE_NO_RESPONSE;
		int id = convertToInt(req.getParameter("grp"));
			if(id>0){
				Game game = this.instancePlayer.getInstance().getGame();
				List<Groups> groups = game.getResourcen();
				for (Groups group : groups) {
					if(group.getId()==id && group.isRandomgenerator()){
						List<Item> items = group.getItems();
						int item_index = (int)(Math.floor(Math.random()*1000000))%items.size();
						Item item = items.get(item_index);
						this.response="{n:'r',v:{grp:"+id+",itm:"+item.getId()+"}}";
						this.type=AgeActionHandler.TYPE_BROADCAST;
					}
				}
			}
	}

	private void actionVisibility(HttpServletRequest req) {
		this.phase=AgeActionHandler.PHASE_ONMESSAGE;
		
		Game game = this.instancePlayer.getInstance().getGame();
		boolean visibility = Boolean.parseBoolean(req.getParameter("v"));
		boolean isGroup =  Boolean.parseBoolean(req.getParameter("isGroup"));
		boolean isPrivate =  Boolean.parseBoolean(req.getParameter("private"));
			//'action=v&i='+this.id+'&player='+player_name+'&v='+vsbl+'&isGroup=true';
		int id = convertToInt(req.getParameter("i"));
		String player = req.getParameter("player");	
		if(isGroup){
			Groups group = game.findGroup(id);
			if(group != null){
				group.setItemsVisibility(visibility);
				this.type=AgeActionHandler.TYPE_BROADCAST;
				this.response="{n:'v',v:{itm:"+id+",player:'"+player+"',isGroup:true,grp:"+group.toJSON()+"}}";
			
			}
		}else{
			String domid = req.getParameter("dom");
						
			String image_name="";
			String bgColor="";
			Item item = game.findItem(id);
			if(item != null) {
				if(visibility) {
					image_name=item.getStyle().getBgImageName();
					bgColor=item.getStyle().getBgColor();
					if(!isPrivate) item.getGroups().setVisibility(true);
				}
				
				if(isPrivate){
					this.type=AgeActionHandler.TYPE_BROADCAST_RESPONSE;
					this.rBroadcast="{n:'chat',v:{from:'"+player+"',msg:'*** hat die Sichtbarkeit einer Element aus "+item.getGroups().getName()+" ge&#228;ndert und es ist nur f&#252;r dieser Spieler sichtbar.'}}";		
				}else{
					item.setVisibility(visibility);
					this.type=AgeActionHandler.TYPE_BROADCAST;
				}
				
				this.response="{n:'v',v:{itm:"+id+",player:'"+player+"',domid:'"+domid+"',v:"+visibility+",bgColor:'"+bgColor+"',img:'"+image_name+"',isPrivate:"+isPrivate+"}}";
			}	
			
		}
		
	}

	private void actionLeave(HttpServletRequest req) {
		this.type=AgeActionHandler.TYPE_NO_RESPONSE;
		int id = convertToInt(req.getParameter("player"));
		if(this.instancePlayer.getInstance().removeInstancePlayer(id)){
			this.response="{n:'leave',v:"+id+"}";
			this.phase=AgeActionHandler.PHASE_CLOSE;
			this.type=AgeActionHandler.TYPE_NO_RESPONSE;
		}
	}

	private void invokeAction(HttpServletRequest req) {
		if(this.instancePlayer!=null){
			if(this.instancePlayer.getPlayer() != null) this.instancePlayer.getPlayer().notifyPongTime();
			String action = ""+req.getParameter("action");
			if(action.equalsIgnoreCase("chat")){
				actionChat(req);
			}else if(action.equalsIgnoreCase("m")){
				actionMove(req);
			}else if(action.equalsIgnoreCase("ping")){
				actionPing(req);
			}else if(action.equalsIgnoreCase("random")){
				actionRandom(req);
			}else if(action.equalsIgnoreCase("v")){
				actionVisibility(req);
			}else if(action.equalsIgnoreCase("leave")){
				actionLeave(req);
			}else if(action.equalsIgnoreCase("join")){
				actionJoin(req);
			}else if(action.equalsIgnoreCase("playerName")){
				actionChangePlayerName(req);
			}else if(action.equalsIgnoreCase("stack")){
				actionStack(req);
			}else if(action.equalsIgnoreCase("randomize")){
				actionRandomizeGroup(req);
			}else if(action.equalsIgnoreCase("itemowner")){
				actionChangeItemOwner(req);
			}else if(action.equalsIgnoreCase("itemupdate")){
				actionUpdateItem(req);
			}
		}else System.out.println("+++ AgeActionHandler.invokeAction() instance player is NULL");
	}
	
	private void actionUpdateItem(HttpServletRequest req) {
		int id = convertToInt(req.getParameter("id"));
		int toPlayer = convertToInt(req.getParameter("toPlayer"));
		Item item = this.instancePlayer.getInstance().getGame().findItem(id);
		if(item != null){
			this.type=AgeActionHandler.TYPE_BROADCAST;
			this.phase=AgeActionHandler.PHASE_ONMESSAGE;
			this.response="{n:'updateItem',v:"+item.toJSON()+"}";
		}
		
	}

	private void actionChangeItemOwner(HttpServletRequest req) {
		// action=itemowner&owner='+item.owner+'&id='+item.id
		int id = convertToInt(req.getParameter("id"));
		int owner = convertToInt(req.getParameter("owner"));
		Item item = this.instancePlayer.getInstance().getGame().findItem(id);
		if(item != null){
			item.setOwner(owner);
			this.type=AgeActionHandler.TYPE_BROADCAST;
			this.phase=AgeActionHandler.PHASE_ONMESSAGE;
			this.response="{n:'itemOwner',v:{id:"+id+",owner:"+owner+"}}";
		}
	}

	private void actionRandomizeGroup(HttpServletRequest req) {
		//action=randomize&id='+this.id+'&player='+player_name;
		int id = convertToInt(req.getParameter("id"));
		String playerName = req.getParameter("player");
		Groups grp = this.instancePlayer.getInstance().getGame().findGroup(id);
		grp.randomizeItems();
		this.type=AgeActionHandler.TYPE_BROADCAST;
		this.phase=AgeActionHandler.PHASE_ONMESSAGE;
		this.response="{n:'randomize',v:{id:"+id+",playerName:'"+playerName+"',grp:"+grp.toJSON()+"}}";
	}

	private void actionStack(HttpServletRequest req) {
		int id = convertToInt(req.getParameter("id"));
		int atItem = convertToInt(req.getParameter("atItem"));
		String playerName = req.getParameter("playerName");
		boolean stacked = Boolean.parseBoolean(req.getParameter("stacked"));
		Groups grp = this.instancePlayer.getInstance().getGame().findGroup(id);
		if(grp != null){
			int left = 0;
			int top = 0;
			if(stacked){
				Item item = grp.findItem(atItem);
				if(item != null){
					//left = item.getStyle().getLeft();
					//top = item.getStyle().getTop();
				//	grp.setVisibility(item.isVisibility());
					grp.getStyle().setLeft(item.getStyle().getLeft());
					grp.getStyle().setTop(item.getStyle().getTop());	
					
					this.type=AgeActionHandler.TYPE_BROADCAST;
					this.phase=AgeActionHandler.PHASE_ONMESSAGE;
				}
			}else{
			//	left = grp.getStyle().getLeft();
			//	top = grp.getStyle().getTop();
				this.type=AgeActionHandler.TYPE_BROADCAST;
				this.phase=AgeActionHandler.PHASE_ONMESSAGE;		
			}
			grp.resetItemPosition();
			grp.setStacked(stacked);
			System.out.println("##### stack left:"+left+",top:"+top);
			this.response="{n:'stack',v:{id:"+id+",playerName:'"+playerName+"',grp:"+grp.toJSON()+"}}";
		//	this.response="{n:'stack',v:{id:"+id+",left:"+left+",top:"+top+",playerName:'"+playerName+"',stacked:"+stacked+"}}";
			
		}	
	}

	private void actionChangePlayerName(HttpServletRequest req) {
		int id = convertToInt(req.getParameter("player"));
		String name = req.getParameter("name");
		Player player = this.instancePlayer.getInstance().findPlayer(id);
//		System.out.println("name:"+name+" player:"+player+" id:"+id+" instanceplayer.id:"+this.instancePlayer.getPlayer().getId());
		if(player != null && player.getId() == this.instancePlayer.getPlayer().getId()){
			this.type=AgeActionHandler.TYPE_BROADCAST;
			this.phase=AgeActionHandler.PHASE_ONMESSAGE;
			player.setName(name);
			this.response="{n:'playerName',v:{name:'"+name+"',id:"+player.getId()+"}}";
		}
		
	}

	protected  int convertToInt(String param){
		   int i = 0;
		   try{ i = Integer.parseInt(param);}
		   catch(Exception e){}  
		   return i;
	   }

	public String getResponse() {
		return response;
	}

	public void setResponse(String response) {
		
		this.response = response;
	}

	public int getPhase() {
		return phase;
	}

	public void setPhase(int phase) {
		this.phase = phase;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getrBroadcast() {
		return rBroadcast;
	}

	public void setrBroadcast(String rBroadcast) {
		this.rBroadcast = rBroadcast;
	}

	public InstancePlayer getInstancePlayer() {
		return instancePlayer;
	}

	public void setInstancePlayer(InstancePlayer instancePlayer) {
		this.instancePlayer = instancePlayer;
	}

	public AtmosphereResource<HttpServletRequest, HttpServletResponse> getAtmosphereResource() {
		return atmoResource;
	}

	public void setAtmosphereResource(
			AtmosphereResource<HttpServletRequest, HttpServletResponse> atmoResource) {
		this.atmoResource = atmoResource;
	}

}
