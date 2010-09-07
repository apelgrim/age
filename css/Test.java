package de.tubs.age.blocking;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.atmosphere.cpr.AtmosphereHandler;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;

public class Test implements
AtmosphereHandler<HttpServletRequest, HttpServletResponse> {

	@Override
	public void onRequest(
			AtmosphereResource<HttpServletRequest, HttpServletResponse> arg0)
			throws IOException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onStateChange(
			AtmosphereResourceEvent<HttpServletRequest, HttpServletResponse> arg0)
			throws IOException {
		// TODO Auto-generated method stub
		
	}

}
