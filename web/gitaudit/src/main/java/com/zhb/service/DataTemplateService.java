package com.zhb.service;

import com.zhb.bean.DataTemplate;
import com.zhb.manager.MemoryCache;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("DataTemplateService")
public class DataTemplateService extends AuditServiceBase {
    public Map loadDataTemplateMap() {
        return MemoryCache.getObjectMap(DataTemplate.class);
    }


    public void updateDataTemplate(String id, String content) {
        DataTemplate dataTemplateInMemory = getDataTemplate(id);
        dataTemplateInMemory.setContent(content);
        dao.update(dataTemplateInMemory);

    }

    public DataTemplate getDataTemplate(String id) {
        DataTemplate dataTemplate = (DataTemplate)MemoryCache.getObject(DataTemplate.class, id);
        return dataTemplate;
    }

    public void init() {
        String sql = "from DataTemplate";
        List list = dao.loadList(sql, 0, 10000);
        Map map = MemoryCache.getObjectMap(DataTemplate.class);
        if (map == null) {
            map = new HashMap();
            MemoryCache.setObjectMap(DataTemplate.class, map);
        }
        for (int i = 0; i < list.size(); i ++) {
            DataTemplate dataTemplate = (DataTemplate) list.get(i);
//            System.out.println(dataTemplate.getContent());
            map.put(dataTemplate.getId(), dataTemplate);
        }
    }

}
