/**
 * Created by zhouhaibin on 2016/9/23.
 */
var DataStructure = function(){
    return{
        value2control: function(object, field, selector) {
            if (field.type == "date") {
                $(selector).val(object[field.id]);
            } else if (field.type == "select") {
                $(selector).select2("val", object[field.id]);
            } else
                $(selector).val(object[field.id]);
        },

        control2value: function(object, field, selector) {
            if (field.type == "date") {
                object[field.id] = $(selector).val();
            } else if (field.type == "select") {
                object[field.id] = $(selector).select2("val");
            } else {
                object[field.id] = $(selector).val();
                if (object[field.id].length > field.length)
                    object[field.id] = object[field.id].substring(0, field.length);
            }
        },

        object2control: function(object, objectClassName) {
            var prefix = objectClassName.toLowerCase();
            for (var i = 0; i < this[objectClassName].fields.length; i ++) {
                var field = this[objectClassName].fields[i];
                this.value2control(object, field, "#" + prefix + "-" + field.id);
            }
        },

        control2object: function(object, objectClassName) {
            var prefix = objectClassName.toLowerCase();
            for (var i = 0; i < this[objectClassName].fields.length; i ++) {
                var field = this[objectClassName].fields[i];
                this.control2value(object, field, "#" + prefix + "-" + field.id);
            }
        },

        setControlMaxLength: function(objectClassName) {
            var prefix = objectClassName.toLowerCase();
            for (var i = 0; i < this[objectClassName].fields.length; i ++) {
                var field = this[objectClassName].fields[i];
                if (field.type != "date" && field.type != "select") {
                    $("#" + prefix + "-" + field.id).attr("maxlength", field.length);
                }
            }
        },

        init:function(){
            this.Project = {
                fields: [{
                    length: 24,
                    id: "id"
                },{
                    length: 100,
                    id: "name"
                },{
                    length: 64,
                    id: "principal"
                },{
                    id: "description"
                },{
                    id: "title"
                },{
                    length: 32,
                    id: "assignee"
                },{
                    length: 64,
                    id: "address"
                },{
                    length: 13,
                    id: "telephone"
                },{
                    length: 11,
                    id: "mobilephone"
                },{
                    length: 14,
                    id: "wechat"
                },{
                    length: 16,
                    id: "url"
                },{
                    id: "purpose"
                },{
                    id: "range"
                },{
                    id: "foundation"
                },{
                    length: 30,
                    id: "versionno"
                },{
                    id: "versiondate",
                    type: "date"
                },{
                    length: 13,
                    id: "sopno"
                },{
                    id: "sopdate",
                    type: "date"
                },{
                    id: "leaderId",
                    type: "select"
                },{
                    id: "auditType",
                    type: "select"
                },{
                    length: 64,
                    id: "medicine"
                },{
                    length: 64,
                    id: "disease"
                },{
                    length: 64,
                    id: "registerCategory"
                }]
            };

            this.Center = {
                fields: [{
                    length: 32,
                    id: "id"
                },{
                    length: 32,
                    id: "name"
                },{
                    type: "select",
                    id: "type"
                },{
                    type: "select",
                    id: "province"
                },{
                    type: "select",
                    id: "city"
                },{
                    type: "select",
                    id: "town"
                },{
                    id: "website"
                },{
                    id: "address"
                },{
                    length: 32,
                    id: "contact"
                },{
                    length: 64,
                    id: "department"
                },{
                    length: 13,
                    id: "certificate"
                }]
            };

            this.User = {
                fields: [{
                    length: 32,
                    id: "id"
                },{
                    length: 32,
                    id: "name"
                },{
                    length: 32,
                    id: "contact"
                },{
                    type: "select",
                    id: "departmentId"
                },{
                    type: "select",
                    id: "roleIds"
                }]
            };

            this.Role = {
                fields: [{
                    length: 32,
                    id: "id"
                },{
                    length: 32,
                    id: "name"
                },{
                    type: "select",
                    id: "privilegeIds"
                }]
            };

            this.Category = {
                fields: [{
                    length: 32,
                    id: "id"
                },{
                    length: 4000,
                    id: "name"
                },{
                    type: "select",
                    id: "moduleId"
                }]
            };

            this.Problem = {
                fields: [{
                    length: 32,
                    id: "id"
                },{
                    length: 4000,
                    id: "name"
                },{
                    type: "select",
                    id: "moduleId"
                },{
                    type: "select",
                    id: "categoryId"
                }]
            };

            this.Reference = {
                fields: [{
                    length: 32,
                    id: "id"
                },{
                    length: 4000,
                    id: "name"
                },{
                    type: "select",
                    id: "moduleId"
                },{
                    type: "select",
                    id: "categoryId"
                },{
                    type: "select",
                    id: "problemId"
                }]
            };
        },

        empty: null
    };
}();

$(function(){
    DataStructure.init();
});

