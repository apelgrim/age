package de.tubs.age.util;

import de.tubs.age.jpa.Player;

public class InstancePlayer {
	private Instance instance;
	private Player player;
	public InstancePlayer(Instance instance){
		this.instance=instance;
		this.player=instance.newPlayer();
	}
	public void setInstance(Instance instance){
		this.instance = instance;
	}
	public Player getPlayer() {
		return player;
	}
	public void setPlayer(Player player) {
		this.player = player;
	}
	public Instance getInstance() {
		return instance;
	}
	@Override
	protected void finalize(){
		System.out.println("InstancePlayer.finalize()");
		this.instance.removePlayer(player);
	}
	public void destroy(){
		finalize();
	}
}
