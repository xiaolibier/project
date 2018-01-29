package com.zhb.service;

import com.zhb.core.ObjectBase;
import com.zhb.core.ServiceBase;
import com.zhb.dao.Condition;
import com.zhb.dao.ConditionGroup;
import com.zhb.dao.DaoPara;
import com.zhb.dao.util.Logic;
import com.zhb.dao.util.Operator;
import org.apache.log4j.Logger;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

/**
 * Created by zhouhaibin on 2016/10/17.
 * 本项目所有Service的基类
 */
public abstract class AuditServiceBase extends ServiceBase {
    protected static Logger logger = Logger.getLogger(AuditServiceBase.class);
    protected final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    @javax.annotation.Resource(name="UserService")
    protected UserService userService;

    //构建查询参数
    public DaoPara buildDaoPara(int start, int limit, String userId, String projectId, String stageId, String centerId, String keywords) {
        DaoPara daoPara = new DaoPara();
        //如果是管理员或者打印员，则列出所有的内容，否则，只列出成员包含自己的内容
        if (!isValueEmpty(userId)) {
            if (!userService.isUserAdminOrPrinter(userId)) {
                ConditionGroup conditionGroup = new ConditionGroup();
                Condition condition1 = new Condition("leaderId", userId, Operator.EQUAL);
                condition1.setLogic(Logic.OR);
                Condition condition2 = new Condition("memberIds", userId, Operator.LIKE);
                condition2.setLogic(Logic.OR);
                conditionGroup.addCondition(condition1);
                conditionGroup.addCondition(condition2);
                daoPara.addCondition(conditionGroup);
            } else {
                logger.debug(userId + "is Admin or Printer");
            }
        }
        if (!isValueEmpty(projectId))
            daoPara.addCondition(Condition.EQUAL("projectId", projectId));
        if (!isValueEmpty(stageId))
            daoPara.addCondition(Condition.EQUAL("stageId", stageId));
        if (!isValueEmpty(centerId))
            daoPara.addCondition(Condition.EQUAL("centerId", centerId));
        Condition condition = buildKeywordsCondition(keywords, "fulltext");
        if (condition != null)
            daoPara.addCondition(condition);
        daoPara.setStart(start);
        daoPara.setLimit(limit);
        return daoPara;
    }

    public boolean isValueEmpty(String value) {
        if (value != null && !value.isEmpty() && !value.equals(ObjectBase.EMPTY_OBJECT) && !value.equals("null"))
            return false;
        return true;
    }

    public Condition buildKeywordsCondition(String keywords, String fieldName) {
        if (keywords == null)
            return null;
        keywords = keywords.trim();
        if (keywords.isEmpty())
            return null;
        String[] wordList = keywords.split(",");
        Condition condition = Condition.LIKE(fieldName, wordList[0]);
        return condition;
    }

    protected String formatDate(Timestamp date) {
        if (date == null)
            return "";
        return dateFormat.format(date);
    }
}
