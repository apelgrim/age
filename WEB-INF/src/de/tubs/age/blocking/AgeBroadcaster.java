package de.tubs.age.blocking;

import java.util.Iterator;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.DefaultBroadcaster;

public class AgeBroadcaster extends DefaultBroadcaster{
	private String key;
	public AgeBroadcaster(){
		System.out.println("AgeBroadcaster()");
	}
	public AgeBroadcaster(String key){
		System.out.println("AgeBroadcaster(key)");
		this.key = key;
	}
   public ConcurrentLinkedQueue<AtmosphereResource<?,?>> getEvents(){
	   return events;
   }
   public void printEvents(){
	   ConcurrentLinkedQueue<AtmosphereResource<?,?>> events = getEvents();
	   for (Iterator iterator = events.iterator(); iterator.hasNext();) {
		AtmosphereResource<?, ?> atmosphereResource = (AtmosphereResource<?, ?>) iterator
				.next();

		System.out.println("printEvents");
	}
   }
public String getKey() {
	return key;
}
public void setKey(String key) {
	this.key = key;
}
   
}
