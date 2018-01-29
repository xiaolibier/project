package com.zhb.bean;

import com.zhb.core.ObjectBase;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 中心
 */
public class Center extends ObjectBase {
    String firstChar;//名称汉语拼音首字母，用于过滤
    String type;//机构类型
    String province = "";//省
    String city = "";//市
    String town = "";//区县
    String website;//医院网站
    String address;//医院地址
    String contact;//联系方式
    String department;//科室
    String certificate;//证书


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

    public String getTown() {
        return town;
    }

    public void setTown(String town) {
        this.town = town;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getCertificate() {
        return certificate;
    }

    public void setCertificate(String certificate) {
        this.certificate = certificate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFirstChar() {
        return firstChar;
    }

    public void setFirstChar(String firstChar) {
        this.firstChar = firstChar;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {
        Center center = (Center)object;
        this.name = center.getName();
        this.type = center.getType();
        this.province = center.getProvince();
        this.city = center.getCity();
        this.town = center.getTown();
        this.website = center.getWebsite();
        this.address = center.getAddress();
        this.contact = center.getContact();
        this.certificate = center.getCertificate();
        this.department = center.getDepartment();
    }
}
