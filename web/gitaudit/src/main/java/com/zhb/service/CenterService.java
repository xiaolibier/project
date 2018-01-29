package com.zhb.service;

import com.zhb.bean.City;
import com.zhb.bean.Center;
import com.zhb.bean.Province;
import com.zhb.bean.Town;
import com.zhb.dao.Condition;
import com.zhb.dao.DaoPara;
import com.zhb.manager.MemoryCache;
import com.zhb.query.QueryResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouhaibin on 2016/7/20.
 */

@Service("CenterService")
public class CenterService extends AuditServiceBase {
    static List<Province> provinceList;
    static List<City> cityList;
    static List<Town> townList;
    static Map<String, String> hanziMap;

    public QueryResult loadCenters(int start, int limit, String province, String city, String town, String keywords) {
        DaoPara daoPara = new DaoPara();
        daoPara.setClazz(Center.class);
        daoPara.setStart(start);
        daoPara.setLimit(limit);
        Condition condition = buildKeywordsCondition(keywords, "name");
        if (condition != null)
            daoPara.addCondition(condition);
        if (!isValueEmpty(province))
            daoPara.addCondition(Condition.EQUAL("province", province));
        if (!isValueEmpty(city))
            daoPara.addCondition(Condition.EQUAL("city", city));
        if (!isValueEmpty(town))
            daoPara.addCondition(Condition.EQUAL("town", town));

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

    public boolean addCenter(Center center) {
        if (getCenter(center.getId()) != null) {
            errorMessage = "机构代码已经存在";
            return false;
        }
        buildCenterFirstChar(center);
        dao.save(center);
        MemoryCache.addObject(center);
        return true;
    }

    public void updateCenter(Center center) {
        Center centerInMemory = getCenter(center.getId());
        centerInMemory.copyForUpdate(center);
        buildCenterFirstChar(centerInMemory);
        dao.update(centerInMemory);
    }

    public void deleteCenter(String id) {
        Center center = getCenter(id);
        dao.delete(center);
        MemoryCache.deleteObject(Center.class, id);
    }

    public Center getCenter(String id) {
        Center center = (Center)MemoryCache.getObject(Center.class, id);
        return center;
    }

    public List loadProvince() {
        return provinceList;
    }

    public List loadCity(String province) {
        List list = new ArrayList();
        for (City city : cityList) {
            if (city.getProvince().equals(province))
                list.add(city);
        }
        return list;
    }

    public List loadTown(String province, String city) {
        List list = new ArrayList();
        for (Town town : townList) {
            if (town.getCity().equals(city) && town.getProvince().equals(province))
                list.add(town);
        }
        return list;
    }

    public void buildCenterFirstChar(Center center) {
        String name = center.getName();
        String firstCharOfName = name.substring(0, 1);
        String character = hanziMap.get(firstCharOfName);
        if (character == null)
            character = firstCharOfName;
        center.setFirstChar(character);
    }

    public void init() {
        initProvinces();
        initHanzi();
        String sql = "from Center order by name";
        List list = dao.loadList(sql, 0, 10000);
        Map map = MemoryCache.getObjectMap(Center.class);
        if (map == null) {
            map = new HashMap();
            MemoryCache.setObjectMap(Center.class, map);
        }
        for (int i = 0; i < list.size(); i ++) {
            Center center = (Center)list.get(i);
            map.put(center.getId(), center);
        }
    }

    public void initProvinces() {
        String sql = "select distinct 省级ID,省 from Province order by 省级ID";
        List list = dao.loadNative(sql, null);
        provinceList = new ArrayList();
        for (int i = 0; i < list.size(); i ++) {
            Object[] object = (Object[])list.get(i);
            Province province = new Province();
            province.setId(object[0].toString());
            province.setName(object[1].toString());
            provinceList.add(province);
        }

        sql = "select distinct 地市ID,市,省 from Province order by 地市ID";
        list = dao.loadNative(sql, null);
        cityList = new ArrayList();
        for (int i = 0; i < list.size(); i ++) {
            Object[] object = (Object[])list.get(i);
            City city = new City();
            city.setId(object[0].toString());
            city.setName(object[1].toString());
            city.setProvince(object[2].toString());
            cityList.add(city);
        }

        sql = "select 区县ID,区县,市,省 from Province order by 区县ID";
        list = dao.loadNative(sql, null);
        townList = new ArrayList();
        for (int i = 0; i < list.size(); i ++) {
            Object[] object = (Object[])list.get(i);
            Town town = new Town();
            town.setId(object[0].toString());
            town.setName(object[1].toString());
            town.setCity(object[2].toString());
            town.setProvince(object[3].toString());
            townList.add(town);
        }
    }

    public void initHanzi() {
        String sql = "select chineseword,spell from Hanzi";
        List list = dao.loadNative(sql, null);
        hanziMap = new HashMap<>();
        for (int i = 0; i < list.size(); i ++) {
            Object[] object = (Object[])list.get(i);
            String firstChar = object[1].toString();
            firstChar = firstChar.substring(0, 1).toUpperCase();
            hanziMap.put(object[0].toString(), firstChar);
        }
    }
}
