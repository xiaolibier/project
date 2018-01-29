package com.zhb.view;

import com.zhb.bean.Discovery;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/10/7.
 * 报告的视图
 */
public class ReportView {
    String id;//报告Id
    boolean centerReport = true;//是否是单中心报告
    String projectId;//项目Id
    String purpose;//稽查目的
    String range;//稽查范围
    String foundation;//稽查依旧
    String overview;//稽查概述
    String overviewOpinion;//稽查概述的评审意见

    List<DiscoveryLevelView> levelViews = new ArrayList<>();//所有的第一层数据
    Map<String, CategoryLevelCount> categoryLevelCountMap = new HashMap<>();//统计表格的数据
    Map<String, Integer> levelCountMap = new HashMap<>();//按分级统计的发现总数

    public ReportView() {

    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public boolean isCenterReport() {
        return centerReport;
    }

    public void setCenterReport(boolean centerReport) {
        this.centerReport = centerReport;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getRange() {
        return range;
    }

    public void setRange(String range) {
        this.range = range;
    }

    public String getFoundation() {
        return foundation;
    }

    public void setFoundation(String foundation) {
        this.foundation = foundation;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getOverviewOpinion() {
        return overviewOpinion;
    }

    public void setOverviewOpinion(String overviewOpinion) {
        this.overviewOpinion = overviewOpinion;
    }

    public Map<String, CategoryLevelCount> getCategoryLevelCountMap() {
        return categoryLevelCountMap;
    }

    public Map<String, Integer> getLevelCountMap() {
        return levelCountMap;
    }

    public void setLevelCountMap(Map<String, Integer> levelCountMap) {
        this.levelCountMap = levelCountMap;
    }

    public void setCategoryLevelCountMap(Map<String, CategoryLevelCount> categoryLevelCountMap) {
        this.categoryLevelCountMap = categoryLevelCountMap;
    }

    public List<DiscoveryLevelView> getLevelViews() {
        return levelViews;
    }

    public void setLevelViews(List<DiscoveryLevelView> levelViews) {
        this.levelViews = levelViews;
    }

    public void addLevelView(DiscoveryLevelView levelView) {
        levelViews.add(levelView);
    }

    public DiscoveryLevelView findLevelView(String level) {
        for (DiscoveryLevelView view : levelViews) {
            if (view.getLevel().equals(level)) {
                return view;
            }
        }
        return null;
    }

    public void addDiscovery(Discovery discovery) {
        DiscoveryLevelView levelView = findLevelView(discovery.getLevel());
        if (levelView == null)
            return;
        levelView.addDiscovery(discovery);

        CategoryLevelCount categoryLevelCount = categoryLevelCountMap.get(discovery.getCategoryId());
        if (categoryLevelCount == null) {
            categoryLevelCount = new CategoryLevelCount();
            categoryLevelCount.addCenterType(discovery.getCenterType());
            categoryLevelCountMap.put(discovery.getCategoryId(), categoryLevelCount);
        }
        categoryLevelCount.addCount(discovery.getLevel(), discovery.getProblemId());


        //计算总和
        categoryLevelCount = categoryLevelCountMap.get("TOTAL");
        if (categoryLevelCount == null) {
            categoryLevelCount = new CategoryLevelCount();
            categoryLevelCountMap.put("TOTAL", categoryLevelCount);
        }
        categoryLevelCount.addCount(discovery.getLevel(), discovery.getProblemId());


        Integer count = levelCountMap.get(discovery.getLevel());
        if (count == null) {
            levelCountMap.put(discovery.getLevel(), 1);
        } else {
            levelCountMap.put(discovery.getLevel(), count + 1);
        }
    }

    public void addReference(DiscoveryReferenceView referenceView) {
        if (referenceView.getLevel() == null) {
            for (DiscoveryLevelView levelView : levelViews) {
                if (levelView.addReference(referenceView))
                    break;
            }
        } else {
            DiscoveryLevelView levelView = findLevelView(referenceView.getLevel());
            levelView.addReference(referenceView);
        }
    }
}
