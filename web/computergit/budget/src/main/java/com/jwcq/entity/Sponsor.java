package com.jwcq.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by liuma on 2017/6/7.
 */
@Entity
@Table(name="sponsor")
public class Sponsor {
    @Id
    @GeneratedValue
    private int id;

    private String name;

    private String code;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }



}
