package de.tubs.age.util;

import java.util.ArrayList;
import java.util.List;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Player;

public class Instance {
	private Game game;
	private List<Player> currentPlayers;
	private List<Player> emptyPlayers;
	public Instance(Game game){
		this.game = game;
		currentPlayers = new ArrayList<Player>();
		emptyPlayers = new ArrayList<Player>();
		for (Player player : game.getPlayers()) {
			emptyPlayers.add(player);
		}
	}
	public int getPlayersSize(){
		return this.game.getPlayers().size();
	}
	public int getCurrentPlayersSize(){
		return this.currentPlayers.size();
	}
	public synchronized Player newPlayer(){
		if(emptyPlayers.size()>0){
			Player newPlayer = emptyPlayers.get(0);
			emptyPlayers.remove(0);
			currentPlayers.add(newPlayer);
			return newPlayer;
		}else return null;
		
	}
	public synchronized void removePlayer(Player player){
			for (int i = 0; i < currentPlayers.size(); i++) {
				Player _player = currentPlayers.get(i);
				if(_player.getId()==player.getId()){
					currentPlayers.remove(i);
					emptyPlayers.add(_player);
				}
			}
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
}
