package com.zhb.bean;

import com.zhb.core.ObjectBase;

/**
 * Created by zhouhaibin on 2016/9/27.
 * 字段，用于描述模块记录的字段
 */
public class Field extends ObjectBase {
    public static final int TYPE_STRING = 0;//单行文本
    public static final int TYPE_DATE = 1;//日期
    public static final int TYPE_LIMITED_WORD = 2;//选项
    public static final int TYPE_INTEGER = 3;//整数
    public static final int TYPE_TEXT = 4;//多行文本
    public static final int TYPE_MULTI_SELECT = 5;//多选

    int type = TYPE_STRING;//字段类型
    LimitedWord limitedWord;//受控词
    boolean readonly = false;//是否只读
    String inheritFrom;//继承，如果有值，表示此字段的值继承自项目
    boolean nullable = true;//是否可空

    public boolean isNullable() {
        return nullable;
    }

    public void setNullable(boolean nullable) {
        this.nullable = nullable;
    }

    public String getInheritFrom() {
        return inheritFrom;
    }

    public void setInheritFrom(String inheritFrom) {
        this.inheritFrom = inheritFrom;
    }

    public boolean isReadonly() {
        return readonly;
    }

    public void setReadonly(boolean readonly) {
        this.readonly = readonly;
    }

    public LimitedWord getLimitedWord() {
        return limitedWord;
    }

    public void setLimitedWord(LimitedWord limitedWord) {
        this.limitedWord = limitedWord;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }
}
