package de.tubs.age.blocking;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import org.atmosphere.cpr.AtmosphereResource;


public class LongPolling  extends Comet {

	@Override
	public void onRequest(
			AtmosphereResource<HttpServletRequest, HttpServletResponse> atmoResource)
			throws IOException {
		// TODO Auto-generated method stub
		
	}

}
