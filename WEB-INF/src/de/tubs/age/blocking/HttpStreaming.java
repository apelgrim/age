
package de.tubs.age.blocking;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.TimeUnit;


import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.cpr.AtmosphereResource;

import de.tubs.age.util.AgeActionHandler;
import de.tubs.age.util.GameLoader;
import de.tubs.age.util.Instance;
import de.tubs.age.util.InstancePlayer;

public class HttpStreaming extends Comet {
	
	
	
	@Override
	public void onRequest(AtmosphereResource<HttpServletRequest, HttpServletResponse> atmoResource) throws IOException{
		 
		HttpServletRequest req = atmoResource.getRequest();
		InstancePlayer instancePlayer = (InstancePlayer) req.getSession().getAttribute("InstancePlayer");
		if (req.getMethod().equalsIgnoreCase("GET")) {
			 init(atmoResource,instancePlayer);
		 } else if (req.getMethod().equalsIgnoreCase("POST")) {
			 if(instancePlayer != null) executeAgeAction(new AgeActionHandler(atmoResource, instancePlayer));
		 }	
	}
	
	private void init(AtmosphereResource<HttpServletRequest, HttpServletResponse> atmoResource, InstancePlayer instancePlayer) throws IOException {
		HttpServletRequest req = atmoResource.getRequest();    
        HttpSession session = req.getSession();
        String key = req.getParameter("key");   
        if(key != null){
        	key = key.trim();
        	try {
        		Instance instance = loadInstance(atmoResource.getAtmosphereConfig().getServletContext(),key);
	        	
	            if(instance != null){
	               
	            	Broadcaster bc = instance.getBroadcaster();
		        	if(bc == null){
		        		bc=BroadcasterFactory.getDefault().get(AgeBroadcaster.class, key);
		        	//	bc=BroadcasterFactory.getDefault().get();
		        	}
		        	System.out.println("\n++++++ INIT SESION ID:"+req.getSession().getId()+"\n");
	                
	                InstancePlayer ip = instancePlayer;
		       			if(ip == null){   
		       			//	atmoResource.resume();
		             	    ip = new InstancePlayer(instance);
		             	    ip.setKey(key);
		             		session.setAttribute("InstancePlayer",ip);
				        }else{
				             ip.setInstance(instance);
				        }
		       			ip.addAtmosphereResource(atmoResource);
		       			instance.addInstancePlayer(ip);
		       			atmoResource.setBroadcaster(bc);
		       			bc.addAtmosphereResource(atmoResource);
		       			
		                instance.setBroadcaster(bc);  
		               
		                ip.addAtmosphereResource(atmoResource);
	       			    executeAgeAction(new AgeActionHandler(atmoResource, ip));
	       			 
	                 	
	            }else logger.severe("Game Instance mit key:"+key+" wurde nicht gefunden.");      	
	        	
        	} catch (Throwable t){
//        		HttpServletResponse res = atmoResource.getResponse();	
//    			PrintWriter writer = res.getWriter();    			
//    			writer.write(prepareResponse("{n:'error',v='"+t+"'}"));
//    			writer.flush();
                 throw new IOException(t);
            }            
        }else logger.severe("Key ist nicht definiert.");      
	}

	private Instance loadInstance(ServletContext servletContext, String key) {
		Instance instance =  (Instance) servletContext.getAttribute(key);
    	if(instance == null) {
    		instance = GameLoader.loadInstance(key);
    		servletContext.setAttribute(key, instance);
    	}
    	return instance;
	}

	private void executeAgeAction(AgeActionHandler ageActionHandler) throws IOException {
		Instance gameInstance = ageActionHandler.getInstancePlayer().getInstance();

		
		if(ageActionHandler.getPhase() == AgeActionHandler.PHASE_JOIN){
			
			/* suspend the connection */
			ageActionHandler.getAtmosphereResource().suspend();
			
			HttpServletResponse res = ageActionHandler.getAtmosphereResource().getResponse();	
			PrintWriter writer = res.getWriter();
			
			
			writer.write(prepareResponse(ageActionHandler.getResponse()));
			writer.flush();
			
	//		gameInstance.getBroadcaster().scheduleFixedBroadcast(prepareResponse("{n:'ping',v:'pong'}"), Comet.PING_PONG_INTERVAL, TimeUnit.SECONDS);
             
			
			if(ageActionHandler.getType()==AgeActionHandler.TYPE_BROADCAST_RESPONSE){
				gameInstance.broadcast(prepareResponse(ageActionHandler.getrBroadcast()),false);
			}
			
			ageActionHandler.getInstancePlayer().getPlayer().notifyPongTime();
			
		}else if(ageActionHandler.getPhase() == AgeActionHandler.PHASE_ONMESSAGE){
			HttpServletResponse res = ageActionHandler.getAtmosphereResource().getResponse();
			if(ageActionHandler.getType() == AgeActionHandler.TYPE_BROADCAST){
				gameInstance.broadcast(prepareResponse(ageActionHandler.getResponse()),true);
	        } 
	        else if(ageActionHandler.getType() == AgeActionHandler.TYPE_RESPONSE){      	   	
	            	PrintWriter writer = res.getWriter();
					writer.write(ageActionHandler.getResponse());
					writer.flush();
				//	System.out.println("+++AgeActionHandler.TYPE_RESPONSE: "+prepareResponse(ageActionHandler.getResponse()));
	        }else if(ageActionHandler.getType()==AgeActionHandler.TYPE_BROADCAST_RESPONSE){
	        	PrintWriter writer = res.getWriter();
				writer.write(ageActionHandler.getResponse());
				writer.flush();
				gameInstance.broadcast(prepareResponse(ageActionHandler.getrBroadcast()),false);
	        	
			}
		}else if(ageActionHandler.getPhase() == AgeActionHandler.PHASE_CLOSE){
			if(ageActionHandler.getType()==AgeActionHandler.TYPE_BROADCAST){
				gameInstance.broadcast(prepareResponse(ageActionHandler.getResponse()),false);
				ageActionHandler.getAtmosphereResource().resume();	
				gameInstance.getBroadcaster().removeAtmosphereResource(ageActionHandler.getAtmosphereResource());		
			}	
		}		
	}

	
}