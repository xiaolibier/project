package com.zhb.core;

import java.text.Collator;
import java.util.Comparator;

/**
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 2011-11-22
 * Time: 17:25:13
 * To change this template use File | Settings | File Templates.
 */
public class ObjectNameComparator implements Comparator {
	//按照对象的名称拼音排序
	private static Collator collator = Collator.getInstance(java.util.Locale.CHINA);
    public int compare(Object o1, Object o2) {
        ObjectBase ob1 = (ObjectBase)o1;
        ObjectBase ob2 = (ObjectBase)o2;
        if (ob1.getName() == null || ob2.getName() == null)
        	return 0;

		String arg0 = ob1.getName();
		String arg1 = ob2.getName();
		arg0 = arg0.replaceAll("一", "00");
	    arg0 = arg0.replaceAll("二", "11");
	    arg0 = arg0.replaceAll("三", "22");
	    arg0 = arg0.replaceAll("四", "33");
	    arg0 = arg0.replaceAll("五", "44");
	    arg0 = arg0.replaceAll("六", "55");
	    arg0 = arg0.replaceAll("七", "66");
	    arg0 = arg0.replaceAll("八", "77");
	    arg0 = arg0.replaceAll("九", "88");
		arg0 = arg0.replaceAll("十", "99");

	    arg1 = arg1.replaceAll("一", "00");
	    arg1 = arg1.replaceAll("二", "11");
	    arg1 = arg1.replaceAll("三", "22");
	    arg1 = arg1.replaceAll("四", "33");
	    arg1 = arg1.replaceAll("五", "44");
	    arg1 = arg1.replaceAll("六", "55");
	    arg1 = arg1.replaceAll("七", "66");
	    arg1 = arg1.replaceAll("八", "77");
	    arg1 = arg1.replaceAll("九", "88");
		arg1 = arg1.replaceAll("十", "99");
        return collator.compare(arg0, arg1);
    }
}