package com.zhb.bean;

import com.zhb.core.ObjectBase;

/**
 * Created by zhouhaibin on 2016/11/3.
 * 区县，用于中心管理
 */
public class Town extends ObjectBase {
    String province;//所属省
    String city;//所属市

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }
}
