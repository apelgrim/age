package de.tubs.age.util;

import java.util.List;

import java.util.concurrent.CopyOnWriteArrayList;

import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.Broadcaster;

import de.tubs.age.blocking.AgeBroadcaster;
import de.tubs.age.blocking.Comet;
import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Player;

public class Instance {
	private Game game;
	private int inactivePlayers;
	private Broadcaster bc;
	private String key;
	public static int instance_seq=0;
	private CopyOnWriteArrayList<InstancePlayer> ip;
	public Instance(Game game){
		this.game = game;
		this.ip = new CopyOnWriteArrayList<InstancePlayer>();
	//	currentPlayers = new ArrayList<Player>();
	//	emptyPlayers = new ArrayList<Player>();
		instance_seq++;
		inactivePlayers=game.getPlayers().size();
	//	for (Player player : game.getPlayers()) {
	//		emptyPlayers.add(player);
	//	}
	}
	public int getPlayersSize(){
		return this.game.getPlayers().size();
	}
	 public List<Player> getPlayers() {
		 return this.game.getPlayers();
	  }
	public int getCurrentPlayersSize(){
		return game.getPlayers().size()-inactivePlayers;
	}
	public synchronized Player newPlayer(){
		if(inactivePlayers>0){
			Player newPlayer = getFreePlayer();
			if(newPlayer!=null){
				newPlayer.setActive(true);
				inactivePlayers--;
				this.game.setActivePlayersSize(getCurrentPlayersSize());
				return newPlayer;
			}
		}
		return null;
		
	}
	private Player getFreePlayer() {
		for (Player player : game.getPlayers()) {
			if(!player.isActive()) return player;
		}
		return null;
	}
	
	public Player findPlayer(int id){
		for (int i = 0; i < game.getPlayers().size(); i++) {
			Player _player = game.getPlayers().get(i);
			if(_player.getId()==id ){
				if(_player.isActive()){
					return _player;
				}
				}
		}
		return null;
	}
	public synchronized boolean removeInstancePlayer(int player_id){
		return removeInstancePlayer(findInstancePlayer(player_id));
		
	}

	private InstancePlayer findInstancePlayer(int player_id) {
		try {
			for (InstancePlayer p : ip) {
				if (p != null && p.getPlayer().getId() == player_id)
					return p;
			}
		} catch (NullPointerException e) {
			return null;
		}
		return null;
	}
	public synchronized boolean removeInstancePlayer(InstancePlayer instancePlayer){
		if(instancePlayer != null){
			this.ip.remove(instancePlayer);
			instancePlayer.destroy();
			return true;
		}
		return false;
		
	}
	public synchronized boolean removePlayer(InstancePlayer instancePlayer){
		if(instancePlayer != null) return removePlayer(instancePlayer.getPlayer().getId());
		else return false;
		
	}
	public synchronized boolean removePlayer(int player_id){
		for (int i = 0; i < game.getPlayers().size(); i++) {
			Player _player = game.getPlayers().get(i);
			if(_player.getId()==player_id){
				if(_player.isActive()){
					System.out.println("\nPlayer mit id "+player_id+" wurde entfert");
					inactivePlayers++;
					_player.setActive(false);				
					this.game.setActivePlayersSize(getCurrentPlayersSize());
					return true;
				}
			}
		}
		
		return false;
    }
	public Game getGame() {
		return game;
	}
	public void setGame(Game game) {
		this.game = game;
	}
//	@Override
//	protected void finalize(){
//		
//	}
	public Broadcaster getBroadcaster(){
		if(bc != null) System.out.println("Instance. getBroadcaster(). res size:"+bc.getAtmosphereResources().size());
		return bc;
	}
	public void setBroadcaster(Broadcaster bc) {
		if(this.bc == null){
			System.out.println("Instance. setBroadcaster()"+bc);
			this.bc =  bc;
		}
		System.out.println("Instance. print all events resource:####");
		((AgeBroadcaster) this.bc).printEventsWithSessionID();
		
	}
	public String getKey() {
		return this.key;
	}
	public void setKey(String key) {
		this.key = key;
		
	}
	public void addAtmosphereResource(AtmosphereResource<HttpServletRequest, HttpServletResponse> atmoResource) {
		if(bc != null) bc.addAtmosphereResource(atmoResource);
	}
	public void broadcast(String msg, boolean delay) {
//		System.out.println("\n### INSTANCE.broadcast msg:"+msg+" bc SCOPE:"+bc.getScope().toString()+" ++ ID:"+bc.getID()+"  bc.getAtmosphereResources().size:"+bc.getAtmosphereResources().size()+"\n");
//		Future<Object> f = bc.delayBroadcast(msg, 70, TimeUnit.MILLISECONDS);
		if(delay) bc.delayBroadcast(msg, 70, TimeUnit.MILLISECONDS);
		else bc.broadcast(msg);

		
//		try {
//			f.get();
//		} catch (InterruptedException e) {
//			System.out.println("ERROR: INSTANCE.broadcast() -InterruptedException");
//	//		e.printStackTrace();
//		} catch (ExecutionException e) {
//		//	e.printStackTrace();
//			System.out.println("ERROR: INSTANCE.broadcast() -ExecutionException");
//		}catch(CancellationException e){
//			System.out.println("ERROR: INSTANCE.broadcast() -CancellationException");
//		}catch(NullPointerException e){
//			System.out.println("ERROR: INSTANCE.broadcast() -NullPointerException");
//		}
		
	}
	protected String prepareResponse(String response){
		return Comet.BEGIN_SCRIPT_TAG+getOnMessageMethod(response)+Comet.END_SCRIPT_TAG;
	}
    protected String getOnMessageMethod(String data){
    	return Comet.ON_MESSAGE_METHOD.replaceAll("DATA", data);
    }
	@Override
	protected void finalize(){
		if(bc != null) bc.destroy();

		
	}
	public void destroy(){
		finalize();
	}
	public synchronized  void notifyPongTime(int player_id) {
		Player p =  findPlayer(player_id);
		if(p != null) p.notifyPongTime();
	}
	public synchronized  void addInstancePlayer(InstancePlayer ip) {
		InstancePlayer p = findInstancePlayer(ip.getPlayer().getId());
		if(p == null){
			ip.getPlayer().notifyPongTime();
			this.ip.add(ip);
		}
		
	}
	public synchronized void checkIfPlayersAlive() {
		System.out.println("Instance.checkIfPlayersAlive() this.ip.size():"+this.ip.size());
		long curr_time = System.currentTimeMillis();
		for (InstancePlayer p : this.ip) {
			if(p != null){
				try{
					System.out.println(" ----  checkIfPlayersAlive()destroy (curr_time-p.getPlayer().getPongTime()) > Comet.PING_PONG_TIMEOUT:"+(curr_time-p.getPlayer().getPongTime()) +" > "+ Comet.PING_PONG_TIMEOUT);
					
					if((curr_time-p.getPlayer().getPongTime()) > Comet.PING_PONG_TIMEOUT){
					   this.ip.remove(p);
						p.destroy();
						
					}
				}catch(NullPointerException e){
					this.ip.remove(p);
					System.out.println("checkIfPlayersAlive() Null pointer exception");
				}
				//System.out.println("Instance.checkIfPlayersAlive()(curr_time-p.getPlayer().getPongTime()):"+(curr_time-p.getPlayer().getPongTime()));
				
			}else this.ip.remove(p);
			}
		
	}
	
}
