package de.tubs.age.pages;

import java.io.IOException;
import java.util.List;

import javax.persistence.EntityManager;

import org.apache.click.util.Bindable;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.manager.EntityManagerUtil;
import de.tubs.age.jpa.manager.GameManager;
import de.tubs.age.util.AgeUtil;
import de.tubs.age.util.GameLoader;


public class HomePage  extends LayoutPage{
	
//	@Bindable public String title = "Home"; 
//	@Bindable public Game game,gi1,gi2;
	@Bindable public List<Game> games;
	public  HomePage(){
		 GameManager gm = new  GameManager();
		 games = gm.getGames();
		/*
		Game _game = GameLoader.loadDumpGame();
		GameManager gm = new GameManager();
    	try {
	   
    	System.out.println("zapisuje gre");
    	gm.saveGame(_game);
		
    	
    	Game _gi1=_game.createInstance(AgeUtil.convertToKey(getContext().getSession().getId(),8));
    	System.out.println("zapisuje copie 1");
    	gm.saveGame(_gi1);
    	
    	
    	Game _gi2=_game.createInstance(AgeUtil.convertToKey(getContext().getSession().getId(),8));
    	System.out.println("zapisuje copie 2");
    	gm.saveGame(_gi2);
    	
    	game = gm.loadGame(_game.getKey());
    	gi1 = gm.loadGame(_gi1.getKey());
    	gi2 = gm.loadGame(_gi2.getKey());
    	} catch (IOException e) {
			e.printStackTrace();
		}
*/
	}
}
