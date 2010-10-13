package de.tubs.age.blocking;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.logging.Logger;

import org.atmosphere.cpr.Broadcaster;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.atmosphere.cpr.AtmosphereHandler;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.handler.AbstractReflectorAtmosphereHandler;
import org.atmosphere.util.LoggerUtils;

import de.tubs.age.util.InstancePlayer;

public abstract class Comet implements AtmosphereHandler<HttpServletRequest, HttpServletResponse>{//extends AbstractReflectorAtmosphereHandler{ //
	protected final static String CLUSTER = "org.atmosphere.useCluster";
	public final static String BEGIN_SCRIPT_TAG = "\n<script type='text/javascript'>\n";
	public final static String END_SCRIPT_TAG = "\n</script>\n"; //GameManager.connector.onmessage
	public final static String ON_MESSAGE_METHOD = "window.parent.GameManager.connector.onmessage(DATA);";
	public final static int PING_PONG_TIMEOUT = 70000;
	public final static int PING_PONG_INTERVAL = 10;
	protected AtomicBoolean filterAdded = new AtomicBoolean(false);
	protected static final Logger logger = LoggerUtils.getLogger();
	public Comet() {

	}
	public abstract void onRequest(AtmosphereResource<HttpServletRequest, HttpServletResponse> atmoResource) 
																						throws IOException;
	
	@Override
	 public void onStateChange(AtmosphereResourceEvent<HttpServletRequest, HttpServletResponse> event) 
																					throws IOException {

    if (event.isCancelled()) {
    	System.out.println("\n\n###### Comet.onStateChange. event is Canceled\n\n");
        return;
    }
    if (!event.isResumedOnTimeout()) {
       
       
    	String response = (String) event.getMessage();
        PrintWriter writer = event.getResource().getResponse().getWriter();
        if(writer != null){
	        writer.write(response);
	        writer.flush();
        }
       
    }else{
    	System.out.println("\n\n####Comet.onStateChange. event.isResumedOnTimeout()\n\n");
    }
	 }

	protected String prepareResponse(String response){
		return getBeginScriptTag()+getOnMessageMethod(response)+getEndScriptTag();
	}
	protected String toJSON(String name, String message) {
		String msg = message.replaceAll( "\'","'" );
		msg=msg.replaceAll("\\\\","" );
		return "{n:\""+name+"\",v:\""+msg+"\"}";
	}
    protected String getBeginScriptTag(){
    	return BEGIN_SCRIPT_TAG;
    }
    protected String getEndScriptTag(){
    	return END_SCRIPT_TAG;
    }
    protected String getOnMessageMethod(String data){
    	
    	return ON_MESSAGE_METHOD.replaceAll("DATA", data);
    }
	protected  int convertToInt(String param){
		   int i = 0;
		   try{ i = Integer.parseInt(param);}
		   catch(Exception e){}  
		   return i;
	}
}
