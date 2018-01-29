package com.zhb.query;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 12-10-24
 * Time: 下午12:48
 * 通用查询结果集（带分页）
 */
public class QueryResult {
    int start;
    int limit;
    int totalCount;
    List list = new ArrayList();
    int totalPage;
    int currentPage;

    public QueryResult() {

    }

    public QueryResult(int start, int limit, int totalCount) {
        this.start = start;
        this.limit = limit;
        this.totalCount = totalCount;
        refreshPage();
    }

    public static QueryResult buildResult(int start, int limit, int totalCount, List list) {
        QueryResult queryResult = new QueryResult(start, limit, totalCount);
        queryResult.setList(list);
        return queryResult;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public List getList() {
        return list;
    }

    public void setList(List list) {
        this.list = list;
    }

    public int getTotalPage() {
        return totalPage;
    }

    public void setTotalPage(int totalPage) {
        this.totalPage = totalPage;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public void refreshPage() {
        if (totalCount == 0) {
            totalPage = 0;
            currentPage = 0;
            return;
        }

        if (limit != 0) {
            totalPage = totalCount / limit;//1 base
            if (totalCount % limit > 0)
                totalPage ++;
            currentPage = start / limit + 1;//1 base
        } else {
            totalPage = 1;
            currentPage = 1;
        }
    }

    public void addItem(Object object) {
        list.add(object);
    }
}
