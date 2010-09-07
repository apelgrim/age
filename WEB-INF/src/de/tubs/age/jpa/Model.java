package de.tubs.age.jpa;

import java.io.IOException;

import javax.persistence.EntityManager;
import javax.persistence.Transient;

import de.tubs.age.jpa.manager.EntityManagerUtil;

public abstract class Model {
	
	@Transient public static final String IMAGES_PATH = "C:\\jetty7_0_2\\webapps\\age\\images\\game\\";
	public abstract int getId();
	protected void save(EntityManager em) throws IOException{

		System.out.println(" ########### EntityManager persitst class:"+this.getClass()+", "+this.toString()+",\n###Entity ID:"+this.getId()); 	
		if(getId() > 0 ) em.merge(this);
		else  em.persist(this);
	}
	
}
