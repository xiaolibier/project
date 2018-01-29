package com.zhb.bean;

/**
 * Created by zhouhaibin on 2016/10/5.
 * 项目里包含的中心
 */
public class ProjectCenter extends Center {
    String code;//中心编号
    String principal;//项目负责人
    String operateDepartment;//实施科室
    String researcher;//主要研究人

    public String getPrincipal() {
        return principal;
    }

    public void setPrincipal(String principal) {
        this.principal = principal;
    }

    public String getResearcher() {
        return researcher;
    }

    public void setResearcher(String researcher) {
        this.researcher = researcher;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getOperateDepartment() {
        return operateDepartment;
    }

    public void setOperateDepartment(String operateDepartment) {
        this.operateDepartment = operateDepartment;
    }
}
