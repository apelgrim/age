package de.tubs.age.blocking;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.BroadcastFilter;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.plugin.cluster.jgroups.JGroupsFilter;


import de.tubs.age.util.AgeActionHandler;
import de.tubs.age.util.GameLoader;
import de.tubs.age.util.Instance;
import de.tubs.age.util.InstancePlayer;

public class LongPolling  extends Comet {

	
	protected void init(AtmosphereResource<HttpServletRequest, HttpServletResponse> event) throws IOException {
		
		HttpServletRequest req = event.getRequest();
		String key = (""+req.getParameter("key")).trim();
		System.out.println("\n\n\n#### GET START key:"+key+" ###");
        InstancePlayer instancePlayer = (InstancePlayer) req.getSession().getAttribute("InstancePlayer");
        Instance instance = GameLoader.loadInstance(key);
        System.out.println("LongPolling.init instancePlayer null?"+(instancePlayer==null)+" ");	
        if(instancePlayer == null){
        //	System.out.println("###### LongPolling  instancePlayer is NULL und wird in der session gespeichert.#########");
        	
        	
        	if(instance != null){
        	//	System.out.println("LongPolling   instance mit seq "+Instance.instance_seq+" sende init data.");
        		InstancePlayer ip = new InstancePlayer(instance);
        		req.getSession().setAttribute("InstancePlayer", ip);
        		sendInitData(ip,event);
        		
        	}else{
        		System.out.println("LongPolling instnce ist NULL (Instance mit key="+key+" wurde nicht gefunden).");
        	}
        }else{
        //	System.out.println("###### LongPolling  instancePlayer wird von session geholt  sende init data.#####");
        	instancePlayer.setInstance(instance);
        	sendInitData(instancePlayer,event);
        }		
		
	}

	@Override
	protected void onMessage(AtmosphereResource<HttpServletRequest, HttpServletResponse> event) throws IOException {
		HttpServletRequest req = event.getRequest();
        HttpServletResponse res = event.getResponse();
		InstancePlayer instancePlayer = (InstancePlayer) req.getSession().getAttribute("InstancePlayer");
		System.out.print("onMessage instancePlayer null?"+(instancePlayer==null)+" ");
        if(instancePlayer!=null){
            AgeActionHandler ageAction = new AgeActionHandler(req, instancePlayer);
            if(ageAction.getType() == AgeActionHandler.TYPE_BROADCAST) event.getBroadcaster().broadcast(ageAction.getResponse());
            else if(ageAction.getType() == AgeActionHandler.TYPE_RESPONSE){
            	PrintWriter writer = res.getWriter();
				writer.write(getResponse(ageAction.getResponse()));
				writer.flush();
            }
            
            if(ageAction.getPhase()==AgeActionHandler.PHASE_CLOSE) event.getBroadcaster().destroy();
        }		
	}
	private void sendInitData(InstancePlayer instancePlayer, AtmosphereResource<HttpServletRequest, HttpServletResponse> event) throws IOException{

		HttpServletResponse res = event.getResponse();	
		PrintWriter writer = res.getWriter();
		AgeActionHandler ageAction = new AgeActionHandler(instancePlayer);
		ageAction.actionJoin(event.getRequest());
		writer.write(getResponse(ageAction.getResponse()));
		writer.flush();
		
		if(ageAction.getType()==AgeActionHandler.TYPE_BROADCAST_RESPONSE){
            event.suspend(-1);
    		Broadcaster bc = event.getBroadcaster();
    	//	bc.getBroadcasterConfig().addFilter((BroadcastFilter)(new JGroupsFilter(bc, event.getRequest().getParameter("key").trim())));
    	//	instancePlayer.getInstance().setBroadcaster(bc);
    		bc.broadcast(ageAction.getrBroadcast());
    		bc.scheduleFixedBroadcast("{n:'ping',v:'pong'}", 30, TimeUnit.SECONDS);
		}	
		
	}

	@Override
	public void onRequest(
			AtmosphereResource<HttpServletRequest, HttpServletResponse> atmoResource)
			throws IOException {
		// TODO Auto-generated method stub
		
	}
}
