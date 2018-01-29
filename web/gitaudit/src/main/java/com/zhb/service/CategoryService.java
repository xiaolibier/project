package com.zhb.service;

import com.zhb.bean.Category;
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

@Service("CategoryService")
public class CategoryService extends AuditServiceBase {
    public QueryResult loadCategories(int start, int limit, String moduleId, String keywords) {
        DaoPara daoPara = new DaoPara();
        daoPara.setClazz(Category.class);
        daoPara.setStart(start);
        daoPara.setLimit(limit);
        Condition condition = buildKeywordsCondition(keywords, "name");
        if (condition != null)
            daoPara.addCondition(condition);
        if (!isValueEmpty(moduleId))
            daoPara.addCondition(Condition.EQUAL("moduleId", moduleId));

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

    public void addCategory(Category category) {
        dao.save(category);
        MemoryCache.addObject(category);
        init();
    }

    public void updateCategory(Category category) {
        Category categoryInMemory = getCategory(category.getId());
        categoryInMemory.copyForUpdate(category);
        dao.update(categoryInMemory);
        init();
    }

    public void deleteCategory(String id) {
        Category category = getCategory(id);
        dao.delete(category);
        MemoryCache.deleteObject(Category.class, id);
    }

    public Category getCategory(String id) {
        return (Category)MemoryCache.getObject(Category.class, id);
    }

    public void init() {
        String sql = "from Category";
        List list = dao.loadList(sql, 0, 10000);
        Map map = MemoryCache.getObjectMap(Category.class);
        if (map == null) {
            map = new HashMap();
            MemoryCache.setObjectMap(Category.class, map);
        }
        for (int i = 0; i < list.size(); i ++) {
            Category category = (Category)list.get(i);
            map.put(category.getId(), category);
        }
    }
}
