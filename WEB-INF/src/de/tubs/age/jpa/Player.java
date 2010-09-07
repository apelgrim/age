/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package de.tubs.age.jpa;

import java.io.IOException;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Transient;

/**
 *
 * @author Maciej Apelgrim
 */
@Entity
public class Player extends Model{
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
   private String name;
   @OneToOne
   private Style style;
   private int angle;
   
   @Transient private boolean alive;
   
   @ManyToOne
    private Game game;
 //  @Transient private int _id;
    public Player() {
    }

    public Player(String name) {
        this.name = name;
    }
    public Player(String name,int id) {
        this.name = name;
        this.id =id;
    }
    public Player(String name,int id,int angle) {
        this.name = name;
        this.id =id;
        this.angle = angle;
    }
    public Player(String name,int id,int angle,Style style) {
        this.name = name;
        this.id =id;
        this.angle = angle;
        this.style = style;
    }

    public int getId() {
		return id;
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
        this.name = name;
    }

    /**
     * @return the game
     */
    public Game getGame() {
        return game;
    }
    public int getAngle() {
    	return angle;
    }

    public void setAngle(int angle) {
    	this.angle = angle;
    }

    /**
     * @param game the game to set
     */
    public void setGame(Game game) {
        this.game = game;
    }

    public void saveAll(EntityManager em) throws IOException {
    	style.saveAll(null,em);
    	save(em);	
    }
/*
	public void save(EntityManager em) {
	   super.save(em);	
	}
*/
	public String  toJSON() {
        String _name = name==null ? "null" : "'"+name+"'";
		StringBuffer sb = new StringBuffer();
		sb.append("{name:"+_name+",id:"+id+",angle:"+angle+",style:"+style.toJSON()+"}");
	
		return sb.toString();
	}

	public Player copy() {
		Style _style = this.style.copy(null);
		return new Player(this.name,0,this.angle,_style);
	}

	public Style getStyle() {
		return style;
	}

	public void setStyle(Style style) {
		this.style = style;
	}

	public boolean isAlive() {
		return alive;
	}

	public void setAlive(boolean alive) {
		this.alive = alive;
	}
	
}
