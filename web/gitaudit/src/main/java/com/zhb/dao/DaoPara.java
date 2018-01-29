package com.zhb.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DaoPara {
	/** 操作条件集合 **/
	private List<Condition> conditions = new ArrayList<Condition>();
	
	/** 排序规则集合 **/
	private List<Order> orders = new ArrayList<Order>();
	
	/**对应javabean 的Class**/
	private Class clazz;
	
	/** 分页查询时使用 表示开始页 **/
	private Integer start;
	
	/** 分页查询时使用 表示每页显示记录数 **/
	private Integer limit;
	
	/** 要更新的属性和对应值的映射关系 **/
	private Map<String,Object> values = new HashMap<String,Object>();

    private String tableName;


	public DaoPara addCondition(Condition condition) {
		this.conditions.add(condition);
		return this;
	}
	
	public DaoPara addOrder(Order order) {
		this.orders.add(order);
		return this;
	}

	

	public List<Condition> getConditions() {
		return conditions;
	}
	
	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}

	public DaoPara setConditions(List<Condition> conditions) {
		this.conditions = conditions;
		return this;
	}

	public List<Order> getOrders() {
		return orders;
	}

	public Integer getStart() {
		return start;
	}

	public Integer getLimit() {
		return limit;
	}

	public Class getClazz() {
		return clazz;
	}

	public DaoPara setClazz(Class clazz) {
		this.clazz = clazz;
		return this;
	}

	public Map<String, Object> getValues() {
		return values;
	}

	public DaoPara setValues(Map<String, Object> values) {
		this.values = values;
		return this;
	}

	public void setStart(Integer start) {
		this.start = start;
	}

	public void setLimit(Integer limit) {
		this.limit = limit;
	}

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

	public void addOrder(String fieldName, String orderRule) {
		Order order = new Order(fieldName, orderRule);
		if (orders == null)
			orders = new ArrayList<>();
		orders.add(order);
	}

	public void addOrder(String fieldName) {
		addOrder(fieldName, Order.ASC);
	}
}
