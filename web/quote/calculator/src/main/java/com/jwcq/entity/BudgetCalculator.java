package com.jwcq.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;


/**
 * Created by luotuo on 17-5-19.
 */


@Entity
@Table(name = "open_budget_calculator")
public class BudgetCalculator {
    @Id
    @GeneratedValue
    private Long id;
    private String type;        // '预算类型',
    private String name;        // '项目简称',
    private String audit_num;   // '稽查次数',
    private String patient_num; //'稽查病例数',
    private String center_num;  //'稽查中心数',
    private String audit_time;  //'稽查服务时间',
    private String travell_cost;// '差旅费',
    private String tech_serve_cost;//'技术服务费',
    private String tax;         //'税费',
    private String total_cost;  //'总费用',
    private String average_cost;//平均费用
    private Long user_id;       //'用户id',
    private String ip;          //'ip地址',
    private Date create_time; //创建时间

    public BudgetCalculator() {
        super();
    }

    public BudgetCalculator(String type, String name, String audit_num,
                            String patient_num, String center_num, String audit_time,
                            String travell_cost, String tech_serve_cost, String average_cost, String tax, String total_cost
    ) {
        this.type = type;
        this.name = name;
        this.audit_num = audit_num;
        this.patient_num = patient_num;
        this.center_num = center_num;
        this.audit_num = audit_num;
        this.travell_cost = travell_cost;
        this.tech_serve_cost = tech_serve_cost;
        this.tax = tax;
        this.audit_time = audit_time;
        this.total_cost = total_cost;
        this.average_cost = average_cost;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAudit_num() {
        return audit_num;
    }

    public void setAudit_num(String audit_num) {
        this.audit_num = audit_num;
    }

    public String getPatient_num() {
        return patient_num;
    }

    public void setPatient_num(String patient_num) {
        this.patient_num = patient_num;
    }

    public String getCenter_num() {
        return center_num;
    }

    public void setCenter_num(String center_num) {
        this.center_num = center_num;
    }

    public String getAudit_time() {
        return audit_time;
    }

    public void setAudit_time(String audit_time) {
        this.audit_time = audit_time;
    }

    public String getTravell_cost() {
        return travell_cost;
    }

    public void setTravell_cost(String travell_cost) {
        this.travell_cost = travell_cost;
    }

    public String getTech_serve_cost() {
        return tech_serve_cost;
    }

    public void setTech_serve_cost(String tech_serve_cost) {
        this.tech_serve_cost = tech_serve_cost;
    }

    public String getTax() {
        return tax;
    }

    public void setTax(String tax) {
        this.tax = tax;
    }

    public String getTotal_cost() {
        return total_cost;
    }

    public void setTotal_cost(String total_cost) {
        this.total_cost = total_cost;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    public String getAverage_cost() {
        return average_cost;
    }

    public void setAverage_cost(String average_cost) {
        this.average_cost = average_cost;
    }
}
