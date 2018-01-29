package com.zhb.dao;

import java.util.ArrayList;
import java.util.List;

/**
 * Dao底层查询条件对象(用于复杂查询条件：需要用到括号来划分条件的逻辑)
 * @author liangyansheng
 * @time 2014-07-12
 */
public class ConditionGroup extends Condition{
	
	private List<Condition> conditions = new ArrayList<Condition>();

	public String buildCondition (List<Object> paramValues) {
		if(conditions.size() == 0){
			return "";
		}
		StringBuffer where = new StringBuffer();
		where.append(" (");
		for(int i = 0; i< conditions.size(); i++){
			Condition condition = conditions.get(i);
			if (i != 0) {
				where.append(condition.buildLogicWhere());
			}
			where.append(condition.buildCondition (paramValues));
		}
		where.append(") ");
		return where.toString();
	}
	
	public ConditionGroup addCondition(Condition condition){
		conditions.add(condition);
		return this;
	}
	
	
	public List<Condition> getConditions() {
		return conditions;
	}
	
	public ConditionGroup setConditions(List<Condition> conditions) {
		this.conditions = conditions;
		return this;
	}
	
}
