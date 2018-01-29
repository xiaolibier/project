package com.zhb.service;

import com.zhb.bean.Project;
import com.zhb.bean.ProjectStage;
import com.zhb.bean.StageCenter;
import com.zhb.bean.Task;

/**
 * Created by zhouhaibin on 2016/9/30.
 */
public class IDGenerator {
    /**
     * 项目Project ID，14位，用户手填
     * 项目中心ID，复用中心ID
     * 项目阶段ProjectStage ID，复用阶段ID
     * 项目阶段中心StageCenter ID，项目ID+阶段ID+中心ID
     * 稽查任务Task ID，=项目阶段中心的ID，=项目ID+阶段ID+中心ID，和项目阶段中心是一一对应的
     * 任务模块TaskModule ID,=稽查任务ID + "D" + 模块ID =项目ID+阶段ID+中心ID+"D"+模块ID
     * 任务模块记录ModuleRecord ID,=稽查任务模块ID + 2位流水号
     * 稽查发现Discovery Code = 稽查任务ID + "F" + 3位流水号 = 项目ID+阶段ID+中心ID + "F" + 4位流水号
     * 单中心报告CenterReport ID=稽查任务ID=项目阶段中心ID
     * 原始版稽查记录表 ID=单中心报告ID=稽查任务ID=项目阶段中心ID
     * 项目阶段稽查报告 ID=项目ID+阶段ID
     */

    public static String createStageCenterId(StageCenter stageCenter, Project project, ProjectStage projectStage) {
        String id  = project.getId() + projectStage.getId() + stageCenter.getCenterId();
        return id;
    }


    public static String createTaskModuleId(String moduleId, Task task) {
        String id = task.getId() + "D" + moduleId;
        return id;
    }
}
