/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
// java -cp hsqldb.jar org.hsqldb.util.DatabaseManagerSwing D:\NetBeansProjects\AGEGame\db\db
package de.tubs.age.jpa;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Transient;

import de.tubs.age.jpa.manager.EntityManagerUtil;

/**
 *
 * @author Maciej Apelgrim
 */
@Entity
public class Game extends Model{

    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    private boolean _public;
    private int playersSize;
    private String name;
    private String key;
    private String editKey;
    private boolean acitve;
    
    
    @OneToMany(mappedBy="parent")
    private List<Game> children;
    
    @ManyToOne
    private Game parent;
    
  //  @OneToMany(mappedBy="game", cascade=CascadeType.ALL)
 //   @JoinColumn(name="game_id", referencedColumnName="ID")
    @OneToMany(mappedBy="game",cascade = CascadeType.REMOVE)
    private List<Groups> groups;

    @OneToMany(mappedBy="game")
    private List<Player> players;

    @OneToOne
    private Table table;


    @Transient private Style style;
    @Transient private String JSONCache;


    public Game() {
    //    System.out.println("###### Game()");
        table = new Table();
        groups = new ArrayList<Groups>();
        players = new ArrayList<Player>();
     //   children = new ArrayList<Game>();
    }

    public Game(boolean _public, String name, List<Groups> resourcen, List<Player> players, Table table,boolean acitve) {
  //      System.out.println("###### Game((boolean _public, String name, List<Group> resourcen, List<Player> players, Table table)");
        this._public = _public;
        this.name = name;
  //      this.style = style;
        this.acitve = acitve;
        this.groups = resourcen;
        this.players = players;
        this.table = table;
        this.playersSize = players.size();
    }
    @Override
    public String toString() {
    	return "playersSize:"+playersSize+", name:"+name;
    }
    public void saveAll(EntityManager em) throws IOException {
        System.out.println("++++ Game.saveAll() key:"+key);
       this.table.saveAll(key,em);
       

       for (Groups group : groups) {  
    	    group.setGame(this);
            group.saveAll(key,em);
    
        }     
        for (Player player : players) {
        	player.setGame(this);
            player.saveAll(em);
        }
        save(em);
    }
    /**
     * @return the _public
     */
    public boolean isPublic() {
        return _public;
    }

    /**
     * @param public the _public to set
     */
    public void setPublic(boolean _public) {
        this._public = _public;
    }

    /**
     * @return the playersSize
     */
    public int getPlayersSize() {
        return playersSize;
    }

    /**
     * @param playersSize the playersSize to set
     */
    public void setPlayersSize(int playersSize) {
        this.playersSize = playersSize;
    }

    /**
     * @return the name
     */
    public String getName() {

        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
   //     System.out.println("#####  game setName(String name):"+name);
        this.name = name;
    }

    /**
     * @return the style
     */

    public Style getStyle() {
        return style;
    }

    /**
     * @param style the style to set
     */
    public void setStyle(Style style) {
        this.style = style;
    }

    /**
     * @return the resourcen
     */
    public List<Groups> getResourcen() {
        return groups;
    }

    /**
     * @param resourcen the resourcen to set
     */
    public void setResourcen(List<Groups> resourcen) {
 //       System.out.println("###### setResourcen(List<Group> resourcen):"+resourcen.size());
        this.groups = resourcen;
    }

    /**
     * @return the players
     */
    public List<Player> getPlayers() {
        return players;
    }

    /**
     * @param players the players to set
     */
    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    /**
     * @return the table
     */
    public Table getTable() {
        return table;
    }

    /**
     * @param table the table to set
     */
    public void setTable(Table table) {
        this.table = table;
    }

	public void save(String path) throws IOException {
	
		
	}

