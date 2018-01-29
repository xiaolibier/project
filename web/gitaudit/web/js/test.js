/**
 * Created by zhouhaibin on 2016/9/23.
 */
var Test = function () {
    var f;
    return {
        init: function () {
            f = this;
        },

        createEmptyProject: function (project) {
            for (var i = 0; i < DataStructure.Project.fields.length; i++) {
                var field = DataStructure.Project.fields[i];
                var value = "test-" + field.id;
                if (field.type == "date") {
                    value = "2016-09-23";
                } else if (field.type == "select") {
                    continue;
                } else {

                }
                project[field.id] = value;
            }

            project.leaderId = 'U002';
            project.auditType = "常规稽查";
            project.id = Utils.newGUID().substring(0, 14);

            project.centers = [];
            for (var i = 0; i < 1/*Global.allCenters.length*/; i++) {
                var center = Global.allCenters[i];
                project.centers.push({
                    id: center.id,
                    name: center.name,
                    address: center.address,
                    firstChar: center.firstChar,
                    code: "testCode",
                    principal: "testPrincipal",
                    operateDepartment: "testOperateDepartment",
                    researcher: "testResearcher"
                });
            }

            project.stages = [];
            for (var i = 0; i < 1; /*Global.allStages.length;*/ i++) {
                var stage = Global.allStages[i];
                project.stages.push({
                    id: stage.id,
                    name: stage.name,
                    selected: true,
                    stageCenters: [],
                    moduleIdList: []
                });
                for (var j = 0; j < project.centers.length; j++) {
                    var center = project.centers[j];
                    project.stages[i].stageCenters.push({
                        centerId: center.id
                        //leaderId: "U002",
                        //memberIdList: ["U003", "U004"]
                    });
                }
                for (var j = 0; j < Global.allModules.length; j++) {
                    project.stages[i].moduleIdList.push(Global.allModules[j].id);
                }
            }
        },

        createEmptyModuleRecord: function (moduleRecord, table) {
            var content = {};
            for (var i = 0; i < table.fields.length; i++) {
                var field = table.fields[i];
                var value = "test-" + field.id;
                if (field.type == GlobalConstants.FIELD_TYPE_DATE) {
                    value = "2016-09-23";
                } else if (field.type == GlobalConstants.FIELD_TYPE_LIMITEDWORD) {
                    value = field.limitedWord.words[0];
                } else if (field.type == GlobalConstants.FIELD_TYPE_INT) {
                    value = 10;
                } else {

                }
                content[field.id] = value;
            }
            moduleRecord.content = JSON.stringify(content);
        },

        createEmptyDiscovery: function (discovery) {
            //discovery.categoryId = "IMP3";
            //discovery.problemId = "IMP301";
            //discovery.level = "严重问题";
            discovery.description = "description";
            discovery.memo = "memo";
            discovery.patientNo = "12345678";
        },


        createEmptyCenter: function (center) {
            for (var i = 0; i < DataStructure.Center.fields.length; i++) {
                var field = DataStructure.Center.fields[i];
                var value = "test-" + field.id;
                if (field.type == "date") {
                    value = "2016-09-23";
                } else if (field.type == "select") {
                    continue;
                } else {

                }
                center[field.id] = value;
            }

            center.type = '医院';
        },
        empty: null
    }
}();

$(function () {
    Test.init();
});

