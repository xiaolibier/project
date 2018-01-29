package com.zhb.view;

import com.zhb.bean.Category;
import com.zhb.bean.Discovery;
import com.zhb.bean.Problem;
import com.zhb.manager.MemoryCache;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhouhaibin on 2016/10/7.
 * 报告里的第一层数据，分级的视图
 */
public class DiscoveryLevelView {
    int index = 0;
    String level;
    List<DiscoveryProblemView> problemViews = new ArrayList<>();

    public DiscoveryLevelView() {

    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public DiscoveryLevelView(String level) {
        this.level = level;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public List<DiscoveryProblemView> getProblemViews() {
        return problemViews;
    }

    public void setProblemViews(List<DiscoveryProblemView> problemViews) {
        this.problemViews = problemViews;
    }

    public DiscoveryProblemView findProblemView(String problemId) {
        for (DiscoveryProblemView view : problemViews) {
            if (view.getProblemId().equals(problemId))
                return view;
        }
        return null;
    }

    public void addDiscovery(Discovery discovery) {
        DiscoveryProblemView problemView = findProblemView(discovery.getProblemId());
        if (problemView == null) {
            Problem problem = (Problem)MemoryCache.getObject(Problem.class, discovery.getProblemId());
            if (problem == null)
                return;
            problemView = new DiscoveryProblemView(level, problem.getId(), problem.getName());
            problemView.setIndex(problemViews.size() + 1);
            String categoryName = getCategoryName(discovery.getCategoryId());
            problemView.setCategory(categoryName);
            problemViews.add(problemView);
        }
        problemView.addDiscovery(discovery);
    }

    private String getCategoryName(String categoryId) {
        Category category = (Category)MemoryCache.getObject(Category.class, categoryId);
        String categoryName = category.getName();
        int pos = categoryName.indexOf("（");
        if (pos != -1)
            categoryName = categoryName.substring(0, pos);
        else {
            pos = categoryName.indexOf("(");
            categoryName = categoryName.substring(0, pos);
        }
        return categoryName;
    }

    public boolean addReference(DiscoveryReferenceView referenceView) {
        DiscoveryProblemView problemView = findProblemView(referenceView.getProblemId());
        if (problemView == null)
            return false;
        problemView.addReference(referenceView);
        referenceView.formatId();
        return true;
    }
}
