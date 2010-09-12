package de.tubs.age.pages.game;

import java.io.IOException;

import org.apache.click.Context;
import org.apache.click.util.Bindable;

import sun.font.FontManager.FamilyDescription;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.manager.GameManager;
import de.tubs.age.pages.LayoutPage;
import de.tubs.age.util.AgeUtil;
import de.tubs.age.util.GameLoader;

public class Play extends LayoutPage{
	@Bindable protected Game playGame;
	@Bindable protected Game newGame;
	@Bindable protected String gameJSON="{}";
	public Play(){
		Context c = getContext();
		String gameKey = c.getRequestParameter("game");
		String newGame = c.getRequestParameter("new");
		System.out.println("gameKey = "+gameKey);
		if(newGame!= null) createNewInstance(GameLoader.loadGame(newGame));
		else if(gameKey!= null) playGame(GameLoader.loadGame(gameKey));
	}
	private void playGame(Game game){
		if(game!=null){
			System.out.println("playGame game key: "+game.getKey());
	        gameJSON=game.toJSON();
			playGame=game;
		}
	}
	private void createNewInstance(Game game){
		GameManager gm = new GameManager();
		try {
			newGame = gm.createInstance(game, AgeUtil.convertToKey(getContext().getSession().getId(),8));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
