package com.zhb.bean;

import com.zhb.core.ObjectBase;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 阶段包含的中心
 */
public class StageCenter extends Center {
    String centerId;//中心Id
    String leaderId = EMPTY_OBJECT;//组长
    List<String> memberIdList = new ArrayList<>();//组员
    int canceled = 0;//是否被取消

    public int getCanceled() {
        return canceled;
    }

    public void setCanceled(int canceled) {
        this.canceled = canceled;
    }

    public String getCenterId() {
        return centerId;
    }

    public void setCenterId(String centerId) {
        this.centerId = centerId;
    }

    public String getLeaderId() {
        return leaderId;
    }

    public void setLeaderId(String leaderId) {
        this.leaderId = leaderId;
    }

    public List<String> getMemberIdList() {
        return memberIdList;
    }

    public void setMemberIdList(List<String> memberIdList) {
        this.memberIdList = memberIdList;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }
}
