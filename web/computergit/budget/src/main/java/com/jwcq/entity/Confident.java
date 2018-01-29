package com.jwcq.entity;

import com.jwcq.utils.Format;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;


/**
 * Created by liuma on 17-9-19.
 */

@Entity
@Table(name = "confident")
public class Confident {
    @Id
    @GeneratedValue
    private Long id;
    private String code;//保密协议编号
    @Transient
    private String originCode;//原始保密协议编号
    private String project_name;//项目名称
    private Long user_id;//用户id
    private String user_name;//用户名称
    private String sponsor;//申办方名称
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date create_time;//创建时间

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getProject_name() {
        return project_name;
    }

    public void setProject_name(String project_name) {
        this.project_name = project_name;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    public String getSponsor() {
        return sponsor;
    }

    public void setSponsor(String sponsor) {
        this.sponsor = sponsor;
    }

    public String getOriginCode() {
        return "3A-"+Format.formatCode(this.id,4);
    }

    public void setOriginCode(String originCode) {
        this.originCode = originCode;
    }
}
