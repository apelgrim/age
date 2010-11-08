package de.tubs.age.pages.game;

import java.io.IOException;

import javax.persistence.EntityManager;

import org.apache.click.Context;
import org.apache.click.util.Bindable;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Groups;
import de.tubs.age.jpa.Item;
import de.tubs.age.jpa.manager.EntityManagerUtil;
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
		game = loadToEdit(c.getRequestParameter("editKey"));
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
		if (game != null) {
			ModelUtil.copyFormParamsToGame(game, c);
			
			
			for (Groups group : game.getResourcen()) {
        		System.out.println("   group:"+group+" items size:"+group.getItems().size());
        		for (Item item : group.getItems()) {
        			System.out.println("      item:"+item);
				}
        		System.out.println();
			}
       	
			try {
				EntityManager em = EntityManagerUtil.getEntityManager();
				em.getTransaction().begin();
				game.saveAll(em);
				em.getTransaction().commit();
				setRedirect("/game/?key="+game.getKey()+"&edit="+game.getEditKey());
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
