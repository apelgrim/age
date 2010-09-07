package de.tubs.age.blocking;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.atmosphere.cpr.AtmosphereHandler;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.BroadcastFilter;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.util.XSSHtmlFilter;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Player;
import de.tubs.age.jpa.manager.GameManager;
import de.tubs.age.util.GameLoader;
import de.tubs.age.util.Instance;
import de.tubs.age.util.InstancePlayer;

public class HttpStreaming extends Comet {
	
	
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
        		sendInitiData(ip,event,loadGame);
        		
        	}else{
        		System.out.println("###### LongPolling instnce ist NULL (Instance mit key="+key+" wurde nicht gefunden).");
        	}
        }else{
        	System.out.println("###### LongPolling  instancePlayer is NOT NULL sende init data.");
        	sendInitiData(instancePlayer,event,loadGame);
        }		
		
	}

	@Override
	protected void onMessage(AtmosphereResource<HttpServletRequest, HttpServletResponse> event) throws IOException {
		
		
		
		
	}
	private void sendInitiData(InstancePlayer instancePlayer, AtmosphereResource<HttpServletRequest, HttpServletResponse> event, boolean loadGame) throws IOException{

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
			event.suspend();
    		Broadcaster bc = event.getBroadcaster();
    		bc.broadcast(broadcast);
		}else{
			response="{n:'init',v:{status:0,msg:'Es wurde keine Player zugewissen!!!'}}";
		}
		writer.write(BEGIN_SCRIPT_TAG+"parent.GameManager.connector.onmessage("+response+")"+END_SCRIPT_TAG);
		writer.flush();
	}

	
}
