package com.zhb.view;

import com.zhb.bean.Discovery;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhouhaibin on 2016/10/7.
 * 报告里的第三层数据，受试者的视图
 */
public class DiscoveryPatientView {
    int index = 0;
    String patientNo;
    List<Discovery> discoveryViews = new ArrayList<>();

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public List<Discovery> getDiscoveryViews() {
        return discoveryViews;
    }

    public void setDiscoveryViews(List<Discovery> discoveryViews) {
        this.discoveryViews = discoveryViews;
    }

    public String getPatientNo() {
        return patientNo;
    }

    public void setPatientNo(String patientNo) {
        this.patientNo = patientNo;
    }

    public void addDiscovery(Discovery discovery) {
        discovery.setIndex(discoveryViews.size() + 1);
        discoveryViews.add(discovery);
    }
}
