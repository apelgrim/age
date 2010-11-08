package de.tubs.age.pages.game;

import java.io.IOException;

import org.apache.click.Context;
import org.apache.click.control.Form;
import org.apache.click.util.Bindable;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Groups;
import de.tubs.age.jpa.Item;
import de.tubs.age.jpa.manager.GameManager;
import de.tubs.age.pages.LayoutPage;
import de.tubs.age.util.AgeUtil;
import de.tubs.age.util.GameLoader;
import de.tubs.age.util.ModelUtil;

public class New extends LayoutPage{
	

    /**
     * 
     * 
     * 
     * 
     * 
	 */
	private static final long serialVersionUID = 1L;

	@Bindable protected Form form = new Form();
    @Bindable protected String msg;
    @Bindable protected String msg2;
    @Bindable protected String templates;
    @Bindable public String title = "neue Spiel";
  
	public New(){
	//	File file = new File(".");
	}
	public void onPost() {
		submit();
	}
	public void onGet(){
		templates=GameLoader.loadJSONTemplates();
		
	}
	public boolean onSubmit() {
			return true;
	}
    public boolean submit() {
        if (form.isValid()) {
        	Context c = getContext();
        	Game game = new Game();
        	ModelUtil.copyFormParamsToGame(game, c);
        	
        	System.out.println("\n\n#### START ModelUtil.copyFormParamsToGame(game, c) ####");
        	System.out.println("game:"+game);
        	for (Groups group : game.getResourcen()) {
        		System.out.println("   group:"+group+" items size:"+group.getItems().size());
        		for (Item item : group.getItems()) {
        			System.out.println("      item:"+item);
				}
        		System.out.println();
			}
        	System.out.println("#### END ModelUtil.copyFormParamsToGame(game, c) ####\n\n");
        	
    
        	GameManager gm = new GameManager();
        	game.setKey(AgeUtil.convertToKey(getContext().getSession().getId(),8));
   
        	game.setEditKey(AgeUtil.convertToKey(getContext().getSession().getId(),16));
        	try {     
				gm.saveGame(game);
				setRedirect("/game/?key="+game.getKey()+"&edit="+game.getEditKey());
			} catch (IOException e) {
				msg = "Exception: "+e;
			}
             
            Game g2 = gm.loadGame(game.getKey());
            if(g2!= null) msg2 = "Game name: "+g2.getName()+" Groups Size: "+g2.getResourcen().size();
            else msg2 = "game is null";
           
        }
        return true;
    }
}
