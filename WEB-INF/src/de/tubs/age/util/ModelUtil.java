package de.tubs.age.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.click.Context;
import org.apache.commons.fileupload.FileItem;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Groups;
import de.tubs.age.jpa.Item;
import de.tubs.age.jpa.Player;
import de.tubs.age.jpa.Style;
import de.tubs.age.jpa.Template;

public class ModelUtil {
   private static int DEFAULT_MAX_SIZE = 2000;	
   public static void copyFormParamsToGame(Game game, Context c){ 
	   
	   game.setName(c.getRequestParameter("name"));
	   int playersSize = AgeUtil.min(convertToInt(c.getRequestParameter("playersSize")), GameLoader.MAX_PLAYERS);
	   game.setPlayersSize(playersSize);
	   game.setPlayers(createPlayers(c,game,playersSize));
	   game.getTable().getStyle().setBgColor(c.getRequestParameter("table.style.bgColor"));
	   game.getTable().getStyle().setLeft(convertToInt(c.getRequestParameter("table.style.left")));
	   game.getTable().getStyle().setTop(convertToInt(c.getRequestParameter("table.style.top")));
	   game.getTable().getStyle().setHeight(convertToInt(c.getRequestParameter("table.style.height")));
	   game.getTable().getStyle().setWidth(convertToInt(c.getRequestParameter("table.style.width")));
	   game.getTable().getStyle().setBgImageFileItem(c.getFileItem("table.style.bgImage"));
	   int resourcenSize = AgeUtil.min(convertToInt(c.getRequestParameter("resourcenSize")), DEFAULT_MAX_SIZE);
	   game.setResourcen(createResourcen(c,game,resourcenSize));
	   
   }
   private static Item createItemFromParams(Context c, String prefix, List<Item> items) {
	String itm_id = c.getRequestParameter(prefix+".id");
	if(itm_id != null){
		int id = convertToInt(itm_id);
		Item item=null;
		Style style = createStyleFromParams(c,prefix);
		if(id>0) item = findItem(id,items);
	    else item = new Item();

		item.setName(c.getRequestParameter(prefix+".name"));
		item.setVisibility(convertToBool(c.getRequestParameter(prefix+".visibility")));
		item.setSize(1);
		item.getStyle().assignStyle(style);
		System.out.println("#-----## ModelUtil.createItemFromParams name:"+item.getName()+", style.left: "+style.getLeft()+"  style.top: "+style.getTop()+" :###############");
		
		return item;
	}
	return null;
}
private static Item findItem(int id, List<Item> items) {
	for (Item item : items) {
		if(item.getId()==id) return item;
	}
	return new Item();
}
private static List<Player> createPlayers(Context c,Game game, int playersSize){
	System.out.println("#################### ModelUtil.createPlayers playersSize:"+playersSize);
	List<Player> players = new ArrayList<Player>();
	for (int i = 0; i < playersSize; i++) {
		Player player = new Player();
		Style style = new Style();
		style.setLeft(convertToInt(c.getRequestParameter("players["+i+"].style.left")));
		style.setTop(convertToInt(c.getRequestParameter("players["+i+"].style.top")));
		player.setName(c.getRequestParameter("players["+i+"].name"));
		player.setAngle(convertToInt(c.getRequestParameter("players["+i+"].angle")));
		player.setStyle(style);
		players.add(player);
	}
	return players;
}
private static List<Groups> createResourcen(Context c,Game game, int resourcenSize){
	 List<Groups> groups = new ArrayList<Groups>();
	   for (int i = 0; i < resourcenSize; i++) {
			int itm_size = AgeUtil.min(convertToInt(c.getRequestParameter("resourcen[" + i+ "].items")), DEFAULT_MAX_SIZE);
//			System.out.println("#################### ModelUtil.copyFormParamsToGame itm_size: "+itm_size+" ###############");
			if(itm_size>0){			
				Groups grp = createGroupFromParams(c,"resourcen[" + i+ "]",game.getResourcen());
				if(grp!=null){
					if(grp.getItems().size()>0){ 
						if(game.getResourcen().size() < GameLoader.MAX_GROUPS){
//							 System.out.println("#################### ModelUtil.copyFormParamsToGame game.getResourcen().add(grp): "+game.getResourcen().size()+" ###############");							   
							 groups.add(grp);
						}
						else System.out.println("#################### ModelUtil.copyFormParamsToGame MAX_GROUPS ERROR !!!! ###############");
					}
				}
			}
		} 
	 
	 return groups;
}
private static Groups createGroupFromParams(Context c, String prefix, List<Groups> groups){
	String grp_id = c.getRequestParameter(prefix+".id");
	if(grp_id != null){
		int id = convertToInt(grp_id);
		Groups group = null;
		Style style = createStyleFromParams(c,prefix);
		
		if(id>0) group = findGroup(id,groups);
		else group = new Groups();
	
		group.setTemplate(GameLoader.loadTemplate(convertToInt(c.getRequestParameter(prefix+".templateId"))));
		group.setName(c.getRequestParameter(prefix+".name"));
		group.setRandomgenerator(convertToBool(c.getRequestParameter(prefix+".randomgenerator")));
		group.setVisibility(convertToBool(c.getRequestParameter(prefix+".visibility")));
		group.setStacked(convertToBool(c.getRequestParameter(prefix+".stacked")));
		group.setOrdered(convertToBool(c.getRequestParameter(prefix+".order")));
		group.getStyle().assignStyle(style);
		
		int itm_size = AgeUtil.min(convertToInt(c.getRequestParameter(prefix+".items")), DEFAULT_MAX_SIZE);
		List<Item> items = new ArrayList<Item>();
		for (int j = 0; j < itm_size; j++) {
			Item item = createItemFromParams(c,prefix+".items["+j+"]",group.getItems());
			if(item != null){
				if(group.getItems().size() < GameLoader.MAX_ITEMS_PER_GROUP) items.add(item);
				else System.out.println("#################### ModelUtil.copyFormParamsToGame MAX_ITEMS_PER_GROUP ERROR !!!! ###############");
			}
		}
		System.out.println("## Groups createGroupFromParams items,size:"+items.size());
		group.setItems(items);
		return group;
	}
	   return null;
   }
private static Groups findGroup(int id, List<Groups> groups) {
	for (Groups group : groups) {
		if(group.getId()==id) return group;
	}
	return new Groups();
}
private static Style createStyleFromParams(Context c, String prefix){
	System.out.println("########## MedoUtil. form copy bgCOlor:"+c.getRequestParameter(prefix+".style.bgColor"));
	//bgImageName
	Style style = new Style(convertToInt(c.getRequestParameter(prefix+".style.height")), 
			convertToInt(c.getRequestParameter(prefix+".style.width")),
			c.getRequestParameter(prefix+".style.bgColor"),
			c.getFileItem(prefix+".style.bgImage"),
			convertToInt(c.getRequestParameter(prefix+".style.left")),
			convertToInt(c.getRequestParameter(prefix+".style.top")));
	style.setBgImageName(c.getRequestParameter(prefix+".style.bgImageName"));
	return style;
}
   private static int convertToInt(String param){
	   int i = 0;
	   try{ i = Integer.parseInt(param);}
	   catch(Exception e){}  
	   return i;
   }
   private static boolean convertToBool(String param){
//	   System.out.println("#################### ModelUtil.copyFormParamsToGame convertToBool("+param+")="+Boolean.parseBoolean(param)+" ###############");
	  return Boolean.parseBoolean(param);
   }
}
