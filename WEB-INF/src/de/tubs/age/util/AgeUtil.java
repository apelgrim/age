package de.tubs.age.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.codec.binary.StringUtils;

public class AgeUtil {
	public static final String LS = System.getProperty("line.separator");
	public static final String FS = System.getProperty("file.separator");
	public static String SERVER_CONTENT_REAL_PATH=".";
	public static String CONTEXT_PATH = ".";
	public static int min(int a, int b){
		if(a < b) return a;
		return b;
	}
	public static String convertToKey(String text,int length){
		String key = StringUtils.newStringUsAscii(Base64.encodeBase64(DigestUtils.md5(text+System.currentTimeMillis()+Math.random())));
		key = (key.replace('+', 'x')).replace('/', 'f');
		return key.substring(0, length);
	}

}
