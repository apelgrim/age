package de.tubs.age.util;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.atmosphere.cpr.AtmosphereResource;

import de.tubs.age.jpa.Player;

public class InstancePlayer {
	private Instance instance;
	private Player player;
	private AtmosphereResource<HttpServletRequest, HttpServletResponse> r;
	public InstancePlayer(Instance instance){
		this.instance=instance;
		this.player=instance.newPlayer();
		this.player.notifyPongTime();
	}
	public synchronized void setInstance(Instance instance){
		System.out.println("InstancePlayer.setInstance()");
		destroy();
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
			if(this.instance.getBroadcaster() != null && getPlayer() != null){
				this.instance.broadcast(this.instance.prepareResponse("{n:'leave',v:"+getPlayer().getId()+"}"),false);
				this.instance.removePlayer(player.getId());
				if(r != null) this.r.resume();		
			}
		}
		player=null;
		System.out.println("InstancePlayer.finalize()");
		
	}
	public void destroy(){
		System.out.println("InstancePlayer.destroy()");
		finalize();
	}
	public String getKey() {
		return instance.getKey();
	}
	public void setKey(String key) {
		instance.setKey(key);
	}
	public void addAtmosphereResource(AtmosphereResource<HttpServletRequest, HttpServletResponse> r) {
		
		this.r = r;
	}
	public AtmosphereResource<HttpServletRequest, HttpServletResponse> getAtmosphereResource(){
		return r;
	}

}