	public String toJSON() {
	//	if(JSONCache==null){
		StringBuffer sb = new StringBuffer();
		sb.append("{name:'" + name + "',_public:" + _public + ",playersSize:"+playersSize+",table:"
				+ table.toJSON() + ",resourcen:[");
		boolean first = true;
		for (Groups group : this.groups) {
			if(first){
				sb.append(group.toJSON());
				first = false;
			}
			else sb.append(","+group.toJSON());
			
		}
		
		sb.append("],players:[");
		first = true;
	//	System.out.println("####String toJSON() this.players.size():" + this.players.size());
		for (Player player : this.players) {
	//		System.out.println("####String toJSON() for (Player player : this.players):" + player.toJSON());
			if (first) {
				sb.append(player.toJSON());
				first = false;
			} else sb.append("," + player.toJSON());
		}
		sb.append("]}");
		JSONCache = sb.toString();
//		}
		return JSONCache;
	}

	public Player addPlayer(String name) {
		System.out.println("#### addPlayer(String name) playersSize:" + playersSize+", :this.players.size():"+this.players.size());
		if(playersSize > this.players.size()){
			int id = this.players.size()+1;
			if(!hasPlayer(id)){
				Player newplayer = new Player(name,id);
				this.players.add(newplayer);
				
			 
			System.out.println("####addPlayer(String name) if(playersSize > this.players.size()) :" + playersSize+", :this.players.size():"+this.players.size());
			JSONCache=null;
			return newplayer;
			}
		}

		return new Player("error",-1);
		
	}

	private boolean hasPlayer(int id2) {
		for (Player player : this.players) {
			if(player.getId() == id2) return true;
		}
		return false;
	}

	@Override
	public int getId() {
		return id;
	}

	public Game loadInstance(String instanceKey) {
		
		return null;
	}
    public Game copy(String key){
		List<Groups> resourcen = new ArrayList<Groups>();
		List<Player> _players = new ArrayList<Player>();
		Table _table = this.table.copy(key);
		for (Groups group : groups) {
			resourcen.add(group.copy(key));
		}
		for (Player player :this. players) {
			_players.add(player.copy());
		}
    	return new Game(_public,name,resourcen,_players,_table,true);
    }
	public Game createInstance(String key) {
		Game game = this.copy(key);
        game.setKey(key);
        game.setParent(this);
        addInstance(game);
		return game;
	}

	private void addInstance(Game game) {
		if(this.children==null) this.children = new ArrayList<Game>();
		this.children.add(game);
		
	}
    public boolean isInstance(){
    	return this.parent==null ? false : true;
    }
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public List<Game> getChildren() {
		System.out.println("Game.getChildren(). size: "+(children==null?"null":children.size()));
		return children;
	}

	public void setChildren(List<Game> children) {
		this.children = children;
	}

	public Game getParent() {
		return parent;
	}

	public void setParent(Game parent) {
		this.parent = parent;
	}

	public String getEditKey() {
		return editKey;
	}

	public void setEditKey(String editKey) {
		this.editKey = editKey;
	}

	public boolean isAcitve() {
		return acitve;
	}

	public void setAcitve(boolean acitve) {
		this.acitve = acitve;
	}
    public Item getItem(int id){
    	for (Groups group : groups) {
			for (Item item : group.getItems()) {
				if(item.getId()==id){
					return item;
				}
			}
    	}
    	return null;
    }
	public void setItemPosition(int x, int y, int item_id) {
	//	System.out.print("Game.setItemPosition item_id:"+item_id);
		for (Groups group : groups) {
			for (Item item : group.getItems()) {
				if(item.getId()==item_id){
					item.getStyle().setLeft(x);
					item.getStyle().setTop(y);
		//			System.out.print(" FOUND\n");
				}
			}
		}
		
	}

	public void setGroupPosition(int x, int y, int group_id) {
	//	System.out.print("Game.setGroupPosition item_id:"+group_id);
		for (Groups group : groups) {
			if(group.getId()==group_id){
				group.getStyle().setLeft(x);
				group.getStyle().setTop(y);
			}
		}
		
	}




}
