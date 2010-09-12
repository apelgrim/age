package de.tubs.age.pages.game;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.click.Context;
import org.apache.click.control.Checkbox;
import org.apache.click.control.Field;
import org.apache.click.control.FileField;
import org.apache.click.control.Form;
import org.apache.click.control.Submit;
import org.apache.click.control.TextField;
import org.apache.click.util.Bindable;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;

import java.io.File;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Groups;
import de.tubs.age.jpa.Item;
import de.tubs.age.jpa.Player;
import de.tubs.age.jpa.Style;
import de.tubs.age.jpa.Table;
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
  
	public New(){
		File file = new File(".");
	     System.out.println("########## Ende  Construktor NEw.class file"+file.getAbsolutePath());
	}
	public void onPost() {
		submit();
	}
	public void onGet(){
		templates=GameLoader.loadJSONTemplates();
		
	}
	public boolean onSubmit() {
	//	System.out.println("##########onSubmit NEw.class");
		return true;
	}
    public boolean submit() {
   // 	System.out.println("#######ee### Submit");
        if (form.isValid()) {
        	Context c = getContext();
        	Game game = new Game();
        	ModelUtil.copyFormParamsToGame(game, c);
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
