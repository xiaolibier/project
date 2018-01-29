package com.zhb.core;


/**
 * Created by IntelliJ IDEA.
 * User: zoujuan
 * Date: 12-2-28
 * Time: 下午2:15
 * To change this template use File | Settings | File Templates.
 */
public class FieldBase {
	/** 字段类别：基本字段 */
    public static final int FIELD_TYPE_BASICFIELD = 0;
    /** 字段类别：编目属性 */
    public static final int FIELD_TYPE_ATTRIBUTE = 1;
    /** 字段类别：属性组里的属性 */
    public static final int FIELD_TYPE_ATTRIBUTEINGROUP = 2;
    /** 字段类别：编目类 */
    public static final int FIELD_TYPE_CATALOGCLASS = 3;
    /** 字段类别：目录 */
    public static final int FIELD_TYPE_FOLDER = 4;
    /** 字段类别：标签 */
    public static final int FIELD_TYPE_TAG = 5;
    /** 字段类别：全文字段 */
    public static final int FIELD_TYPE_FULLTEXTCONTENT = 6;
    /** 字段类别：属性组 */
    public static final int FIELD_TYPE_ATTRIBUTEGROUP = 7;
    /** 字段类别：泛字段 */
    public static final int FIELD_TYPE_PANFIELD = 8;

    /** 字段数据类型：未知 */
    public static final int DATATYPE_UNKNOWN = -1;
    /** 字段数据类型：字符串 */
    public static final int DATATYPE_STRING = 0;
    /** 字段数据类型：整型 */
    public static final int DATATYPE_INT = 1;
    /** 字段数据类型：浮点型 */
    public static final int DATATYPE_FLOAT = 2;
    /** 字段数据类型：日期 年月日*/
    public static final int DATATYPE_DATE = 3;
    /** 字段数据类型：时码 */
    public static final int DATATYPE_TIMECODE = 4;
    /** 字段数据类型：受控词 */
    public static final int DATATYPE_LIMITED = 5;
    /** 字段数据类型：大文本 */
    public static final int DATATYPE_TEXT = 6;
    /** 字段数据类型：分类 */
    public static final int DATATYPE_CLASSIFY = 7;
    /** 字段数据类型：日期时间 年月日时分秒*/
    public static final int DATATYPE_DATETIME = 8;
    /** 字段数据类型：时间 时分秒*/
    public static final int DATATYPE_TIME = 9;

    public static final String FIELD_ID_NAME = "NAME";
    public static final String FIELD_ID_CCID = "CCID";
    public static final String FIELD_ID_PUBLISHSTATUS = "PUBLISHSTATUS";
    public static final String FIELD_ID_CREATED = "CREATED";
    public static final String FIELD_ID_PUBLISHTIME = "PUBLISHTIME";
    public static final String FIELD_ID_FILESTATUS = "FILESTATUS";
    public static final String FIELD_ID_DELETEFLAG = "DELETEFLAG";
    public static final String FIELD_ID_RESOURCETYPE = "RESOURCETYPE";
    public static final String FIELD_ID_ONLINELIFECYCLE = "ONLINELIFECYCLE";
    public static final String FIELD_ID_VIEWCOUNTS = "VIEWCOUNTS";
    public static final String FIELD_ID_DOWNLOADCOUNTS = "DOWNLOADCOUNTS";
    public static final String FIELD_ID_CONTENT = "CONTENT";
    public static final String FIELD_ID_TAG = "TAG ";
    public static final String FIELD_ID_HASKEYFRAME = "HASKEYFRAME";//新增HASKEYFRAME add by liuhj 20160114

	/** 显示控件类型：文本框 */
    public static final String COMPONENT_TYPE_TEXT = "text";
	/** 显示控件类型：单选 */
    public static final String COMPONENT_TYPE_RADIO = "radio";
	/** 显示控件类型：多选 */
    public static final String COMPONENT_TYPE_CHECKBOX = "checkbox";
	/** 显示控件类型：下拉 */
    public static final String COMPONENT_TYPE_COMBOX = "combox";
	/** 显示控件类型：整数框 */
    public static final String COMPONENT_TYPE_NUMBER = "number";
	/** 显示控件类型：日期框 */
    public static final String COMPONENT_TYPE_DATE = "date"; 
	/** 显示控件类型：时间框 */
    public static final String COMPONENT_TYPE_TIME = "time";
	/** 显示控件类型：树 */
    public static final String COMPONENT_TYPE_TREE = "tree";
	/** 显示控件类型：链接 */
    public static final String COMPONENT_TYPE_LINK = "link";
    /** 显示控件类型：滑块 */
    public static final String COMPONENT_TYPE_SILDER = "silder";
    /** 显示控件类型：时码 */
    public static final String COMPONENT_TYPE_TIMECODE = "timecode";

	

    /** 字段的类型,参见FIELD_TYPE系列 */
    protected int type;

    /** 条件id:
     * FIELD_TYPE_BASICFIELD: 固定字段ID
     * FIELD_TYPE_ATTRIBUTE: AttributeID
     * FIELD_TYPE_ATTRIBUTEINGROUP: AttributeID
     * FIELD_TYPE_CATALOGCLASS: CCID
     * FIELD_TYPE_FOLDER: FOLDERID
     * FIELD_TYPE_TAG: "TAG"
     * FIELD_TYPE_FULLTEXTCONTENT: "CONTENT"
     * 最后一种是固定字符串
     */
    protected String id;

    /** 条件字段名称:
     * FIELD_TYPE_BASICFIELD: 固定字段名称
     * FIELD_TYPE_ATTRIBUTE: FieldName
     * FIELD_TYPE_ATTRIBUTE: FieldName
     * FIELD_TYPE_CATALOGCLASS: "CCID"
     * FIELD_TYPE_FOLDER: "FOLDERID"
     * FIELD_TYPE_TAG: "TAG"
     * 后三种是固定的字符串
     */
    protected String fieldName;

    /**
     * 数据类型
     * 详见DATETYPE系列
     */
    protected int dataType;

    /** 组件类型，用于前台渲染  参见COMPONENT_TYPE系列*/
    protected String componentType;

    /** 枚举id */
    protected String enumId;

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public int getDataType() {
        return dataType;
    }

    public void setDataType(int dataType) {
        this.dataType = dataType;
    }

    public String getComponentType() {
        return componentType;
    }

    public void setComponentType(String componentType) {
        this.componentType = componentType;
    }

	public String getEnumId() {
		return enumId;
	}

	public void setEnumId(String enumId) {
		this.enumId = enumId;
	}


}
