package de.tubs.age.util;

import de.tubs.age.jpa.Player;

public class InstancePlayer {
	private Instance instance;
	private Player player;
	private String key;
	public InstancePlayer(Instance instance){
		this.instance=instance;
		this.player=instance.newPlayer();
	}
	public void setInstance(Instance instance){
		this.instance.removePlayer(player);
		this.instance = instance;
		this.player=instance.newPlayer();
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
		if(this.instance != null){
		//	this.instance.getBroadcaster().broadcast("{n:'leave',v:"+getPlayer().getId()+"}");
		//	this.instance.removePlayer(player);
		}
		System.out.println("InstancePlayer.finalize()");
		
	}
	public void destroy(){
		finalize();
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	

}
