package de.tubs.age.pages;

import java.util.List;

import org.apache.click.util.Bindable;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.manager.GameManager;



public class HomePage  extends LayoutPage{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Bindable public String title = "Welcome"; 
	@Bindable public List<Game> games;
	public  HomePage(){
		 GameManager gm = new  GameManager();
		 games = gm.getGames();
	}
}
