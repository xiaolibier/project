package com.zhb.util;

/**
 * Created by zhouhaibin on 2016/11/14.
 */
public class VerifyError {
    public static final int TYPE_IS_NULL = 0;
    public static final int TYPE_EXCEED_MAX_LENGTH = 1;

    int type = TYPE_IS_NULL;
    String fieldName;
    int maxLength;

    public VerifyError() {
    }

    public VerifyError(int type, String fieldName, int maxLength) {
        this.type = type;
        this.fieldName = fieldName;
        this.maxLength = maxLength;
    }

    public static VerifyError isNull(String fieldName) {
        return new VerifyError(TYPE_IS_NULL, fieldName, 0);
    }

    public static VerifyError exceedMaxLength(String fieldName, int maxLength) {
        return new VerifyError(TYPE_EXCEED_MAX_LENGTH, fieldName, maxLength);
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public int getMaxLength() {
        return maxLength;
    }

    public void setMaxLength(int maxLength) {
        this.maxLength = maxLength;
    }
}
