/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package de.tubs.age.jpa;

import java.awt.Graphics2D;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;
import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.io.FileUtils;

/**
 *
 * @author Maciej Apelgrim
 */
@Entity
public class Style  extends Model{
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    private int height;
    private int width;
    private String bgColor;

    @Transient public File bgImage;
    @Transient public InputStream  bgImageStream;
    
    @Transient public byte[] bgImageData;
    @Transient public FileItem bgImageFileItem;
    
    


	private String bgImageName;
	private String imagesPath;
    private int left;
    private int top;

    public Style(){}
    public Style(int height, int width, String bgColor, FileItem bgImageFileItem, int left, int top) {
        this.height = height;
        this.width = width;
        this.bgColor = bgColor;
        this.bgImageFileItem = bgImageFileItem;
        this.left = left;
        this.top = top;
    }
	@Override
	public int getId() {
		return id;
	}
    public FileItem getBgImageFileItem() {
		return bgImageFileItem;
	}
	public void setBgImageFileItem(FileItem bgImageFileItem) {
	//	System.out.println("+++++++++++++ style bgImageFileItem:"+bgImageFileItem);
		this.bgImageFileItem = bgImageFileItem;
	}
    public byte[] getBgImageData() {
		return bgImageData;
	}
	public void setBgImageData(byte[] bgImageData) {
		this.bgImageData = bgImageData;
	}
	public InputStream getBgImageStream() {
		return bgImageStream;
	}
	public void setBgImageStream(InputStream bgImageStream) {
		this.bgImageStream = bgImageStream;
	}
	/**
     * @return the height
     */
    public int getHeight() {
        return height;
    }

    /**
     * @param height the height to set
     */
    public void setHeight(int height) {
   // 	 System.out.println("#####  style setHeight:"+height);
        this.height = height;
    }

    /**
     * @return the width
     */
    public int getWidth() {
        return width;
    }

    /**
     * @param width the width to set
     */
    public void setWidth(int width) {
        this.width = width;
    }

    /**
     * @return the bgColor
     */
    public String getBgColor() {
        return bgColor;
    }

    /**
     * @param bgColor the bgColor to set
     */
    public void setBgColor(String bgColor) {
        this.bgColor = bgColor;
    }

    /**
     * @return the bgImage
     */
    public File getBgImage() {
        return bgImage;
    }

    /**
     * @param bgImage the bgImage to set
     */
    public void setBgImage(File bgImage) {
   // 	System.out.println("## Style setBgImage(File bgImage) null? "+(bgImage==null));
        this.bgImage = bgImage;
    }
    public void assignStyle(Style style){
    	this.setBgColor(style.getBgColor());
    	this.setHeight(style.getHeight());
    	this.setWidth(style.getWidth());
    	this.setBgImageFileItem(style.getBgImageFileItem());
    	this.setLeft(style.getLeft());
    	this.setTop(style.getTop());
    }
    /**
     * @return the bgImageName
     */
    public String getBgImageName() {
        return bgImageName;
    }

    /**
     * @param bgImageName the bgImageName to set
     */
    public void setBgImageName(String bgImageName) {
        this.bgImageName = bgImageName;
    }

    /**
     * @return the left
     */
    public int getLeft() {
        return left;
    }

    /**
     * @param left the left to set
     */
    public void setLeft(int left) {
        this.left = left;
    }

    /**
     * @return the top
     */
    public int getTop() {
        return top;
    }

    /**
     * @param top the top to set
     */
    public void setTop(int top) {
        this.top = top;
    }

    /**
     * @return the imagesPath
     */
    public String getImagesPath() {
        return imagesPath;
    }

    /**
     * @param imagesPath the imagesPath to set
     */
    public void setImagesPath(String imagesPath) {
        this.imagesPath = imagesPath;
    }

    public void saveAll(String path,EntityManager em) throws IOException {
    //    System.out.println("###### public void saveAll(String path):"+bgImage);
        if(path!=null) saveImage(path);
        save(em);
      
      
    }
     private BufferedImage rotateImage(BufferedImage src, double degrees) {
        int _width=src.getWidth();
        int _height=src.getHeight();
        int x = 0;
        int y = 0;
        if(degrees == 90.0 || degrees == 270.0){
             _width=src.getHeight();
             _height=src.getWidth();
             x = src.getHeight() / 2 - src.getWidth()/2;
             y = src.getWidth()/2 - src.getHeight() / 2 ;
             if(degrees == 90.0 ) x=-x;
             else  y = -y;
        }
        AffineTransform affineTransform = AffineTransform.getRotateInstance(Math.toRadians(degrees),src.getWidth() / 2,src.getHeight() / 2);
        BufferedImage rotatedImage = new BufferedImage(_width,_height, src.getType());
        Graphics2D g = (Graphics2D) rotatedImage.getGraphics();
        g.setTransform(affineTransform);
        g.drawImage(src, x, y, null);
        return rotatedImage;
    }
    private int max(int a, int b){
        return a>b ? a : b;
    }

