package com.zhb.service;

import com.zhb.bean.Problem;
import com.zhb.dao.Condition;
import com.zhb.dao.DaoPara;
import com.zhb.manager.MemoryCache;
import com.zhb.query.QueryResult;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("ProblemService")
public class ProblemService extends AuditServiceBase {
    public QueryResult loadProblems(int start, int limit, String moduleId, String categoryId,String keywords) {
        DaoPara daoPara = new DaoPara();
        daoPara.setClazz(Problem.class);
        daoPara.setStart(start);
        daoPara.setLimit(limit);
        Condition condition = buildKeywordsCondition(keywords, "name");
        if (condition != null)
            daoPara.addCondition(condition);
        if (!isValueEmpty(moduleId))
            daoPara.addCondition(Condition.EQUAL("moduleId", moduleId));
        if (!isValueEmpty(categoryId))
            daoPara.addCondition(Condition.EQUAL("categoryId", categoryId));

        daoPara.addOrder("id", "desc");
        int totalCount = dao.getTotalCount(daoPara);
        List list = dao.loadList(daoPara);

        QueryResult queryResult = new QueryResult();
        queryResult.setList(list);
        queryResult.setStart(start);
        queryResult.setLimit(limit);
        queryResult.setTotalCount(totalCount);
        queryResult.refreshPage();
        return queryResult;
    }

    public void addProblem(Problem problem) {
        dao.save(problem);
        MemoryCache.addObject(problem);
        init();
    }

    public void updateProblem(Problem problem) {
        Problem problemInMemory = getProblem(problem.getId());
        problemInMemory.copyForUpdate(problem);
        dao.update(problemInMemory);
        init();
    }

    public void deleteProblem(String id) {
        Problem problem = getProblem(id);
        dao.delete(problem);
        MemoryCache.deleteObject(Problem.class, id);
    }

    public Problem getProblem(String id) {
        return (Problem)MemoryCache.getObject(Problem.class, id);
    }

    public void init() {
        String sql = "from Problem";
        List list = dao.loadList(sql, 0, 10000);
        Map map = MemoryCache.getObjectMap(Problem.class);
        if (map == null) {
            map = new HashMap();
            MemoryCache.setObjectMap(Problem.class, map);
        }
        for (int i = 0; i < list.size(); i ++) {
            Problem problem = (Problem)list.get(i);
            map.put(problem.getId(), problem);
        }
    }
}
