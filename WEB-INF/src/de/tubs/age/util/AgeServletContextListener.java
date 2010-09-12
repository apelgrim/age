package de.tubs.age.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class AgeServletContextListener implements ServletContextListener{

	@Override
	public void contextDestroyed(ServletContextEvent event) {

		
	}

	@Override
	public void contextInitialized(ServletContextEvent event) {
		String real_path = event.getServletContext().getRealPath(".");
		AgeUtil.SERVER_CONTENT_REAL_PATH=real_path+AgeUtil.FS;
		AgeUtil.CONTEXT_PATH = event.getServletContext().getContextPath();
	}

}
