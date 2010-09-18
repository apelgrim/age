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

import de.tubs.age.util.IAgeGameElement;

/**
 *
 * @author Maciej Apelgrim
 */
@Entity
public class Item extends Model implements IAgeGameElement{
	
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    
    private String name;

    @OneToOne
    private Style style;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="GROUPS_ID")
    private Groups groups;

    private int group_by;
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

   
    public void setName(String name) {
        this.name = name;
    }

  
    public Style getStyle() {
        return style;
    }
    public void setStyle(Style style) {
        this.style = style;
    }

    public Groups getGroups() {
        return groups;
    }

    public void setGroups(Groups groups) {
        this.groups = groups;
    }

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
		sb.append("{style:"+style.toJSON()+",name:'"+name+"',count:"+size+",visibility:"+visibility+",id:"+id+",groupBy:"+group_by+"}");
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

	public Item copy() {
		Item itm = new Item(name,style,size,visibility);
		itm.setId(0);
		itm.setStyle(style.copy());
		itm.setGroup_by(group_by);
		return itm;
	}
	public int getGroup_by() {
		return group_by;
	}
	public void setGroup_by(int group_by) {
		this.group_by = group_by;
	}
	public int getSize() {
		return size;
	}
	public void setSize(int size) {
		this.size = size;
	}
	
	
	
   
}
