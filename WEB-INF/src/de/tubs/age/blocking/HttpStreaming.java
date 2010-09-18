
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
import java.util.concurrent.TimeUnit;
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
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.cpr.DefaultBroadcaster;
import org.atmosphere.plugin.cluster.jgroups.JGroupsFilter;
import org.atmosphere.util.XSSHtmlFilter;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Player;
import de.tubs.age.jpa.manager.GameManager;
import de.tubs.age.util.AgeActionHandler;
import de.tubs.age.util.GameLoader;
import de.tubs.age.util.Instance;
import de.tubs.age.util.InstancePlayer;

public class HttpStreaming extends Comet {
	
	@Override
	protected void init(AtmosphereResource<HttpServletRequest, HttpServletResponse> event) throws IOException {
		
		HttpServletRequest req = event.getRequest();
		String key = (""+req.getParameter("key")).trim();
		System.out.println("\n\n\n#### GET START key:"+key+" ###");
        InstancePlayer instancePlayer = (InstancePlayer) req.getSession().getAttribute("InstancePlayer");
        Instance instance = GameLoader.loadInstance(key);
        System.out.println("+++ LongPolling.init INSTANCEPLAYER NULL?"+(instancePlayer==null)+" ");	
        if(instancePlayer == null){
        //	System.out.println("###### LongPolling  instancePlayer is NULL und wird in der session gespeichert.#########");
        	
        	
        	if(instance != null){
        	//	System.out.println("LongPolling   instance mit seq "+Instance.instance_seq+" sende init data.");
        		InstancePlayer ip = new InstancePlayer(instance);
        		ip.setKey(key);
        		req.getSession().setAttribute("InstancePlayer", ip);
        		join(ip,event);
        		
        	}else{
        		System.out.println("LongPolling instnce ist NULL (Instance mit key="+key+" wurde nicht gefunden).");
        	}
        }else{
        //	System.out.println("###### LongPolling  instancePlayer wird von session geholt  sende init data.#####");
        	instancePlayer.setInstance(instance);
        	join(instancePlayer,event);
        }		
		
	}

	@Override
	protected void onMessage(AtmosphereResource<HttpServletRequest, HttpServletResponse> event) throws IOException {
		HttpServletRequest req = event.getRequest();
        HttpServletResponse res = event.getResponse();
		InstancePlayer instancePlayer = (InstancePlayer) req.getSession().getAttribute("InstancePlayer");
		System.out.print("+++ ONMESSAGE INSTANCEPLAYER NULL?"+(instancePlayer==null)+" ");
        if(instancePlayer!=null){
        	System.out.println("\n\n\n#### POST  key:"+instancePlayer.getKey()+" ###");
            AgeActionHandler ageAction = new AgeActionHandler(req, instancePlayer);
            if(ageAction.getType() == AgeActionHandler.TYPE_BROADCAST){
            //	Broadcaster dbc = ;
            	broadcast(event.getBroadcaster(),ageAction.getResponse());
            } 
            else if(ageAction.getType() == AgeActionHandler.TYPE_RESPONSE){
            	PrintWriter writer = res.getWriter();
				writer.write(getResponse(ageAction.getResponse()));
				writer.flush();
            }
            
            if(ageAction.getPhase()==AgeActionHandler.PHASE_CLOSE) event.getBroadcaster().destroy();
        }		
	}
	private void join(InstancePlayer instancePlayer, AtmosphereResource<HttpServletRequest, HttpServletResponse> event) throws IOException{

		HttpServletResponse res = event.getResponse();	
		PrintWriter writer = res.getWriter();
		AgeActionHandler ageAction = new AgeActionHandler(instancePlayer);
		ageAction.actionJoin(event.getRequest());
		writer.write(getResponse(ageAction.getResponse()));
		writer.flush();
		
		if(ageAction.getType()==AgeActionHandler.TYPE_BROADCAST_RESPONSE){
			String clusterType = event.getAtmosphereConfig().getInitParameter(CLUSTER);
			System.out.println("clusterType:"+clusterType);
			
//			BroadcasterFactory bf = event.getAtmosphereConfig().getBroadcasterFactory();
//			bf.add(new AgeBroadcaster(instancePlayer.getKey()), instancePlayer.getKey());
//			AgeBroadcaster dbc = null;
//			try {
//				dbc = (AgeBroadcaster) bf.get(AgeBroadcaster.class, instancePlayer.getKey());
//				dbc.setKey(instancePlayer.getKey());
//				dbc.getBroadcasterConfig().addFilter((BroadcastFilter)(new InstanceFilter(dbc,instancePlayer.getKey())));
//			} catch (IllegalAccessException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (InstantiationException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
    //		new JMSFilter(dbc, instancePlayer.getKey());
    		Broadcaster dbc = event.getBroadcaster();
    		dbc.getBroadcasterConfig().addFilter((BroadcastFilter)(new JGroupsFilter(dbc, instancePlayer.getKey())));
			event.suspend();
//    		BroadcasterFactory bf = BroadcasterFactory.getDefault();
//    		Broadcaster dbc = bf.lookup(DefaultBroadcaster.class, instancePlayer.getKey(), true);
//    		dbc.addAtmosphereResource(event);
    	
    	//	bc.setScope(Broadcaster.SCOPE.REQUEST);
    		
    		
    	/*	System.out.println("\n\n\nHTTPStreaming Broadcaster: "+bc.getID());
    		for (Iterator iterator = bc.getAtmosphereResources().iterator(); iterator.hasNext();) {
    			AtmosphereResource<HttpServletRequest, HttpServletResponse> ar = (AtmosphereResource<HttpServletRequest, HttpServletResponse>) iterator.next();
    			System.out.println("bc.getAtmosphereResources():"+ar.getAtmosphereResourceEvent().getMessage());
    			
				
			}
    		System.out.println("######\n\n");
    		*/
    	
    		
    		broadcast(dbc, ageAction.getrBroadcast());
    		
    	//	dbc.scheduleFixedBroadcast("{n:'ping',v:'pong'}", 30, TimeUnit.SECONDS);
    		
		}	
		
	}
}