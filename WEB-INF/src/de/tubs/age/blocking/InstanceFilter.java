package de.tubs.age.blocking;

import org.atmosphere.cpr.BroadcastFilter;
import org.atmosphere.cpr.BroadcastFilter.BroadcastAction;
import org.atmosphere.cpr.BroadcastFilter.BroadcastAction.ACTION;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.ClusterBroadcastFilter;

public class InstanceFilter implements ClusterBroadcastFilter{

	private String name;
	private AgeBroadcaster bc;
	public InstanceFilter(){
		System.out.println("InstanceFilter. CONSTRUCTOR ()");
	}
    public InstanceFilter(AgeBroadcaster bc,String name){
    	System.out.println("InstanceFilter. CONSTRUCTOR (bc:"+bc+"  id:"+bc.getID()+")");
		this.bc=bc;
		
		this.name = name;
	}

	@Override
	public BroadcastAction filter(Object o) {
        if(o != null){		
	 		String message = (String) o;
			String _key = "";
			String msg = "";
	        String[] s = message.split("\\*\\*");
			if (s.length > 1){
				_key=s[0];
				 msg=s[1];
			}else msg=s[0];
	//		System.out.println("\n\n####InstanceFilter. bc.id():"+bc.getID()+" msg:"+msg+" \n_key:"+_key+"\n#####\n\n");
		//	if(_key.equals(bc.getID())) return new BroadcastAction(msg);
        }
		return new BroadcastAction(o);
	}



	@Override
	public void init() {
		System.out.println("InstanceFilter.init()");
	//	bc.printEvents();
	}
	@Override
	public void destroy() {
		System.out.println("InstanceFilter.destroy()");
		
	}
//	@Override
//	public BroadcastAction filter(Object o) {
//		return new BroadcastAction(o);
//	}
	@Override
	public void setClusterName(String name) {
		System.out.println("InstanceFilter.setClusterName(name) "+name);
		
	}
	@Override
	public void setBroadcaster(Broadcaster bc) {
		System.out.println("InstanceFilter.setBroadcaster(Broadcaster bc) "+bc);
		this.bc = (AgeBroadcaster) bc;
		
	}
	@Override
	public Broadcaster getBroadcaster() {
		System.out.println("InstanceFilter.getBroadcaster() ");
		return bc;
	}


}
