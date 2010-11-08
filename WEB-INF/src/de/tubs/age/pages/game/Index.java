package de.tubs.age.pages.game;

import org.apache.click.Context;
import org.apache.click.util.Bindable;

import de.tubs.age.jpa.Game;
import de.tubs.age.pages.LayoutPage;
import de.tubs.age.util.GameLoader;

public class Index  extends LayoutPage{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Bindable protected Game game;
	@Bindable protected String gameEditKey;
	@Bindable public String title = "not found";
	public Index(){
		Context c = getContext();
		game = GameLoader.loadGame(c.getRequestParameter("key"));
		if(game != null) title = game.getName();
		gameEditKey = c.getRequestParameter("edit");
	}
}
