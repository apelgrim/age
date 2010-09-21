package de.tubs.age.blocking;


import javax.servlet.http.HttpServletRequest;

import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.DefaultBroadcaster;


public class AgeBroadcaster extends DefaultBroadcaster{

	
	public AgeBroadcaster(){
		
	}
	public void printEventsWithSessionID(){
		System.out.println("AgeBroadcaster :printEventsWithSessionID() size"+events.size());
		for (AtmosphereResource<?,?> r : events) {
			HttpServletRequest req = (HttpServletRequest) r.getRequest();
			System.out.println("AtmosphereResource : ID-"+req.getSession().getId());
		}
	}
	
	

}
