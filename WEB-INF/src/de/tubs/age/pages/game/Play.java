package de.tubs.age.pages.game;

import java.io.IOException;

import org.apache.click.Context;
import org.apache.click.util.Bindable;
import org.atmosphere.cpr.BroadcasterFactory;

import sun.font.FontManager.FamilyDescription;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.manager.GameManager;
import de.tubs.age.pages.LayoutPage;
import de.tubs.age.util.AgeUtil;
import de.tubs.age.util.GameLoader;
import de.tubs.age.util.Instance;

public class Play extends LayoutPage{
	@Bindable protected Game playGame;
	@Bindable protected Game newGame;
	@Bindable protected String gameJSON="{}";
	public Play() throws IllegalAccessException, InstantiationException{
		Context c = getContext();
		String gameKey = c.getRequestParameter("game");
		String newGame = c.getRequestParameter("new");
		System.out.println("gameKey = "+gameKey);
		if(newGame!= null) createNewInstance(GameLoader.loadGame(newGame));
		else if(gameKey!= null) playGame(GameLoader.loadInstance(gameKey));
	}
	private void playGame(Instance instance) throws IllegalAccessException, InstantiationException{
		if(instance!=null){
			System.out.println("playGame game key: "+instance.getGame().getKey());
	        gameJSON=instance.getGame().toJSON();
			playGame=instance.getGame();
//			instance.setBroadcaster(BroadcasterFactory.getDefault().get());
//			getContext().getServletContext().setAttribute(instance.getGame().getKey(), instance);
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
