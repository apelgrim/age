package de.tubs.age.util;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

public class SessionListener implements HttpSessionListener {

	@Override
	public void sessionCreated(HttpSessionEvent event) {
		 HttpSession session = event.getSession();
		 session.setMaxInactiveInterval(1);
		 System.out.println("#AGE SessionListener.sessionCreated session.setMaxInactiveInterval(1)");
		
		
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent event) {
		InstancePlayer instancePlayer = (InstancePlayer)event.getSession().getAttribute("InstancePlayer");
		if(instancePlayer!=null){
		//	instancePlayer.getInstance().getBroadcaster().broadcast("{n:'leave',v:"+instancePlayer.getPlayer().getId()+"}");
			instancePlayer.destroy();		
		}
		System.out.println("#AGE SessionListener.sessionDestroyed");
		
	}

}
