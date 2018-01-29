package com.zhb.service;

import com.zhb.bean.Reference;
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

@Service("ReferenceService")
public class ReferenceService extends AuditServiceBase {
    public QueryResult loadReferences(int start, int limit, String moduleId, String categoryId, String problemId, String keywords) {
        DaoPara daoPara = new DaoPara();
        daoPara.setClazz(Reference.class);
        daoPara.setStart(start);
        daoPara.setLimit(limit);
        Condition condition = buildKeywordsCondition(keywords, "name");
        if (condition != null)
            daoPara.addCondition(condition);
        if (!isValueEmpty(moduleId))
            daoPara.addCondition(Condition.EQUAL("moduleId", moduleId));
        if (!isValueEmpty(categoryId))
            daoPara.addCondition(Condition.EQUAL("categoryId", categoryId));
        if (!isValueEmpty(problemId))
            daoPara.addCondition(Condition.EQUAL("problemId", problemId));

        daoPara.addOrder("id", "asc");
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

    public void addReference(Reference reference) {
        dao.save(reference);
        MemoryCache.addObject(reference);
        init();
    }

    public void updateReference(Reference reference) {
        Reference referenceInMemory = getReference(reference.getId());
        referenceInMemory.copyForUpdate(reference);
        dao.update(referenceInMemory);
        init();
    }

    public void deleteReference(String id) {
        Reference reference = getReference(id);
        dao.delete(reference);
        MemoryCache.deleteObject(Reference.class, id);
    }

    public Reference getReference(String id) {
        return (Reference)MemoryCache.getObject(Reference.class, id);
    }

    public void init() {
        String sql = "from Reference order by id";
        List list = dao.loadList(sql, 0, 10000);
        Map map = MemoryCache.getObjectMap(Reference.class);
        if (map == null) {
            map = new HashMap();
            MemoryCache.setObjectMap(Reference.class, map);
        }
        for (int i = 0; i < list.size(); i ++) {
            Reference reference = (Reference)list.get(i);
            reference.setName(reference.getName().replaceAll("\n", ""));
            map.put(reference.getId(), reference);
        }
    }
}
