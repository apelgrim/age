/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package de.tubs.age.jpa;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Transient;

import org.hibernate.annotations.Cascade;

import de.tubs.age.util.IAgeGameElement;



/**
 *
 * @author Maciej Apelgrim
 */


@Entity
public class Groups extends Model implements IAgeGameElement{
    

	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
	
    @ManyToOne
    private Game game;
	
	private String name;

    @OneToOne
    private Style style;

   @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH,CascadeType.REMOVE}, mappedBy = "groups")
   @Cascade({org.hibernate.annotations.CascadeType.SAVE_UPDATE,org.hibernate.annotations.CascadeType.REMOVE,
            org.hibernate.annotations.CascadeType.MERGE,org.hibernate.annotations.CascadeType.PERSIST})
    private List<Item> items = new ArrayList<Item>();

    private boolean visibility;
    private boolean stacked;
    private boolean randomgenerator;
    private boolean ordered;

    @Transient private Template template;

    


    public Groups(){
        items = new ArrayList<Item>();
        style = new Style();
    }
   public Groups(String name, Style style, boolean visibility, boolean stacked, boolean randomgenerator, boolean ordered) {
        this.name = name;
        this.style = style;
        this.visibility = visibility;
        this.stacked = stacked;
        this.randomgenerator = randomgenerator;
        this.ordered =  ordered;
        items = new ArrayList<Item>();
    }
    /**
     * @return the name
     */
    public String getName() {
        return name;
    }
	public boolean isOrdered() {
		return ordered;
	}
	public void setOrdered(boolean ordered) {
		this.ordered = ordered;
	}
    /**
     * @param name the name to set
     */
    public void setName(String name) {
  //       System.out.println("#####  Group setName(String name):"+name);
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
     * @return the items
     */

    public List<Item> getItems() {
        return items;
    }

    /**
     * @param items the items to set
     */
    public void setItems(List<Item> items) {
        this.items = items;
    }

    /**
     * @return the visibility
     */
    public boolean isVisibility() {
        return visibility;
    }

    /**
     * @param visibility the visibility to set
     */
    public void setVisibility(boolean visibility) {
        this.visibility = visibility;
    }
   public Item findItem(int id){
	   for (Item item : items) {
		if(item.getId()==id) return item;
	}
	   return null;
   }
    /**
     * @return the stacked
     */
    public boolean isStacked() {
        return stacked;
    }

    /**
     * @param stacked the stacked to set
     */
    public void setStacked(boolean stacked) {
        this.stacked = stacked;
    }

    /**
     * @return the randomgenerator
     */
    public boolean isRandomgenerator() {
        return randomgenerator;
    }

    /**
     * @param randomgenerator the randomgenerator to set
     */
    public void setRandomgenerator(boolean randomgenerator) {
        this.randomgenerator = randomgenerator;
    }

   
    void saveAll(String path,EntityManager em) throws IOException {
    	style.setTemplate(template);
    	System.out.println("-------- group  saveAllstyle getBgImageName()"+style.getBgImageName());
        style.saveAll(path,em);
        for (Item item : items) {
        	item.setTemplate(template);
        	item.setGroups(this);
            item.saveAll(path,em);
        }
        save(em);
    }

	public String toJSON() {
		StringBuffer sb = new StringBuffer();
		sb.append("{id:"+id+",name:'" + name + "',visibility:" + visibility + ",stacked:"+stacked+",randomgenerator:"+randomgenerator+",order:"+ordered
				+ ",style:"+style.toJSON()+",items:[");
		boolean first = true;
		for (Item item : items) {
			if(first){
				sb.append(item.toJSON());
				first = false;
			}
			else sb.append(","+item.toJSON());	
		}
		sb.append("]}");
		return sb.toString();
	}

   public String toString(){
	   return "name:" + name + ",visibility:" + visibility + ",stacked:"+stacked+",randomgenerator:"+randomgenerator+",order:"+ordered;
   }
	public void setId(int id) {
		this.id = id;
	}
	public int getId() {
		return id;
	}
	public void setGame(Game game) {
		this.game = game;
	}
	public Game getGame() {
		return game;
	}
	public Groups copy(String key) {
		List<Item> _items = new ArrayList<Item>();
		for (Item item : this.items) {
			_items.add(item.copy(key));
		}
		Groups group = new Groups(name,style.copy(key), visibility,stacked,randomgenerator, ordered);
		group.setItems(_items);
		return group;
	}
	public void setTemplate(Template template) {
		this.template = template;
		
	}
	public Template getTemplate() {
		return template;
	}
	public void resetItemPosition() {
		for (Item item : this.items) {
			item.getStyle().setLeft(this.style.getLeft());
			item.getStyle().setTop(this.style.getTop());
		}
		
	}
	public void setItemsVisibility(boolean visibility2) {
		this.visibility=visibility2;
		for (Item item : this.items) {
			item.setVisibility(visibility2);
		}
		
	}
	public void randomizeItems() {
		int maxZIndex = this.getFirstItem().getStyle().getzIndex()+this.items.size();
		this.style.setzIndex(maxZIndex);
		Collections.shuffle(this.items);
		for (Item item : this.items) {
			item.getStyle().setzIndex(maxZIndex);
			maxZIndex--;
		}	
	}
	private Item getFirstItem() {
		Item first = this.items.get(0);
		for (Item item : this.items) {
			if(first.getStyle().getzIndex() < item.getStyle().getzIndex()) first = item;
		}
		return first;
	}
}