    private void saveImage(String path) throws IOException {
    	FileItem imageItem = getBgImageFileItem();
        if (imageItem != null) {
       // 	try{
            String IMAGE_PATH = IMAGES_PATH+path+"\\";



            BufferedImage image = ImageIO.read(imageItem.getInputStream());
        //    System.out.println("#################### imageItem:"+imageItem+" ###############");
            
            if(image!=null){
                File dir = new File(IMAGE_PATH);
                if(!dir.exists()) dir.mkdirs();
                String outputFilePath = imageItem.getName();
                this.setBgImageName(outputFilePath);
                this.setImagesPath(path);
                String img_ext = getImageExtension(imageItem.getName()).toLowerCase();
            //      Logger.getAnonymousLogger().info("######## getImageExtension(bg_image.getName()):"+img_ext);
        //    System.out.println("#################### image:"+image+", img_ext:"+img_ext+", new File(IMAGE_PATH:"+IMAGE_PATH+"  outputFilePath:"+outputFilePath+") ###############");
            	ImageIO.write(image, img_ext, new File(IMAGE_PATH + "0_" + outputFilePath));
            	ImageIO.write(rotateImage(image, 90.0), img_ext, new File(IMAGE_PATH + "270_" + outputFilePath));
            	ImageIO.write(rotateImage(image, 180.0), img_ext, new File(IMAGE_PATH + "180_" + outputFilePath));
            	ImageIO.write(rotateImage(image, 270.0), img_ext, new File(IMAGE_PATH + "90_" + outputFilePath));
            }
            else {
            	
            }
       // 	}
       // 	catch(IllegalArgumentException e){
       // 		 System.out.println("#################### STYLE SAVE IMAGE ERROR:IllegalArgumentException ###############");
       // 	}
        }
    }

    private String getImageExtension(String name) {
        String[] e = name.split("\\.");
        return e.length > 0 ? e[e.length-1] : "png";
    }
	public void save(String path) throws IOException {
		 saveImage(path);
		
	}
	@Override
    public String toString() {
    	return "height:"+height+", width:"+width+", bgColor:"+bgColor+", bgImageFileItem:"+bgImageFileItem+", bgImageName:"+bgImageName+", left:"+left+", top:"+top;
    }
	/**
	 *     private int id;
    private int height;
    private int ;
    private String bgColor;

    @Transient public File bgImage;
    @Transient public InputStream  bgImageStream;
    @Transient private String imagesPath;
    @Transient public byte[] bgImageData;
    @Transient public FileItem bgImageFileItem;
    


	private String bgImageName;
    private int left;
    private int top;
	 * @return
	 */
	public String toJSON() {
		StringBuffer sb = new StringBuffer();
		String _bgImageName = bgImageName == null?bgImageName:"'"+bgImageName+"'";
		String _bgColor = bgColor==null?bgColor:"'"+bgColor+"'";
		sb.append("{height:"+height+",width:"+width+",bgColor:"+_bgColor+",imageName:"+_bgImageName+",left:"+left+",top:"+top+"}");
		return sb.toString();
	}
	public Style copy(String key) {	
		if(key != null){
		String toDir = IMAGES_PATH+key+"\\";
		String fromDir = IMAGES_PATH+imagesPath+"\\";
		File dir = new File(toDir);
        if(!dir.exists()) dir.mkdirs();
        copyFiles(fromDir+"0_"+bgImageName,toDir+"0_"+bgImageName);
        copyFiles(fromDir+"90_"+bgImageName,toDir+"90_"+bgImageName);
        copyFiles(fromDir+"180_"+bgImageName,toDir+"180_"+bgImageName);
        copyFiles(fromDir+"270_"+bgImageName,toDir+"270_"+bgImageName);
		}
		Style style =  new Style(height,width,bgColor,bgImageFileItem,left,top);
		style.setBgImageName(bgImageName);
		style.setImagesPath(imagesPath);
		return style;
	}
    private void copyFiles(String fromFileName,String toFileName){
    	
        try {
        	File fromFile = new File(fromFileName);
            File toFile = new File(toFileName);
            System.out.println("STYLE: copy "+fromFileName+" to "+toFileName);
			FileUtils.copyFile(fromFile, toFile);
		} catch (IOException e) {
		//	e.printStackTrace();
		}
    }

}
