package de.tubs.age.util;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.codec.binary.StringUtils;

public class AgeUtil {
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
