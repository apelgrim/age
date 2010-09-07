package de.tubs.age.blocking;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.catalina.connector.Request;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.Broadcaster;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Groups;
import de.tubs.age.jpa.Item;
import de.tubs.age.jpa.Player;
import de.tubs.age.util.GameLoader;
import de.tubs.age.util.Instance;
import de.tubs.age.util.InstancePlayer;

public class LongPolling  extends Comet {
	private ArrayList users;
	@Override
	protected void init(AtmosphereResource<HttpServletRequest, HttpServletResponse> event) throws IOException {
		HttpServletRequest req = event.getRequest();
		
        InstancePlayer instancePlayer = (InstancePlayer) req.getSession().getAttribute("InstancePlayer");
    	boolean loadGame = Boolean.parseBoolean(req.getParameter("loadGame").trim());
    	 	
        if(instancePlayer == null){
        	System.out.println("###### LongPolling  instancePlayer is NULL.");
        	String key = req.getParameter("key").trim();
        	Instance instance = GameLoader.loadInstance(key);
        	if(instance != null){
        		System.out.println("###### LongPolling  instancePlayer is NULL and instance is NOT NULL sende init data.");
        		InstancePlayer ip = new InstancePlayer(instance);
        		req.getSession().setAttribute("InstancePlayer", ip);
        		sendInitData(ip,event,loadGame);
        		
        	}else{
        		System.out.println("###### LongPolling instnce ist NULL (Instance mit key="+key+" wurde nicht gefunden).");
        	}
        }else{
        	System.out.println("###### LongPolling  instancePlayer is NOT NULL sende init data.");
        	sendInitData(instancePlayer,event,loadGame);
        }		
		
	}

	@Override
	protected void onMessage(AtmosphereResource<HttpServletRequest, HttpServletResponse> event) throws IOException {
		HttpServletRequest req = event.getRequest();
        HttpServletResponse res = event.getResponse();
		InstancePlayer instancePlayer = (InstancePlayer) req.getSession().getAttribute("InstancePlayer");
        if(instancePlayer!=null){
			String action = ""+req.getParameter("action");
			String response="";
			if(action.equalsIgnoreCase("chat")){
				String msg = req.getParameter("msg");
				String from = req.getParameter("from");
				response="{n:'chat',v:{from:'"+from+"',msg:'"+msg+"'}}";
				event.getBroadcaster().broadcast(response);
			}else if(action.equalsIgnoreCase("m")){
				Game game = instancePlayer.getInstance().getGame();
				int x = convertToInt(req.getParameter("x"));
			    int y = convertToInt(req.getParameter("y"));
			    int w = convertToInt(req.getParameter("w"));
			    int h = convertToInt(req.getParameter("h"));
			    String isItem = ""+req.getParameter("isItm");
			   
				int item = convertToInt(req.getParameter("i"));
				int  player = convertToInt(req.getParameter("p"));
				String dom = req.getParameter("dom");
				if(isItem.equals("false"))	game.setItemPosition(x,y,item);
				else  game.setGroupPosition(x,y,item);
				response="{n:'m',v:{i:"+item+",pos:{x:"+x+",y:"+y+",dom:'"+dom+"',w:"+w+",h:"+h+"},player:"+player+"}}";
				event.getBroadcaster().broadcast(response);
			}else if(action.equalsIgnoreCase("ping")){
				response="{n:'pong'}";
				PrintWriter writer = res.getWriter();
				writer.write(getResponse(response));
				writer.flush();
				System.out.println("###### LongPolling.onMessage(ping).");
			}else if(action.equalsIgnoreCase("random")){
				int id = convertToInt(req.getParameter("grp"));
			//	String plyer_name = req.getParameter("p");
				System.out.println("###### LongPolling.onMessage(random). id:"+id);
				if(id>0){
					Game game = instancePlayer.getInstance().getGame();
					List<Groups> groups = game.getResourcen();
					for (Groups group : groups) {
						System.out.println("###### LongPolling.onMessage(random). group id"+group.getId());
						if(group.getId()==id && group.isRandomgenerator()){
							List<Item> items = group.getItems();
							int item_index = (int)(Math.floor(Math.random()*1000000))%items.size();
							Item item = items.get(item_index);
							response="{n:'r',v:{grp:"+id+",itm:"+item.getId()+"}}";
							event.getBroadcaster().broadcast(response);
						}
					}
				}
			}else if(action.equalsIgnoreCase("v")){
				//'action=v&i='+this.id+'&dom='+domid+'&player='+player_name+'&v=true'
				Game game = instancePlayer.getInstance().getGame();
				boolean visibility = Boolean.parseBoolean(req.getParameter("v"));
				int id = convertToInt(req.getParameter("i"));
				String domid = req.getParameter("dom");
				String player = req.getParameter("player");				
				String image_name="";
				if(visibility){
					Item item = game.getItem(id);
					if(item != null) image_name=item.getStyle().getBgImageName();
				}			
				response="{n:'v',v:{itm:"+id+",player:'"+player+"',domid:'"+domid+"',v:"+visibility+",img:'"+image_name+"'}}";
				System.out.println("### LongPolling.onmessage visibility: response:"+response);
				event.getBroadcaster().broadcast(response);
			}
        }
		
		
	}
	private void sendInitData(InstancePlayer instancePlayer, AtmosphereResource<HttpServletRequest, HttpServletResponse> event, boolean loadGame) throws IOException{

		HttpServletResponse res = event.getResponse();	
		String gameJSON = "";
		if(loadGame) gameJSON = ",game:"+instancePlayer.getInstance().getGame().toJSON();
		
		Player player = instancePlayer.getPlayer();		
		PrintWriter writer = res.getWriter();
		String response = "";

		if(player != null){
			String playerJSON = player.toJSON();
			String broadcast="{n:'j',v:{player:"+playerJSON+"}}";
			response="{n:'init',v:{status:1,player:"+playerJSON+gameJSON+"}}";
			System.out.println("LongPoling.sendInitData: "+response);
			event.suspend(-1);
    		Broadcaster bc = event.getBroadcaster();
    		bc.broadcast(broadcast);
		}else{
			response="{n:'init',v:{status:0,msg:'Es wurde keine Player zugewissen!!!'}}";
		}
		writer.write(getResponse(response));
		writer.flush();
	}
	
	
	/*
	@Override
    protected String getBeginScriptTag(){
    	return "";
    }
    @Override
    protected String getEndScriptTag(){
    	return "";
    }
    @Override
    protected String getOnMessageMethod(String data){
    	
    	return  data;
    }
*/
}
