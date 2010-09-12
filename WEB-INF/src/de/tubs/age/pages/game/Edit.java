package de.tubs.age.pages.game;

import java.io.IOException;

import javax.persistence.EntityManager;

import org.apache.click.Context;
import org.apache.click.util.Bindable;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.manager.EntityManagerUtil;
import de.tubs.age.jpa.manager.GameManager;
import de.tubs.age.pages.LayoutPage;
import de.tubs.age.util.GameLoader;
import de.tubs.age.util.ModelUtil;

public class Edit   extends LayoutPage{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Bindable protected Game game;
	@Bindable private String gameKey;
	@Bindable protected String templates;
	public Edit(){
		Context c = getContext();
		
		//key=c.getRequestParameter("key");
		game = loadToEdit(c.getRequestParameter("editKey"));
		System.out.println("#### game = loadToEdit(c.getRequestAttribute('editKey')):"+c.getRequestParameter("editKey"));
		if(game!= null) gameKey=game.getKey();
	}
	public void onGet(){
		templates=GameLoader.loadJSONTemplates();
		
	}
	public void onPost() {
		submit();
	}
	 public boolean submit() {
		Context c = getContext();
	//	System.out.println("########## form.copyTo(game,true); game:" + game+ ", key:" + key);
		if (game != null) {
			ModelUtil.copyFormParamsToGame(game, c);
			try {
				EntityManager em = EntityManagerUtil.getEntityManager();
				em.getTransaction().begin();
			//	game.setEditKey(key);
				game.saveAll(em);
				em.getTransaction().commit();
			} catch (IOException e) {

			}
			game = loadToEdit(c.getRequestParameter("editKey"));
		}
		return true;
	}
  private Game loadToEdit(String key){
	  return GameLoader.loadGameFromDatabase(key,true);
  }
}
