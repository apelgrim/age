/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package de.tubs.age.jpa;

import java.io.IOException;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Transient;

/**
 *
 * @author Maciej Apelgrim
 */
@Entity
public class Table extends Model{
/*
    @OneToMany(mappedBy="table", cascade=CascadeType.ALL)
    private List<Item> items;
*/    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
private int id;
    @OneToOne
    private Style style;
  
    @Transient private Game game;

    public Table(Style style) {
        this.style = style;

    }

    Table() {
        style = new Style();
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
     * @return the game
     */
    public Game getGame() {
        return game;
    }

    /**
     * @param game the game to set
     */
    public void setGame(Game game) {
        this.game = game;
    }

    void saveAll(String path,EntityManager em) throws IOException {
       style.saveAll(path,em);
       save(em);
    }

	public void save(String path) throws IOException {
		 style.save(path);
		
	}

	public String toJSON() {

		StringBuffer sb = new StringBuffer();
		sb.append("{style:"+style.toJSON()+"}");
	
		return sb.toString();
	}
	@Override
	public int getId() {
		return id;
	}

	public Table copy(String key) {
		return new Table(this.style.copy(key));
	}

}
