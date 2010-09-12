package de.tubs.age.jpa;

import java.io.IOException;

import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import de.tubs.age.jpa.manager.EntityManagerUtil;
import de.tubs.age.util.AgeElements;
@Entity
public class Template  extends Model{

    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    private String name;
    private String value;
	private AgeElements element;
	
	
	
	@Override
	public int getId() {
		return id;
	}




	public String getName() {
		return name;
	}




	public void setName(String name) {
		this.name = name;
	}




	public String getValue() {
		return value;
	}




	public void setValue(String value) {
		this.value = value;
	}




	public void setId(int id) {
		this.id = id;
	}
    public void save() throws IOException{
		EntityManager em = EntityManagerUtil.getEntityManager();   	
    	em.getTransaction().begin();
    	super.save(em);
        em.getTransaction().commit();
    	
    }
    public String toString(){
    	return "name:"+name+" ,value:...";
    }




	public AgeElements getElement() {
		return element;
	}




	public void setElement(AgeElements element) {
		this.element = element;
	}
	public String toJSON() {
		return "{id:"+getId()+",element:'"+getElement()+"',name:'"+getName()+"',value:"+getValue()+"}";
	}
}
