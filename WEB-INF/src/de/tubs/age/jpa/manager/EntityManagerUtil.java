package de.tubs.age.jpa.manager;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class EntityManagerUtil {
	// private static EntityManager em;
	 private static EntityManagerFactory entityManagerFactory;
	    static {
	    	entityManagerFactory = Persistence.createEntityManagerFactory("ageclick");
	  //          em = entityManagerFactory.createEntityManager();
	    }
	    public static synchronized EntityManager getEntityManager() {
	         return entityManagerFactory.createEntityManager();
	    }
	    public static void clear(){
	 //   	em=null;
	    //	entityManagerFactory = Persistence.createEntityManagerFactory("ageclick");
	    }
}
