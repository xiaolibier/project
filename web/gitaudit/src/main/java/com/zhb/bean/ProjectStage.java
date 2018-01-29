package com.zhb.bean;

import com.zhb.core.ObjectBase;

import java.util.List;

/**
 * Created by zhouhaibin on 2016/9/19.
 * 项目中包含的阶段
 */
public class ProjectStage extends ObjectBase {
    public static final int STATUS_PLANNING = 0;
    public static final int STATUS_RUNNING = 1;
    public static final int STATUS_TRACING = 2;
    public static final int STATUS_CLOSED = 3;
    public static final int STATUS_CANCELED = 4;//内存中的状态

    int centerCount;//中心数量
    int canceled = 0;//是否已经取消

    List<StageCenter> stageCenters;//阶段中包含的中心
    List<String> moduleIdList;//阶段中包含的模块

    public List<String> getModuleIdList() {
        return moduleIdList;
    }

    public void setModuleIdList(List<String> moduleIdList) {
        this.moduleIdList = moduleIdList;
    }

    public List<StageCenter> getStageCenters() {
        return stageCenters;
    }

    public void setStageCenters(List<StageCenter> stageCenters) {
        this.stageCenters = stageCenters;
    }

    public int getCenterCount() {
        return centerCount;
    }

    public void setCenterCount(int centerCount) {
        this.centerCount = centerCount;
    }

    public int getCanceled() {
        return canceled;
    }

    public void setCanceled(int canceled) {
        this.canceled = canceled;
    }

    @Override
    public void copyForUpdate(ObjectBase object) {

    }

    public StageCenter findCenter(String centerId) {
        for (StageCenter stageCenter : stageCenters) {
            if (stageCenter.getCenterId().equals(centerId))
                return stageCenter;
        }
        return null;
    }

    public StageCenter findCenterByStageCenterId(String stageCenterId) {
        for (StageCenter stageCenter : stageCenters) {
            if (stageCenter.getId().equals(stageCenterId))
                return stageCenter;
        }
        return null;
    }
}
