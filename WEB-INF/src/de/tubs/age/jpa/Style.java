/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package de.tubs.age.jpa;

import java.awt.Graphics2D;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.File;
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

import de.tubs.age.util.AgeUtil;

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
    @Transient public boolean saveImagePermission = true;
    
    
	private String bgImageName;
	private String imagesPath;
    private int left;
    private int top;
    private int zIndex;
    @Transient private Template template;

    public Style(){
    }

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
    	this.setBgImageName(style.getBgImageName());
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
  //  	System.out.println("\n\n#######  setBgImageName("+bgImageName+") sec:"+sec+" #######\n\n");
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
    //	System.out.println("Style. setLeft:"+left);
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
    //	System.out.println("Style. setTop:"+top);
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
       if(path!=null) saveImage(path);
        save(em);
      
      
    }
     private BufferedImage rotateImage(BufferedImage src, double degrees, int img_type) {
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
       
        BufferedImage rotatedImage = new BufferedImage(_width,_height, img_type);
        Graphics2D g = (Graphics2D) rotatedImage.getGraphics();
        g.setTransform(affineTransform);
        g.drawImage(src, x, y, null);
        return rotatedImage;
    }
    private void saveImage(String path) throws IOException {
    	FileItem imageItem = getBgImageFileItem();
        if (imageItem != null){
        	if(imageItem.getSize() > 0) createImages(ImageIO.read(imageItem.getInputStream()),path,imageItem.getName());
        	else{
        		if(template != null && bgImageName != null){
        			String fileName =  extractFileNameFromURI(bgImageName);
        			String realImagePath= AgeUtil.SERVER_CONTENT_REAL_PATH+"images"+AgeUtil.FS+"templates"+AgeUtil.FS+template.getId()+AgeUtil.FS+fileName;
        			System.out.println("Style save Imate realImagePath= "+realImagePath+" fileName: "+fileName);
        			File imageFromTemplate = new File(realImagePath);
            		createImages(ImageIO.read(imageFromTemplate), path,fileName);
            	}
        	}	
        }
    }
    private String extractFileNameFromURI(String imageURI) {
    //	System.out.println("\n\n###### extractFileNameFromURI("+imageURI+")  #######\n\n");
		String[] tmp = imageURI.split("/");	
		return tmp[tmp.length-1];
	}

	private void createImages(BufferedImage image,String path,String imageName) throws IOException{
    	 if(image!=null){
    		
             this.setBgImageName(imageName);
             this.setImagesPath(path);
             
             if(saveImagePermission){
            	 String IMAGE_PATH = GAME_REAL_IMAGES_PATH +path+AgeUtil.FS;
                 File dir = new File(IMAGE_PATH);
                 if(!dir.exists()) dir.mkdirs();
                 System.out.println("createImages src.getType():"+image.getType());
                 String img_ext = getImageExtension(imageName).toLowerCase();
                 int img_type = image.getType();
                 if(img_type==BufferedImage.TYPE_CUSTOM) img_type=typegetImgTypeFromExt(img_ext);
             	 ImageIO.write(image, img_ext, new File(IMAGE_PATH + "0_" + imageName));
             	 ImageIO.write(rotateImage(image, 90.0,img_type), img_ext, new File(IMAGE_PATH + "270_" + imageName));
             	 ImageIO.write(rotateImage(image, 180.0,img_type), img_ext, new File(IMAGE_PATH + "180_" + imageName));
             	 ImageIO.write(rotateImage(image, 270.0,img_type), img_ext, new File(IMAGE_PATH + "90_" + imageName));       	 
             }

         }else System.out.println("Style.createImages() image is NULL.");
    }
    private int typegetImgTypeFromExt(String img_ext) {
		if(img_ext.equals("gif")) return BufferedImage.TYPE_BYTE_INDEXED;
		else if(img_ext.equals("jpg")) return BufferedImage.TYPE_3BYTE_BGR;
		else return BufferedImage.TYPE_4BYTE_ABGR;
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
		sb.append("{height:"+height+",width:"+width+",bgColor:"+_bgColor+",imageName:"+_bgImageName+",left:"+left+",top:"+top+",zIndex:"+zIndex+"}");
		return sb.toString();
	}
	public Style copy(String key) {	
			//System.out.println("STYLE: copy key:"+key);
			if(key != null && bgImageName!=null){
				String toDir = GAME_REAL_IMAGES_PATH +key+AgeUtil.FS;
				String fromDir = GAME_REAL_IMAGES_PATH +imagesPath+AgeUtil.FS;
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
     //       System.out.println("STYLE: copy "+fromFileName+" to "+toFileName);
			FileUtils.copyFile(fromFile, toFile);
		} catch (IOException e) {
		//	e.printStackTrace();
		}
    }

	public void setTemplate(Template template) {
		this.template = template;
		
	}

	public int getzIndex() {
		return zIndex;
	}

	public void setzIndex(int zIndex) {
		this.zIndex = zIndex;
	}

	public Style copy() {
		Style style = new Style(height,width, bgColor, bgImageFileItem, left, top);
		style.setzIndex(zIndex);
		System.out.println("+ style copy bgImageName:"+bgImageName+" imagesPath:"+imagesPath);
		style.setBgImageName(bgImageName);
		style.setImagesPath(imagesPath);
		style.saveImagePermission=false;
		return style;
	}
	
}
