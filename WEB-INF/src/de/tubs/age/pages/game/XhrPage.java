package de.tubs.age.pages.game;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;

import org.apache.click.Context;
import org.apache.click.Page;
import org.apache.click.control.FileField;
import org.apache.click.control.Form;
import org.apache.click.util.Bindable;
import org.apache.click.util.ClickUtils;
import org.apache.commons.fileupload.FileItem;

import de.tubs.age.pages.LayoutPage;
import de.tubs.age.util.AgeUtil;

public class XhrPage  extends Page{
	@Bindable public String title = "Xhr"; 
    @Bindable protected String msg;
public XhrPage(){

    Context contex = getContext();
    HttpServletResponse response = getContext().getResponse();
    response.setContentType("application/json");
    FileItem file= contex.getFileItem("tmp.image");
    try {	
		msg = saveImage(file);
	} catch (IOException e) {
		e.printStackTrace();
	}
    
    
}
private String saveImage(FileItem file) throws IOException {
    if (file != null) {
        String IMAGE_PATH = AgeUtil.SERVER_CONTENT_REAL_PATH+"images"+AgeUtil.FS+"tmp"+AgeUtil.FS;
        System.out.println("++# get TMP IMAGE PATH:"+IMAGE_PATH);
        
        File dir = new File(IMAGE_PATH);
        BufferedImage image = ImageIO.read(file.getInputStream());
        if(image!= null){
        	if(!dir.exists()) dir.mkdirs();
        	String outputFileName = AgeUtil.convertToKey(getContext().getSession().getId(),16);
        	String img_ext = getImageExtension(file.getName()).toLowerCase();
        	String fileName = outputFileName+"."+img_ext;
        	ImageIO.write(image, img_ext, new File(IMAGE_PATH + "0_"+fileName));
        	System.out.println("++### XhrPage.saveImage file size:"+file.getSize());
        	return fileName;
        }else System.out.println("++#XhrPage.saveImage image is NULL!!! ");
        
    }
    return "";
}
private String getImageExtension(String name) {
    String[] e = name.split("\\.");
    return e.length > 0 ? e[e.length-1] : "png";
}

}
