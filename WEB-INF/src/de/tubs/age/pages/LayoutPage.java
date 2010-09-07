package de.tubs.age.pages;

import org.apache.click.Page;
import org.apache.click.util.Bindable;

public class LayoutPage  extends Page {
	@Bindable protected String dir = "/age"; // /age
	
	public String getTemplate() {
	      return "/template.htm";
	   }
}
