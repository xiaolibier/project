package com.zhb.bean;

import com.zhb.core.ObjectBase;

import java.util.List;

/**
 * Created by zhouhaibin on 2016/9/27.
 * 受控词
 */
public class LimitedWord extends ObjectBase {
    public static final String ID_DISCOVERY_LEVEL = "稽查发现分级";
    List<String> words;//词条数组

    public List<String> getWords() {
        return words;
    }

    public void setWords(List<String> words) {
        this.words = words;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }
}
