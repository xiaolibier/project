package com.zhb.bean;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/11/9.
 * 项目比较结果，用于项目修改时来记录项目变化的内容
 */
public class ProjectCompareResult {
    boolean projectNameChanged = false;
    List<ProjectStage> projectStageAdded = new ArrayList<>();
    List<ProjectStage> projectStageDeleted = new ArrayList<>();

    Map<String, List<StageCenter>> stageCenterAdded = new HashMap<>();
    Map<String, List<StageCenter>> stageCenterDeleted = new HashMap<>();
    Map<String, List<StageCenter>> stageCenterMemberChanged = new HashMap<>();

//    Map<String, List<String>> stageModuleIdAdded = new HashMap<>();
    Map<String, List<String>> stageModuleIdDeleted = new HashMap<>();

    public boolean isProjectNameChanged() {
        return projectNameChanged;
    }

    public void setProjectNameChanged(boolean projectNameChanged) {
        this.projectNameChanged = projectNameChanged;
    }

    public List<ProjectStage> getProjectStageAdded() {
        return projectStageAdded;
    }

    public void setProjectStageAdded(List<ProjectStage> projectStageAdded) {
        this.projectStageAdded = projectStageAdded;
    }

    public List<ProjectStage> getProjectStageDeleted() {
        return projectStageDeleted;
    }

    public void setProjectStageDeleted(List<ProjectStage> projectStageDeleted) {
        this.projectStageDeleted = projectStageDeleted;
    }

    public Map<String, List<StageCenter>> getStageCenterAdded() {
        return stageCenterAdded;
    }

    public void setStageCenterAdded(Map<String, List<StageCenter>> stageCenterAdded) {
        this.stageCenterAdded = stageCenterAdded;
    }

    public Map<String, List<StageCenter>> getStageCenterDeleted() {
        return stageCenterDeleted;
    }

    public void setStageCenterDeleted(Map<String, List<StageCenter>> stageCenterDeleted) {
        this.stageCenterDeleted = stageCenterDeleted;
    }

    public Map<String, List<StageCenter>> getStageCenterMemberChanged() {
        return stageCenterMemberChanged;
    }

    public void setStageCenterMemberChanged(Map<String, List<StageCenter>> stageCenterMemberChanged) {
        this.stageCenterMemberChanged = stageCenterMemberChanged;
    }

//    public Map<String, List<String>> getStageModuleIdAdded() {
//        return stageModuleIdAdded;
//    }
//
//    public void setStageModuleIdAdded(Map<String, List<String>> stageModuleIdAdded) {
//        this.stageModuleIdAdded = stageModuleIdAdded;
//    }

    public Map<String, List<String>> getStageModuleIdDeleted() {
        return stageModuleIdDeleted;
    }

    public void setStageModuleIdDeleted(Map<String, List<String>> stageModuleIdDeleted) {
        this.stageModuleIdDeleted = stageModuleIdDeleted;
    }

    public void compareProject(Project oldProject, Project newProject) {
        if (!oldProject.getName().equals(newProject.getName()))
            projectNameChanged = true;

        for (ProjectStage oldProjectStage : oldProject.getStages()) {
            boolean exist = false;
            for (ProjectStage newProjectStage : newProject.getStages()) {
                if (oldProjectStage.getId().equals(newProjectStage.getId())) {
                    exist = true;
                    compareStage(oldProjectStage, newProjectStage);
                    break;
                }
            }
            if (!exist) {
                projectStageDeleted.add(oldProjectStage);
            }
        }

        for (ProjectStage newProjectStage : newProject.getStages()) {
            boolean exist = false;
            for (ProjectStage oldProjectStage : oldProject.getStages()) {
                if (oldProjectStage.getId().equals(newProjectStage.getId())) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                projectStageAdded.add(newProjectStage);
            }
        }
    }

    public void compareStage(ProjectStage oldProjectStage, ProjectStage newProjectStage) {
        List<StageCenter> centerDeleted = new ArrayList<>();
        for (StageCenter oldStageCenter : oldProjectStage.getStageCenters()) {
            boolean exist = false;
            for (StageCenter newStageCenter : newProjectStage.getStageCenters()) {
                if (oldStageCenter.getId().equals(newStageCenter.getId())) {
                    exist = true;
                    compareStageCenter(oldProjectStage.getId(), oldStageCenter, newStageCenter);
                    break;
                }
            }
            if (!exist) {
                centerDeleted.add(oldStageCenter);
            }
        }
        stageCenterDeleted.put(oldProjectStage.getId(), centerDeleted);

        List<StageCenter> centerAdded = new ArrayList<>();
        for (StageCenter newStageCenter : newProjectStage.getStageCenters()) {
            boolean exist = false;
            for (StageCenter oldStageCenter : oldProjectStage.getStageCenters()) {
                if (newStageCenter.getId().equals(oldStageCenter.getId())) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                centerAdded.add(newStageCenter);
            }
        }
        stageCenterAdded.put(newProjectStage.getId(), centerAdded);

        List<String> moduleIdDeleted = new ArrayList<>();
        for (String oldModuleId : oldProjectStage.getModuleIdList()) {
            boolean exist = false;
            for (String newModuleId : newProjectStage.getModuleIdList()) {
                if (oldModuleId.equals(newModuleId)) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                moduleIdDeleted.add(oldModuleId);
            }
        }
        stageModuleIdDeleted.put(oldProjectStage.getId(), moduleIdDeleted);

//        List<String> moduleIdAdded = new ArrayList<>();
//        for (String newModuleId : newProjectStage.getModuleIdList()) {
//            boolean exist = false;
//            for (String oldModuleId : oldProjectStage.getModuleIdList()) {
//                if (newModuleId.equals(oldModuleId)) {
//                    exist = true;
//                    break;
//                }
//            }
//            if (!exist) {
//                moduleIdAdded.add(newModuleId);
//            }
//        }
//        stageModuleIdAdded.put(newProjectStage.getId(), moduleIdAdded);
    }

    private void compareStageCenter(String stageId, StageCenter oldStageCenter, StageCenter newStageCenter) {
        if (!oldStageCenter.getLeaderId().equals(newStageCenter.getLeaderId())) {
            onStageCenterMemberChanged(stageId, newStageCenter);
            return;
        }

        for (String oldMemberId : oldStageCenter.getMemberIdList()) {
            boolean exist = false;
            for (String newMemberId : newStageCenter.getMemberIdList()) {
                if (oldMemberId.equals(newMemberId)) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                onStageCenterMemberChanged(stageId, newStageCenter);
                return;
            }
        }

        for (String newMemberId : newStageCenter.getMemberIdList()) {
            boolean exist = false;
            for (String oldMemberId : oldStageCenter.getMemberIdList()) {
                if (newMemberId.equals(oldMemberId)) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                onStageCenterMemberChanged(stageId, newStageCenter);
                return;
            }
        }
    }

    private void onStageCenterMemberChanged(String stageId, StageCenter newStageCenter) {
        List centerMemeberChanged = stageCenterMemberChanged.get(stageId);
        if (centerMemeberChanged == null) {
            centerMemeberChanged = new ArrayList();
            stageCenterMemberChanged.put(stageId, centerMemeberChanged);
        }
        centerMemeberChanged.add(newStageCenter);
    }
}
