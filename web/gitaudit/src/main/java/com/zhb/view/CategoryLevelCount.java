package com.zhb.view;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/10/7.
 * 报告里的分类分级计数，用于存储报告里的统计表格里的单元格的计数数据
 */
public class CategoryLevelCount {
    Map<String, Integer> levelCountMap = new HashMap<>();//这里存储里该分类下，所有分级的问题归类计数
    Map<String, HashSet> levelProblemMap = new HashMap<>();//这里存储里该分类下，所有分级的问题归类明细
    String centerType = "";//在阶段报告里，该分类的发现对应的机构类型（可能是多个，逗号隔开）

    public String getCenterType() {
        return centerType;
    }

    public void setCenterType(String centerType) {
        this.centerType = centerType;
    }

    public void addCount(String level, String problemId) {
        HashSet problemSet = levelProblemMap.get(level);
        if  (problemSet == null) {
            problemSet = new HashSet();
            levelProblemMap.put(level, problemSet);
        }
        problemSet.add(problemId);
        levelCountMap.put(level, problemSet.size());
    }

    public void addCenterType(String centerType) {
        if (this.centerType == null ||  this.centerType.isEmpty())
            this.centerType = centerType;
        else {
            if (this.centerType.indexOf(centerType) >= 0)
                return;
            this.centerType = this.centerType + "," + centerType;
        }
    }

    public Map<String, Integer> getLevelCountMap() {
        return levelCountMap;
    }

    public void setLevelCountMap(Map<String, Integer> levelCountMap) {
        this.levelCountMap = levelCountMap;
    }
}
