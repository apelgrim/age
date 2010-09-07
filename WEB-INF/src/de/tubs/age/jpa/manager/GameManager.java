/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package de.tubs.age.jpa.manager;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Query;

import de.tubs.age.jpa.Game;
import de.tubs.age.jpa.Model;
import de.tubs.age.util.GameLoader;

/**
 *
 * @author Maciej Apelgrim
 */

public class GameManager {
	
	//java -cp hsqldb-1.8.0.1.jar org.hsqldb.util.DatabaseManagerSwing
	//http://www.java2s.com/Code/Java/JPA/OneToManyMappedBy.htm

    public GameManager() {
    }

    public Game createInstance(Game game,String key) throws IOException{
    	if(!game.isInstance()){ 
    		Game _game = game.createInstance(key);
    		saveGame(_game);
    		return _game;
    	}
    	return null;
    }
    public List<Game> getGames(){
    	 Query query = EntityManagerUtil.getEntityManager().createQuery("SELECT g FROM Game g WHERE parent_id=NULL");
    	 @SuppressWarnings("unchecked")
		List<Game>  games = query.getResultList();
    	return games;
    }
	public Game loadInstance(String key){	
		Game game = loadGame(key);
		if(game.isInstance()) return game;
		return null;
	}
    public Game loadGame(String key){
    	return GameLoader.loadGame(key);
    }
	public void saveGame(Game _game) throws IOException {
		EntityManager em = EntityManagerUtil.getEntityManager();   	
    	em.getTransaction().begin();
    	_game.saveAll(em);
        em.getTransaction().commit();	
	}

}
