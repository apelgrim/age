package de.tubs.age.util;

import java.util.ArrayList;
import java.util.List;

import org.atmosphere.cpr.Broadcaster;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Player;

public class Instance {
	private Game game;
//	private List<Player> currentPlayers;
//	private List<Player> emptyPlayers;
	private int inactivePlayers;
	private Broadcaster bc;
	public static int instance_seq=0;
	public Instance(Game game){
		this.game = game;
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
	public int getCurrentPlayersSize(){
		return inactivePlayers-game.getPlayers().size();
	}
	public synchronized Player newPlayer(){
		if(inactivePlayers>0){
			Player newPlayer = getFreePlayer();
			if(newPlayer!=null){
				newPlayer.setActive(true);
				inactivePlayers++;
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
	public synchronized boolean removePlayer(Player player){
		return removePlayer(player.getId());
	}
	public synchronized boolean removePlayer(int player_id){
		boolean success=false;

		for (int i = 0; i < game.getPlayers().size(); i++) {
			Player _player = game.getPlayers().get(i);
			if(_player.getId()==player_id){
				if(_player.isActive()){
					System.out.println("\nPlayer mit id "+player_id+" wurde entfert");
					inactivePlayers--;
					_player.setActive(false);
					success=true;
				}
			}
		}
		return success;
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
		return bc;
	}
	public void setBroadcaster(Broadcaster bc) {
		this.bc=bc;
		
	}
}
