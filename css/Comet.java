package de.tubs.age.blocking;

import java.io.IOException;
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
import de.tubs.age.jpa.manager.GameManagerUtil;
import de.tubs.age.util.GameLoader;

public class Comet implements
		AtmosphereHandler<HttpServletRequest, HttpServletResponse> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final static String BEGIN_SCRIPT_TAG = "<script type='text/javascript'>\n";
	private final static String END_SCRIPT_TAG = "</script>\n";
	private final static String CLUSTER = "org.atmosphere.useCluster";

	private AtomicBoolean filterAdded = new AtomicBoolean(false);

	private static int count = 0;
	private static Map<Integer, String> items = new HashMap<Integer, String>();

	private static Log log = LogFactory.getLog(Comet.class);

	public Comet() {
	}

	public void destroy() {
		// TODO Auto-generated method stub

	}

	private void setHeader(HttpServletResponse res) {
		// res.setContentType("text/html;charset=ISO-8859-1");
		res.setCharacterEncoding("UTF-8");
		res.addHeader("Cache-Control", "private");
		res.addHeader("Pragma", "no-cache");
	}



	public void onRequest(
			AtmosphereResource<HttpServletRequest, HttpServletResponse> event)
			throws IOException {
		HttpServletRequest req = event.getRequest();
		HttpServletResponse res = event.getResponse();
		setHeader(res);
		if (req.getMethod().equalsIgnoreCase("GET")) {
			System.out.println("#### GET");
			event.suspend();

		//	int id = getUserId(req);

			Broadcaster bc = event.getBroadcaster();
			String clusterType = event.getAtmosphereConfig().getInitParameter(
					CLUSTER);
			if (!filterAdded.getAndSet(true) && clusterType != null) {
				if (clusterType.equals("jgroups")) {
					event.getAtmosphereConfig().getServletContext()
							.log("JGroupsFilter enabled");
				}
			}
			String key = req.getParameter("id");
			
		    Game game = GameLoader.loadGame(key);
		    Player player= (Player) req.getSession().getAttribute("player");
			if(player == null){ 
				
				player = game.addPlayer("none");
				req.getSession().setAttribute("player",player);
			//	System.out.println("#### (id <= 0) meine id:" +  player.getId());
			}
			else game.getPlayers().add(player);
			
			//parent.GameManager.connector.onmessage({n:\"init\",v:"+id+"})
			res.getWriter().write("<script type='text/javascript'>parent.GameManager.connector.onmessage({n:\"init\",v:"+game.toJSON()+",p_id:"+player.getId()+"})</script>");
		//	log.info("Sende: <script type='text/javascript'>parent.GameManager.connector.onmessage({n:\"init\",v:"+id+"})</script>");
			res.getWriter().flush();
			System.out.println("#### Sende: <script type='text/javascript'>parent.GameManager.connector.onmessage({n:\"init\",v:"+game.toJSON()+"})</script>");
			// Simple Broadcast
			bc.getBroadcasterConfig().addFilter(new XSSHtmlFilter());
			Future<Object> f = bc.broadcast("j**{id:" + player.getId() + "}");
//			System.out.println("#### Sende... j**{id:" + id + ","+ items.get(id) + "}");
			
		//	log.info("Sende... j**{id:" + id + ","+ items.get(id) + "}");

			try {
				// Wait for the push to occurs. This is blocking a thread as the
				// Broadcast operation
				// is usually asynchronous, e.g executed using an {@link
				// ExecuturService}
				f.get();
			} catch (InterruptedException ex) {
				log.info(ex);
			} catch (ExecutionException ex) {
				log.info(ex);
			}

			// Ping the connection every 30 seconds
			// bc.scheduleFixedBroadcast(req.getRemoteAddr() +
			// "**is still listening", 30, TimeUnit.SECONDS);

			// Delay a message until the next broadcast.
			// bc.delayBroadcast("Delayed Chat message");
		} else if (req.getMethod().equalsIgnoreCase("POST")) {
			// String action = req.getParameterValues("action")[0];
			// String name = req.getParameterValues("name")[0];
			String m = req.getParameter("m");
			String id = req.getParameter("id");
		//	System.out.println("#### POST m**{id:" + id + ",pos:" + m + "}");
			
			if (id != null && m != null) {
				// log.info("id:"+id+", m:"+pos);
				event.getBroadcaster().broadcast(
						"m**{id:" + id + ",pos:" + m + "}");
				
			} else {
				// log.info("res.setStatus(422)");
				res.setStatus(422);
			}
			/*
			 * if ("login".equals(action)) {
			 * req.getSession().setAttribute("name", name);
			 * event.getBroadcaster().broadcast("System Message from " +
			 * event.getAtmosphereConfig().getWebServerName() + "**" + name +
			 * " has joined.");
			 * 
			 * } else if ("post".equals(action)) { String message =
			 * req.getParameterValues("message")[0];
			 * event.getBroadcaster().broadcast(name + "**" + message); } else {
			 * res.setStatus(422); }
			 */
			// res.getWriter().write("success");
			res.getWriter().flush();
		}
		else{
			System.out.println("#### ERROR KEINE POST UND GET");
			
		}

	}

	private String getALlItemsExcept(int id) {
		String out = "";
		Set<Map.Entry<Integer, String>> itemsValues = items.entrySet();
		Iterator<Map.Entry<Integer, String>> itemsIterator = itemsValues
				.iterator();
		boolean first = true;
		while (itemsIterator.hasNext()) {
			Map.Entry<Integer, String> item = itemsIterator.next();
			Integer _id = item.getKey();
			String data = item.getValue();
			if (_id.intValue() != id) {
				if (first) {
					out += "{id:" + _id + "," + data + "}";
					first = false;
				} else {
					out += ",{id:" + _id + "," + data + "}";
				}

			}
		}
		return out;
	}

	public void onStateChange(
			AtmosphereResourceEvent<HttpServletRequest, HttpServletResponse> event)
			throws IOException {
		HttpServletRequest req = event.getResource().getRequest();
		HttpServletResponse res = event.getResource().getResponse();

		if (event.getMessage() == null)
			return;

		String e = event.getMessage().toString();

		String name = e;
		String message = "";

		if (e.indexOf("**") > 0) {
			name = e.substring(0, e.indexOf("**"));
			message = e.substring(e.indexOf("**") + 2);
		}

		String msg = BEGIN_SCRIPT_TAG + toJsonp(name, message) + END_SCRIPT_TAG;
//		System.out.println("### sende: "+msg);
		if (event.isCancelled()) {
			event.getResource()
					.getBroadcaster()
					.broadcast(
							req.getSession().getAttribute("name") + " has left");
		} else if (event.isResuming() || event.isResumedOnTimeout()) {
			// String script = "<script>window.parent.app.listen();\n</script>";

			// res.getWriter().write(script);
		} else {
			
			res.getWriter().write(msg);
		}
		res.getWriter().flush();

	}

	private String toJsonp(String name, String message) {
		String msg = message.replaceAll( "\'","'" );
		msg=msg.replaceAll("\\\\","" );
		
		return "window.parent.app.update({ n: \"" + name
				+ "\", v: \"" + msg + "\" });\n";
	}
}
