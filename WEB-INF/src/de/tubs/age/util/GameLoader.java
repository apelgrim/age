package de.tubs.age.util;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Query;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Groups;
import de.tubs.age.jpa.Item;
import de.tubs.age.jpa.Player;
import de.tubs.age.jpa.Style;
import de.tubs.age.jpa.Table;
import de.tubs.age.jpa.manager.EntityManagerUtil;
import de.tubs.age.jpa.manager.GameManager;
public class GameLoader {
	public final static int MAX_GROUPS = 40;
	public final static int MAX_PLAYERS = 40;
	public final static int MAX_ITEMS_PER_GROUP = 1000;
	private static Map<String, Instance> games = new HashMap<String, Instance>();
	static{
		
	}
	public static Game loadGame(String key){
		Instance instance = loadInstance(key);
		if(instance != null) return  instance.getGame();
		else return null;
	}
	public static Instance loadInstance(String key){
		Instance instance = games.get(key);
		if(instance == null){
			System.out.println("GameLoader.load instance lade FROM DATABASE");
			Game game = loadGameFromDatabase(key,false);
			if(game == null) return null;
			instance = new Instance(game);
			addInstance(key, instance);
		}else System.out.println("GameLoader.load instance lade FROM MAP");
		return instance;
	}
	public static void addInstance(String key, Instance instance){
		if(!games.containsKey(key)) games.put(key, instance);
	}
	public static void updateGame(String key,Instance instance){
		games.put(key, instance);
	}
	public static String toJSON(String key){
		Instance instance = games.get(key);
		return instance == null ? "{}" :instance.getGame().toJSON();
	}
	public static Game loadDumpGame(){
	   	Game game = new Game();
	   	game.setKey(""+System.currentTimeMillis());
    	Style group0syte0 = new Style(15, 15, "black", null, 0, 0);
    	Groups group1 = new Groups("karty", group0syte0, true, false, false, false);
    	
    	
    	Style item1syte0 = new Style(15, 15, "red", null, 0, 0);
    	Item item1 = new Item("as", item1syte0,  1, true);
    	
    	
    	Style item1syte1 = new Style(15, 15, "green", null, 0, 0);
    	Item item2 =new Item("joker", item1syte1,  1, true);
    	
    	List<Item> items = new ArrayList<Item>();
    	items.add(item1);
    	items.add(item2);
    	
    	group1.setItems(items);
    	
    	List<Groups> resourcen = new ArrayList<Groups>();
    	resourcen.add(group1);
    	
    	List<Player> players = new ArrayList<Player>();
    	players.add(new Player("Maciek",0,0));
    	players.add(new Player("Mark",0,180));
    	game.setTable(new Table(new Style(200, 200, "gray", null, 0, 0)));
    	game.setPlayers(players);
    	game.setResourcen(resourcen);
    	game.setName("Poker");
    	
    	return game;
	}
	public static Game loadGameFromDatabase(String key,boolean edit){
		if(key == null) return null;
		Game game = null;
		key=key.trim();
		if(!key.equals("")){
		 String param = "key";
		 if(edit) param =  "editKey";
	     Query query = EntityManagerUtil.getEntityManager().createQuery("SELECT g FROM Game g WHERE "+param+"='"+key+"'");
	//     query.setParameter("key", key);
	     
	        try {
	        	game = (Game)query.getSingleResult();
	        } catch (javax.persistence.NoResultException e) {
	       System.out.println("##### SQL ERROR : javax.persistence.NoResultException");
	     
	        }
		}
		return game;
	}
}
