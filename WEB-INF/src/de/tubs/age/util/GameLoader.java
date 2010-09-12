package de.tubs.age.util;
import java.io.IOException;
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
import de.tubs.age.jpa.Template;
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
	/*
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
	}*/
	public static Template loadTemplate(int id){
		return EntityManagerUtil.getEntityManager().find(Template.class, id);
	}
	public static List<Template> loadTemplates(){
		Query query = EntityManagerUtil.getEntityManager().createQuery("SELECT t FROM Template t");
		@SuppressWarnings("unchecked")
		List<Template> resultList = query.getResultList();
		return resultList;
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
	public static String loadJSONTemplates() {
		 List<Template> templates = loadTemplates();
		 if(templates.size()==0) templates = loadDumpData();
		 String json = "";
		 for (int i = 0; i < templates.size(); i++) {
			if(i>0) json += ","+templates.get(i).toJSON();
			else json += templates.get(i).toJSON();
		}
		 System.out.println("GameLoader.templates json:"+json);
		return "["+json+"]";
	}
	private static List<Template> loadDumpData() {
		Template t1 = new Template();
		t1.setElement(AgeElements.GROUP);
		t1.setName("Würfeln");
		t1.setValue("{templateId:1,id:-1,name:'Würfeln',visibility:true,stacked:false,randomgenerator:true,order:true,style:{height:40,width:40,bgColor:'transparent',bgImage:'/age/images/templates/1/dice-all.png',left:0,top:0},items:[{style:{height:40,width:40,bgColor:'transparent',bgImage:'/age/images/templates/1/dice-1.png',left:0,top:0},name:'1',size:1,visibility:true,id:-1},{style:{height:40,width:40,bgColor:'transparent',bgImage:'/age/images/templates/1/dice-2.png',left:0,top:0},name:'2',size:1,visibility:true,id:-1},{style:{height:40,width:40,bgColor:'transparent',bgImage:'/age/images/templates/1/dice-3.png',left:0,top:0},name:'3',size:1,visibility:true,id:-1},{style:{height:40,width:40,bgColor:'transparent',bgImage:'/age/images/templates/1/dice-4.png',left:0,top:0},name:'4',size:1,visibility:true,id:-1},{style:{height:40,width:40,bgColor:'transparent',bgImage:'/age/images/templates/1/dice-5.png',left:0,top:0},name:'5',size:1,visibility:true,id:-1},{style:{height:40,width:40,bgColor:'transparent',bgImage:'/age/images/templates/1/dice-6.png',left:0,top:0},name:'6',size:1,visibility:true,id:-1}]}");
		Template t2 = new Template();
		t2.setElement(AgeElements.GROUP);
		t2.setName("52 Karten");
		t2.setValue("{templateId:2,id:-1,name:'Karten',visibility:true,stacked:false,randomgenerator:false,order:true,style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/karte.jpg',left:0,top:0},items:[{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/as-herz.jpg',left:0,top:0},name:'As Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/as-karo.jpg',left:0,top:0},name:'As Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/as-treff.jpg',left:0,top:0},name:'As Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/as-pik.jpg',left:0,top:0},name:'As Pik',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/koenig-herz.jpg',left:0,top:0},name:'König Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/bube-karo.jpg',left:0,top:0},name:'König Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/koenig-treff.jpg',left:0,top:0},name:'König Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/koenig-pik.jpg',left:0,top:0},name:'König Pik',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/dame-herz.jpg',left:0,top:0},name:'Dame Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/dame-karo.jpg',left:0,top:0},name:'Dame Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/dame-treff.jpg',left:0,top:0},name:'Dame Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/dame-pik.jpg',left:0,top:0},name:'Dame Pik',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/bube-herz.jpg',left:0,top:0},name:'Bube Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/bube-karo.jpg',left:0,top:0},name:'Bube Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/bube-treff.jpg',left:0,top:0},name:'Bube Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/bube-pik.jpg',left:0,top:0},name:'Bube Pik',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/10-herz.jpg',left:0,top:0},name:'10 Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/10-karo.jpg',left:0,top:0},name:'10 Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/10-treff.jpg',left:0,top:0},name:'10 Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/10-pik.jpg',left:0,top:0},name:'10 Pik',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/9-herz.jpg',left:0,top:0},name:'9 Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/9-karo.jpg',left:0,top:0},name:'9 Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/9-treff.jpg',left:0,top:0},name:'9 Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/9-pik.jpg',left:0,top:0},name:'9 Pik',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/8-herz.jpg',left:0,top:0},name:'8 Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/8-karo.jpg',left:0,top:0},name:'8 Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/8-treff.jpg',left:0,top:0},name:'8 Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/8-pik.jpg',left:0,top:0},name:'8 Pik',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/7-herz.jpg',left:0,top:0},name:'7 Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/7-karo.jpg',left:0,top:0},name:'7 Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/7-treff.jpg',left:0,top:0},name:'7 Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/7-pik.jpg',left:0,top:0},name:'7 Pik',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/6-herz.jpg',left:0,top:0},name:'6 Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/6-karo.jpg',left:0,top:0},name:'6 Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/6-treff.jpg',left:0,top:0},name:'6 Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/6-pik.jpg',left:0,top:0},name:'6 Pik',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/5-herz.jpg',left:0,top:0},name:'5 Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/5-karo.jpg',left:0,top:0},name:'5 Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/5-treff.jpg',left:0,top:0},name:'5 Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/5-pik.jpg',left:0,top:0},name:'5 Pik',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/4-herz.jpg',left:0,top:0},name:'4 Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/4-karo.jpg',left:0,top:0},name:'4 Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/4-treff.jpg',left:0,top:0},name:'4 Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/4-pik.jpg',left:0,top:0},name:'4 Pik',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/3-herz.jpg',left:0,top:0},name:'3 Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/3-karo.jpg',left:0,top:0},name:'3 Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/3-treff.jpg',left:0,top:0},name:'3 Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/3-pik.jpg',left:0,top:0},name:'3 Pik',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/2-herz.jpg',left:0,top:0},name:'2 Herz',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/2-karo.jpg',left:0,top:0},name:'2 Karo',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/2-treff.jpg',left:0,top:0},name:'2 Treff',size:1,visibility:true,id:-1},{style:{height:90,width:72,bgColor:'transparent',bgImage:'/age/images/templates/2/2-pik.jpg',left:0,top:0},name:'2 Pik',size:1,visibility:true,id:-1}]}");
		
		try {
			t1.save();
			t2.save();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Query query = EntityManagerUtil.getEntityManager().createQuery("SELECT t FROM Template t");
		@SuppressWarnings("unchecked")
		List<Template> resultList = query.getResultList();
		return resultList;
	}
}
