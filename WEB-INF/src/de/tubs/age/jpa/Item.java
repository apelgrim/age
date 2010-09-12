/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package de.tubs.age.jpa;

import java.io.IOException;

import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Transient;

/**
 *
 * @author Maciej Apelgrim
 */
@Entity
public class Item extends Model{
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    private String name;

    @OneToOne
    private Style style;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="GROUPS_ID")
    private Groups groups;


    private int size;
    private boolean visibility;
    
    @Transient private int resourcen_index;
    @Transient private Template template;
      public Item(){
    
        style = new Style();
      }
       public Item(String name, Style style, int size, boolean visibility) {
        this.name = name;
        this.style = style;
        this.size = size;
        this.visibility = visibility;
//        this.resourcen_index = resourcen_index;
    }
       
    public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
   //     System.out.println("##### Item  setName(String name):"+name);
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
     * @return the group
     */
    public Groups getGroups() {
        return groups;
    }

    /**
     * @param group the group to set
     */
    public void setGroups(Groups groups) {
        this.groups = groups;
    }

    /**
     * @return the size
     */
    public int getSize() {
        return size;
    }

    /**
     * @param size the size to set
     */
    public void setSize(int size) {
        this.size = size;
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

    /**
     * @return the resourcen_index
     */
    public int getResourcen_index() {
        return resourcen_index;
    }

    /**
     * @param resourcen_index the resourcen_index to set
     */
    public void setResourcen_index(int resourcen_index) {
        this.resourcen_index = resourcen_index;
    }

    void saveAll(String path,EntityManager em) throws IOException {
    	if(style != null){ 
    		style.setTemplate(template);
        	style.saveAll(path,em);
        }
        save(em);
    }
	public void save(String path) throws IOException {
		if(style != null) style.save(path);
		
	}
	
	public String toJSON() {
		StringBuffer sb = new StringBuffer();
		sb.append("{style:"+style.toJSON()+",name:'"+name+"',size:"+size+",visibility:"+visibility+",id:"+id+"}");
		return sb.toString();
	}
	public Item copy(String key) {
		return new Item(name,style.copy(key), size, visibility);
	}
	@Override
    public String toString() {
    	return "name:"+name+", visibility:"+visibility;
    }
	public void setTemplate(Template template) {
		this.template = template;
		
	}
   
}
