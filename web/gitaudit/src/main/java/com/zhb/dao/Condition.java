package com.zhb.dao;

import com.zhb.core.FieldBase;
import com.zhb.dao.util.Logic;
import com.zhb.dao.util.Operator;

import java.util.ArrayList;
import java.util.List;


/**
 * Dao底层查询条件对象
 * @author liangyansheng
 * @time 2014-07-08
 */
public class Condition extends FieldBase {
	public final static String QUESTIONMARK = "?";
	protected int operator;
	
	/**默认查询逻辑采用 and **/
	protected int logic = Logic.AND;
	
	protected Object value;
	protected List<Object> values = new ArrayList();
	
	/**
	 * 用于初始化 '=','!=','>','<'
	 * @param fieldName
	 * @param value
	 * @param operator
	 */
	public Condition(String fieldName, Object value, int operator){
		this.fieldName = fieldName;
		this.value = value;
		this.operator = operator;
	}
	
	/**
	 * 用于初始化 'in','not in','between'
	 * @param fieldName
	 * @param values
	 * @param operator
	 */
	private Condition(String fieldName, List<Object> values, int operator){
		this.fieldName = fieldName;
		this.values = values;
		this.operator = operator;
	}
	
	/**
	 * 用于初始化最常用的 '!='
	 * @param fieldName
	 * @param value
	 */
	public static Condition NOTEQUAL(String fieldName, Object value){
		return new Condition(fieldName,value, Operator.NOT_EQUAL);
	}
	
	/**
	 * 用于初始化最常用的 '='
	 * @param fieldName
	 * @param value
	 */
	public static Condition EQUAL(String fieldName, Object value){
		return new Condition(fieldName,value,Operator.EQUAL);
	}
	
	/**
	 * 用于初始化最常用的 'like'
	 * @param fieldName
	 * @param value
	 */
	public static Condition LIKE(String fieldName, Object value){
		return new Condition(fieldName,value,Operator.LIKE);
	}
	
	/**
	 * 用于初始化最常用的 '>'
	 * @param fieldName
	 * @param value
	 */
	public static Condition GREATER(String fieldName, Object value){
		return new Condition(fieldName,value,Operator.GREATER);
	}
	
	/**
	 * 用于初始化最常用的 '<'
	 * @param fieldName
	 * @param value
	 */
	public static Condition LESS(String fieldName, Object value){
		return new Condition(fieldName,value,Operator.LESS);
	}
	
	/**
	 * 用于初始化最常用的 '>='
	 * @param fieldName
	 * @param value
	 */
	public static Condition GREATER_EQUAL(String fieldName, Object value){
		return new Condition(fieldName,value,Operator.GREATER_EQUAL);
	}
	
	/**
	 * 用于初始化最常用的 '<='
	 * @param fieldName
	 * @param value
	 */
	public static Condition LESS_EQUAL(String fieldName, Object value){
		return new Condition(fieldName,value,Operator.LESS_EQUAL);
	}
	
	/**
	 * 用于初始化最常用的 'in'
	 * @param fieldName
	 * @param values
	 */
	public static Condition IN(String fieldName, List<Object> values){
		
		return new Condition(fieldName, values ,Operator.IN);
	}
	
	/**
	 * 用于初始化最常用的 'not in'
	 * @param fieldName
	 * @param values
	 */
	public static Condition NOTIN(String fieldName, List<Object> values){
		
		return new Condition(fieldName, values ,Operator.NOT_IN);
	}
	
	/**
	 * 用于初始化最常用的 'BETWEEN'
	 * @param fieldName
	 * @param values
	 */
	public static Condition BETWEEN(String fieldName, List<Object> values){
		
		return new Condition(fieldName, values ,Operator.BETWEEN);
	}
	
	public Condition(){
		
	}
	
	public String buildCondition (List<Object> paramValues) {
		
		StringBuffer where = new StringBuffer();
		
		if(operator == Operator.BETWEEN){
			Object paramStartValue  = values.get(0);
			paramValues.add(paramStartValue);
			
			Object paramEndValue  = values.get(1);
			paramValues.add(paramEndValue);
			
			where.append(fieldName + " between " + QUESTIONMARK + " and " + QUESTIONMARK);
		}else if(operator == Operator.EQUAL){
			paramValues.add(value);
			where.append(fieldName + "=" + QUESTIONMARK);
		}else if(operator == Operator.NOT_EQUAL){
			paramValues.add(value);
			where.append(fieldName + "!=" + QUESTIONMARK);
		}else if(operator == Operator.LIKE){
			paramValues.add("%"+value+"%");
			where.append(fieldName + " like " + QUESTIONMARK);
		}else if(operator == Operator.GREATER){
			paramValues.add(value);
			where.append(fieldName + ">" + QUESTIONMARK);
		}else if(operator == Operator.LESS){
			paramValues.add(value);
			where.append(fieldName + "<" + QUESTIONMARK);
		}else if(operator == Operator.GREATER_EQUAL){
			paramValues.add(value);
			where.append(fieldName + ">=" + QUESTIONMARK);
		}else if(operator == Operator.LESS_EQUAL){
			paramValues.add(value);
			where.append(fieldName + "<=" + QUESTIONMARK);
		}else if(operator == Operator.IN){
			String questionMarkIn = buildInWhere(paramValues);
			where.append(fieldName + " in(" + questionMarkIn + ")");
		}else if(operator == Operator.NOT_IN){
			String questionMarkIn = buildInWhere(paramValues);
			where.append(fieldName + " not in(" + questionMarkIn + ")");
		}
		return where.toString();
	}

	public String buildLogicWhere() {
		StringBuffer where = new StringBuffer();
		if(logic == Logic.AND){
			where.append(" and ") ;
		}else if(logic == Logic.OR){
			where.append(" or ") ;
		}
		return where.toString();
	}
	
	/**
	 * 构建'in','not in' 参数串 
	 * @param paramValues
	 * @return
	 */
	public String buildInWhere(List<Object> paramValues) {
		String inWhere = "";
		for (int i = 0; i < this.values.size(); i++) {
			
			Object value = this.values.get(i);
			if(i == 0){
				inWhere = QUESTIONMARK;
				paramValues.add(value);
				continue;
			}
			inWhere = inWhere + "," + QUESTIONMARK;
			paramValues.add(value);
		}
		return inWhere;
	}
	
	public int getOperator() {
		return operator;
	}
	public Condition setOperator(int operator) {
		this.operator = operator;
		return this;
	}
	public Object getValue() {
		return value;
	}
	public Condition setValue(Object value) {
		this.value = value;
		return this;
	}
	public List<Object> getValues() {
		return values;
	}
	public Condition setValues(List<Object> values) {
		this.values = values;
		return this;
	}
	public int getLogic() {
		return logic;
	}
	public Condition setLogic(int logic) {
		this.logic = logic;
		return this;
	}
	
}
