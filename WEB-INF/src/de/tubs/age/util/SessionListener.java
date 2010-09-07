package de.tubs.age.util;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

public class SessionListener implements HttpSessionListener {

	@Override
	public void sessionCreated(HttpSessionEvent event) {
		System.out.println("SessionListener.sessionCreated");
		
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent event) {
		InstancePlayer instancePlayer = (InstancePlayer)event.getSession().getAttribute("InstancePlayer");
		if(instancePlayer!=null) instancePlayer.destroy();
		System.out.println("SessionListener.sessionDestroyed");
		
	}

}
