package com.jwcq.entity;


import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;

/**
 * Created by liuma on 2017/5/18.
 */
@Entity
@Table(name="budget_summary")
public class Project {




    @Id
    @GeneratedValue
    private int id;
    @NotNull
    @Size(min = 1, max = 64, message = "serial_number have to be grater than 1 characters and less than 64 characters")
    private String serial_number;

    private int version_num;
    @NotNull
    @Size(min = 1, max = 64, message = "version have to be grater than 1 characters and less than 64 characters")
    private String version;

    private String pversion;
    private String name;
    private String center_number;

    private String type;
    private String budget_price;
    private String sponsor;
    private String sponsor_code;
    private String remarks;



    private Date create_time;
    private String json1;
    private String json2;
    private String json3;
    private String json4;


    private String json5;

    private String state;

    private String user;

    private String user_phone;






    @Column(name = "is_delete",nullable=false,length=1,columnDefinition="INT default 0")
    private int is_delete;//是否入报告,0没有删除，1删除

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getSerial_number() {
        return serial_number;
    }

    public void setSerial_number(String serial_number) {
        this.serial_number = serial_number;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getPversion() {
        return pversion;
    }

    public void setPversion(String pversion) {
        this.pversion = pversion;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCenter_number() {
        return center_number;
    }

    public void setCenter_number(String center_number) {
        this.center_number = center_number;
    }

    public String getBudget_price() {
        return budget_price;
    }

    public void setBudget_price(String budget_price) {
        this.budget_price = budget_price;
    }

    public String getSponsor() {
        return sponsor;
    }

    public void setSponsor(String sponsor) {
        this.sponsor = sponsor;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getJson1() {
        return json1;
    }

    public void setJson1(String json1) {
        this.json1 = json1;
    }

    public String getJson2() {
        return json2;
    }

    public void setJson2(String json2) {
        this.json2 = json2;
    }

    public String getJson3() {
        return json3;
    }

    public void setJson3(String json3) {
        this.json3 = json3;
    }

    public String getJson4() {
        return json4;
    }

    public void setJson4(String json4) {
        this.json4 = json4;
    }

    public Date getCreate_time() {
        return create_time;
    }

    public int getVersion_num() {
        return version_num;
    }

    public void setVersion_num(int version_num) {
        this.version_num = version_num;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getSponsor_code() {
        return sponsor_code;
    }

    public void setSponsor_code(String sponsor_code) {
        this.sponsor_code = sponsor_code;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getJson5() {
        return json5;
    }

    public void setJson5(String json5) {
        this.json5 = json5;
    }

    public String getUser_phone() {
        return user_phone;
    }

    public void setUser_phone(String user_phone) {
        this.user_phone = user_phone;
    }

    public int getIs_delete() {
        return is_delete;
    }

    public void setIs_delete(int is_delete) {
        this.is_delete = is_delete;
    }
}
