package de.tubs.age.jpa;

import java.io.IOException;

import javax.persistence.EntityManager;
import javax.persistence.Transient;

import de.tubs.age.jpa.manager.EntityManagerUtil;
import de.tubs.age.util.AgeUtil;

public abstract class Model {
	
	@Transient public static final String GAME_REAL_IMAGES_PATH = AgeUtil.SERVER_CONTENT_REAL_PATH+"images"+AgeUtil.FS+"game"+AgeUtil.FS;
	
	public abstract int getId();
	public abstract String toJSON();
	protected void save(EntityManager em) throws IOException{
		System.out.println(" ########### EntityManager persitst class:"+this.getClass()+", "+this.toString()+",\n###Entity ID:"+this.getId()); 	
		if(getId() > 0 ) em.merge(this);
		else  em.persist(this);
	}
	
}
