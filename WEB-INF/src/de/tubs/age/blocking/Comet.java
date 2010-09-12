package de.tubs.age.blocking;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.atmosphere.cpr.AtmosphereHandler;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;

public abstract class Comet implements

AtmosphereHandler<HttpServletRequest, HttpServletResponse>{
	protected final static String CLUSTER = "org.atmosphere.useCluster";
	protected final static String BEGIN_SCRIPT_TAG = "<script type='text/javascript'>\n";
	protected final static String END_SCRIPT_TAG = "</script>\n"; //GameManager.connector.onmessage
	protected final static String ON_MESSAGE_METHOD = "window.parent.GameManager.connector.onmessage(DATA);";
	public Comet() {
	}
	
	
	protected abstract void init(AtmosphereResource<HttpServletRequest, HttpServletResponse> event)  throws IOException;
	protected abstract void onMessage(AtmosphereResource<HttpServletRequest, HttpServletResponse> event) throws IOException;
	
	
	
	protected void setHeader(HttpServletResponse res) {
	       res.setContentType("text/html");
	        res.addHeader("Cache-Control", "private");
	        res.addHeader("Pragma", "no-cache");
	        res.setContentType("text/html;charset=ISO-8859-1");
	}

	@Override
	public void onRequest(
			AtmosphereResource<HttpServletRequest, HttpServletResponse>  event)
			throws IOException {
		HttpServletRequest req = event.getRequest();
		setHeader(event.getResponse());
		 if (req.getMethod().equalsIgnoreCase("GET")) {
			 init(event);
		 } else if (req.getMethod().equalsIgnoreCase("POST")) {
			 onMessage(event);
		 }
		    
		
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
	@Override
	public void onStateChange(
			AtmosphereResourceEvent<HttpServletRequest, HttpServletResponse>  event)
			throws IOException {
	//	    onMessage(event);
		 // Client closed the connection.
        if (event.isCancelled()) {
        	System.out.println("Comet.onStateChange. event is Canceled");
            return;
        }
        if (!event.isResumedOnTimeout()) {
            String response = (String) event.getMessage();
            response = getResponse(response);
         //   System.out.println("Response:"+response);
            PrintWriter writer = event.getResource().getResponse().getWriter();
            writer.write(response);
            writer.flush();
      //      event.getResource().resume();
        }else{
        	System.out.println("Comet.onStateChange. event.isResumedOnTimeout()");
        }
		
		
	}
	protected String getResponse(String response){
		return getBeginScriptTag()+getOnMessageMethod(response)+getEndScriptTag();
	}
	protected String toJSON(String name, String message) {
		String msg = message.replaceAll( "\'","'" );
		msg=msg.replaceAll("\\\\","" );
		return "{ n: \"" + name
				+ "\", v: \"" + msg + "\" }";
	}
	protected  int convertToInt(String param){
		   int i = 0;
		   try{ i = Integer.parseInt(param);}
		   catch(Exception e){}  
		   return i;
	   }
}
