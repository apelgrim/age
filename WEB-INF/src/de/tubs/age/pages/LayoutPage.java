package de.tubs.age.pages;

import org.apache.click.Page;
import org.apache.click.util.Bindable;

import de.tubs.age.util.AgeUtil;

public class LayoutPage  extends Page {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Bindable protected String dir = AgeUtil.CONTEXT_PATH;
	
	public String getTemplate() {
	      return "/template.htm";
	   }
}
