/**
 * Created by zhouhaibin on 2016/9/19.
 */
var ProjectManager = function(){
    var PAGE_MODE_PROJECT_MANAGER = 0;
    var PAGE_MODE_ADD_PROJECT_1 = 1;
    var PAGE_MODE_ADD_PROJECT_2 = 2;
    var PAGE_MODE_ADD_PROJECT_3 = 3;
    var PAGE_MODE_PROJECT_PREVIEW = 4;
    var PAGE_MODE_PROJECT_DETAIL = 5;
    var PAGE_MODE_STAGE_MANAGER = 7;
    var PAGE_MODE_CENTER_MANAGER = 8;

    var newProject = false;//当前打开项目是否新建项目（保存一次以后就不是新项目）
    var currentPageMode = PAGE_MODE_PROJECT_MANAGER;

    var f;
    var start = 0;
    var limit = 10;

    var currentProject;
    var currentStage;

    var stagesInPage = [];
    return{
        init: function() {
            f = this;
            Header.activeMenu("project-manager");

            Global.initTableLayout();
            f.initTemplate();
            f.bindEvent();
            f.onPageModeChange();
            f.initProjectLeaderSelect();
            f.initProjectAuditTypeSelect();

            //render modules
            f.renderModules();

            //render project center filter
            $("#project-center .center-filter").html($.tmpl("filterTemplate", Global.allFilters));

            //render stage center filter
            $("#stage-center .center-filter").html($.tmpl("filterTemplate", Global.allFilters));

            //set input controls max length
            DataStructure.setControlMaxLength("Project");

            f.loadProjects();
        },

        enableAllInputControl: function(enable) {
            if (enable) {
                $("input").removeAttr("disabled");
                $("textarea").removeAttr("disabled");
                $("select").removeAttr("disabled");
            } else {
                $("input").attr("disabled", "disabled");
                $("textarea").attr("disabled", "disabled");
                $("select").attr("disabled", "disabled");
            }
        },

        bindEvent: function() {
            $(".search-center-button").on("click", function() {
                var $centerContainer = $(this).parents(".center-selection");
                f.filterCenter($centerContainer);
                return false;
            });

            $("#project-container").on("click", ".to-stage-manager", function() {
                var project = $.tmplItem($(this)).data;
                ProjectStageManager.load(project);
                f.toStageManager();
                $(".project-id").html(project.id);
                $(".project-name").html(project.name);
            });

            $(".center-selection").on("click", ".select-members", function() {
                if (currentPageMode == PAGE_MODE_PROJECT_PREVIEW || currentPageMode == PAGE_MODE_PROJECT_DETAIL)
                    return;
                var $td = $(this).parents("td");
                var singleSelect = $(this).attr("singleselect");//是否单选，选择组长是单选，选择组员是多选

                var selectedUserIdList = [];//已经选中的内容
                $td.find(".center-member").each(function() {
                    selectedUserIdList.push(
                        $(this).attr("userid")
                    );
                });
                SelectUserDialog.show({
                    selectedUserIdList: selectedUserIdList,
                    singleSelect: singleSelect,
                    callback: function(selectedUsers, callbackPara) {
                        var $td = callbackPara;
                        $td.find(".member-container").html($.tmpl("memberTemplate", selectedUsers));
                        if (selectedUsers.length > 0) {
                            if ($td.parents("tr").find(".select-center-checkbox").prop("checked") == false) {
                                //选择组长或组员后，自动选中该中心
                                $td.parents("tr").find(".select-center-checkbox").trigger("click");
                            }
                        }
                    },
                    callbackPara: $td
                });
            });

            $(".center-selection").on("click", ".center-filter li", function() {
                var $centerContainer = $(this).parents(".center-selection");
                $centerContainer.find(".center-filter li.active").removeClass("active");
                $(this).addClass("active");
                $centerContainer.find(".search-center-keywords").val('');
                f.filterCenter($centerContainer);
            });

            $("#project-center").on("click", ".edit", function() {//点击中心的编辑按钮，弹出编辑中心的机构代码等信息
                var $tr = $(this).parents("tr");
                if (currentPageMode == PAGE_MODE_PROJECT_PREVIEW || currentPageMode == PAGE_MODE_PROJECT_DETAIL)
                    return;
                EditCenterCodeDialog.show({
                    data: {
                        code: $tr.find(".project-center-code").html(),
                        principal: $tr.find(".project-center-principal").html(),
                        operateDepartment: $tr.find(".project-center-operateDepartment").html(),
                        researcher: $tr.find(".project-center-researcher").html()
                    },
                    callback: function(data, callbackPara) {
                        var $tr = callbackPara;
                        $tr.find(".project-center-code").html(data.code);
                        $tr.find(".project-center-principal").html(data.principal);
                        $tr.find(".project-center-operateDepartment").html(data.operateDepartment);
                        $tr.find(".project-center-researcher").html(data.researcher);
                        f.updateProjectCenters();
                    },
                    callbackPara: $tr
                });
            });

            $("#project-center").on("click", ".select-center-checkbox", function(event) {
                if ($(event.target).prop("checked") == false) {
                    //取消选择某个中心，需要先检查该中心是否已经在某个阶段的中心里了
                    var center = $.tmplItem($(this)).data;
                    for (var i = 0; i < currentProject.stages.length; i ++) {
                        var stage = currentProject.stages[i];
                        for (var j = 0; j < stage.stageCenters.length; j ++) {
                            if (stage.stageCenters[j].centerId == center.id) {
                                alert("该中心已经被阶段引用，不能取消选择");
                                $(event.target).prop("checked", true);
                                return;
                            }
                        }
                    }
                }
                f.refreshSelectedCenterCount($("#project-center"));
                f.updateProjectCenters();
            });

            $("#stage-center").on("click", ".select-center-checkbox", function(event) {
                if ($(event.target).prop("checked") == true) {//当在某个阶段选择中心时，自动选择这个阶段。
                    $("#stage-container li[stageid='" + currentStage.id + "'] .select-stage-checkbox").prop("checked", true);
                }
                f.refreshSelectedCenterCount($("#stage-center"));
            });

            //点击阶段选择的checkbox
            $("#stage-container").on("click", ".select-stage-checkbox", function(event) {
                var stage = $.tmplItem($(this)).data;
                var checked = $(this).prop("checked");
                stage.selected = checked;
            });

            //点击阶段
            $("#stage-container").on("click", "li", function(event) {
                if ($(event.target).prop('type') == "checkbox")
                    return;
                $("#stage-container li").removeClass("active");
                $(this).addClass("active");
                if (currentPageMode == PAGE_MODE_ADD_PROJECT_3)
                    f.updateStage();
                currentStage = $.tmplItem($(this)).data;
                f.onStageChanged();

                f.refreshSelectedCenterCount($("#stage-center"));
            });

            //生成稽查任务
            $("#project-container").on("click", ".create-task", function() {
                var project = $.tmplItem($(this)).data;
                if (!window.confirm("您是否要现在生成稽查任务?请确认基本数据已填写完成，一旦生成后，稽查任务的继承数据将无法修改。"))
                    return;
                Ajax.call({
                    url: "createTask",
                    p: {
                        projectId: project.id
                    },
                    f: function(response) {
                        Notify.info("生成稽查任务成功");
                    }
                });
            });

            $("#project-container").on("click", ".delete-project", function() {
                var project = $.tmplItem($(this)).data;
                if (!window.confirm("您是否要删除此项目?"))
                    return;
                Ajax.call({
                    url: "deleteProject",
                    p: {
                        id: project.id
                    },
                    f: function(response) {
                        Notify.info("项目删除成功");
                        f.loadProjects();
                    }
                });
            });

            $("#project-container").on("click", ".cancel-project", function() {
                var project = $.tmplItem($(this)).data;
                if (!window.confirm("您是否要取消此项目?"))
                    return;
                Ajax.call({
                    url: "cancelProject",
                    p: {
                        id: project.id
                    },
                    f: function(response) {
                        Notify.info("项目取消成功");
                        f.loadProjects();
                    }
                });

            });

            $("#project-container").on("click", ".start-project", function() {
                var project = $.tmplItem($(this)).data;
                if (!window.confirm("您是否要启动此项目?"))
                    return;
                Ajax.call({
                    url: "startProject",
                    p: {
                        id: project.id
                    },
                    f: function(response) {
                        Notify.info("项目启动成功");
                        f.loadProjects();
                    }
                });

            });

            $("#project-container").on("click", ".close-project", function() {
                var project = $.tmplItem($(this)).data;
                if (!window.confirm("您是否要关闭此项目?"))
                    return;
                Ajax.call({
                    url: "closeProject",
                    p: {
                        id: project.id
                    },
                    f: function(response) {
                        Notify.info("项目关闭成功");
                        f.loadProjects();
                    }
                });

            });

            $("#project-container").on("click", ".edit-project", function() {
                currentProject = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_ADD_PROJECT_1;
                f.onPageModeChange();
                newProject = false;
                f.openProject();
            });

            $("#project-container").on("click", ".detail-project", function() {
                currentProject = $.tmplItem($(this)).data;
                currentPageMode = PAGE_MODE_PROJECT_DETAIL;
                f.onPageModeChange();
                newProject = false;
                f.openProject();
            });

            $("#add").on("click", function() {
                currentPageMode = PAGE_MODE_ADD_PROJECT_1;
                f.onPageModeChange();
                f.onAdd();
            });

            $("#search").on("click", f.onSearch);

            $("#next-step").on("click", function() {
                if (currentPageMode == PAGE_MODE_ADD_PROJECT_3)
                    return;
                currentPageMode ++;
                f.onPageModeChange();
            });

            $("#prev-step").on("click", function() {
                f.updateStage();
                currentStage = undefined;
                if (currentPageMode == PAGE_MODE_ADD_PROJECT_1)
                    return;
                currentPageMode --;
                f.onPageModeChange();
            });

            $("#save").on("click", function() {
                f.updateStage();
                f.saveProject();
            });

            $("#cancel").on("click", function() {
                if (!window.confirm("取消将丢失所填写的数据！你确定要取消吗？"))
                    return;
                currentPageMode = PAGE_MODE_PROJECT_MANAGER;
                f.onPageModeChange();
            });

            $("#back-edit").on("click", function() {
                currentStage = undefined;
                currentPageMode = PAGE_MODE_ADD_PROJECT_1;
                f.onPageModeChange();
            });

            $("#back-list").on("click", function() {
                currentStage = undefined;
                currentPageMode = PAGE_MODE_PROJECT_MANAGER;
                f.onPageModeChange();
            });

            $("#preview").on("click", function() {
                f.updateStage();
                currentStage = undefined;
                currentPageMode = PAGE_MODE_PROJECT_PREVIEW;
                f.onPageModeChange();
            });
        },

        //刷新中心个数的显示
        refreshSelectedCenterCount: function($centerContainer) {
            $allSelected = $centerContainer.find('tr input:checked');
            $centerContainer.find(".selected-center-count").html($allSelected.length);
        },

        initTemplate: function() {
            var memberTemplate =
                '<span class="center-member" userid="${id}">${name}</span>';
            $.template("memberTemplate", memberTemplate);

            var stageTemplate =
                '<li stageid="${id}" role="presentation">' +
                    '<a href="javascript:void(0)">' +
                        '<input class="select-stage-checkbox" type="checkbox"> ${name}' +
                    '</a>' +
                '</li>';
            $.template("stageTemplate", stageTemplate);

            var filterTemplate =
                '<li role="presentation" value="${id}"><a href="javascript:void(0)">${name}</a></li>';
            $.template("filterTemplate", filterTemplate);

            var projectCenterTemplate =
                '<tr centerId="${id}" filter="${firstChar}">' +
                    '<td><input class="select-center-checkbox" type="checkbox"></td>' +
                    '<td class="project-center-code">${code}</td>' +
                    '<td>${name}</td>' +
                    '<td>${id}</td>' +
                    '<td>${address}</td>' +
                    '<td class="project-center-principal">${principal}</td>' +
                    '<td class="project-center-operateDepartment">${operateDepartment}</td>' +
                    '<td class="project-center-researcher">${researcher}</td>' +
                    '<td>' +
                        '<a title="修改" href="javascript:void(0)" class="edit table-operation-icon"><i class="glyphicon glyphicon-pencil"></i></a>' +
                    '</td>' +
                '</tr>';
            $.template("projectCenterTemplate", projectCenterTemplate);

            var stageCenterTemplate =
                '<tr centerId="${id}" filter="${firstChar}">' +
                    '<td><input class="select-center-checkbox" type="checkbox"></td>' +
                    '<td>${id}</td>' +
                    '<td>${name}</td>' +
                    '<td>${address}</td>' +
                    '<td>${principal}</td>' +
                    '<td>${operateDepartment}</td>' +
                    '<td>${researcher}</td>' +
                    '<td><span class="leader member-container"></span><a href="javascript:void(0)" class="select-members" singleselect="true">选择</a></td>' +
                    '<td><span class="members member-container"></span><a href="javascript:void(0)" class="select-members" singleselect="false">选择</a></td>' +
                '</tr>';
            $.template("stageCenterTemplate", stageCenterTemplate);

            var projectTemplate =
                '<tr id={$id}>' +
                    '<td>${id}</td>' +
                    '<td><a title="进入阶段管理页面" href="javascript:void(0)" class="to-stage-manager">${name}</a></td>' +
                    '<td>${stageCount}</td>' +
                    '<td>${$item.getStatusString($item.data)}</td>' +
                    '<td>${Global.getUserName($item.data.leaderId)}</td>' +
                    '<td>${created}</td>' +
                    '<td>' +
                        '<a title="项目详情" href="javascript:void(0)" class="detail-project table-operation-icon"><i class="glyphicon glyphicon-list-alt"></i></a>' +
                        '{{if status == 3 || canceled == 1}}' +//Closed
                            '{{if status == 3}}' +//Closed
                            '{{else}}' +
                                '<a title="启动项目" href="javascript:void(0)" class="start-project table-operation-icon"><i class="glyphicon glyphicon-play-circle"></i></a>' +
                            '{{/if}}' +
                        '{{else}}' +
                            '<a title="删除项目" href="javascript:void(0)" class="delete-project table-operation-icon"><i class="glyphicon glyphicon-remove-circle"></i></a>' +
                            '<a title="取消项目" href="javascript:void(0)" class="cancel-project table-operation-icon"><i class="glyphicon glyphicon-ban-circle"></i></a>' +
                            '<a title="关闭项目" href="javascript:void(0)" class="close-project table-operation-icon"><i class="glyphicon glyphicon-off"></i></a>' +
                            '<a title="编辑项目" href="javascript:void(0)" class="edit-project table-operation-icon"><i class="glyphicon glyphicon-pencil"></i></a>' +
                            '<a title="生成稽查任务" href="javascript:void(0)" class="create-task table-operation-icon"><i class="glyphicon glyphicon-th"></i></a>' +
                        '{{/if}}' +
                    '</td>' +
                '</tr>';
            $.template("projectTemplate", projectTemplate);
        },

        filterCenter: function($centerSelectionContainer, filter) {
            var filter = $centerSelectionContainer.find(".center-filter li.active").attr("value");
            var keywords = $centerSelectionContainer.find(".search-center-keywords").val();
            var $centers;
            $centerSelectionContainer.find(".center-container tr").hide();
            if (filter == "all") {
                $centers = $centerSelectionContainer.find(".center-container tr");
            } else if (filter == "selected") {
                $centers = $centerSelectionContainer.find('.center-container input:checked').parents("tr");
            } else {
                $centers = $centerSelectionContainer.find('.center-container tr[filter="' + filter +'"]')
            }
            $centers.each(function() {
                var center = $.tmplItem($(this)).data;
                if (keywords != '') {
                    if (center.name.indexOf(keywords) >= 0)
                        $(this).show();
                } else {
                    $(this).show();
                }
            });
        },

        initProjectLeaderSelect: function() {
            var leaderTemplate =
                '<option value="${id}">${name}</option>';
            $.template("leaderTemplate", leaderTemplate);
            $("#project-leaderId").html($.tmpl("leaderTemplate", Global.allUsers));
            Global.initSelect($("#project-leaderId"));
        },

        initProjectAuditTypeSelect: function() {
            var $select = $("#project-auditType");
            var types = Global.allLimitedWords["稽查类型选项"].words;
            for (var i = 0; i < types.length; i ++) {
                var option = '<option value="' + types[i] + '">' + types[i] + '</option>';
                $select.append(option);
            }
            Global.initSelect($select);
        },

        openProject: function() {
            if (newProject) {//新建模式
                $("#save").html("添加");
                $("#project-id").removeAttr("readonly");
            } else {//修改模式
                $("#save").html("保存");
                $("#project-id").attr("readonly", true);
            }

            //把项目元数据set到控件上。
            DataStructure.object2control(currentProject, "Project");

            //重新刷新本项目的中心选择情况
            var projectCenters = currentProject.centers;
            if (projectCenters == undefined)
                projectCenters = [];
            $("#project-center").find(".center-container").html($.tmpl("projectCenterTemplate", Global.allCenters));
            for (var i = 0; i < projectCenters.length; i ++) {
                var center = projectCenters[i];
                var $tr = $("#project-center tr[centerId='" + center.id + "']");
                $tr.find(".select-center-checkbox").prop("checked", true);
                $tr.find(".project-center-code").html(center.code || '');
                $tr.find(".project-center-principal").html(center.principal || '');
                $tr.find(".project-center-operateDepartment").html(center.operateDepartment || '');
                $tr.find(".project-center-researcher").html(center.researcher || '');
            }
            //中心的过滤器中，默认选中“已选”
            $("#project-center .center-filter li[value='selected']").trigger("click");

            //render stage
            stagesInPage = [];
            for (var i = 0; i < Global.allStages.length; i ++) {
                var stage = Global.allStages[i];
                stagesInPage.push({
                    id: stage.id,
                    name: stage.name,
                    centerCount: stage.centerCount,
                    moduleIdList: [],
                    stageCenters: [],
                    selected: false
                });

                for (var j = 0; j < Global.allModules.length; j ++) {
                    stagesInPage[i].moduleIdList.push(Global.allModules[j].id);
                }
            }
            for (var i = 0; i < currentProject.stages.length; i ++) {
                var projectStage = currentProject.stages[i];
                for (var j = 0; j < stagesInPage.length; j ++) {
                    if (stagesInPage[j].id == projectStage.id) {
                        stagesInPage[j].selected = true;
                        stagesInPage[j].centerCount = projectStage.centerCount;
                        stagesInPage[j].stageCenters = projectStage.stageCenters;
                        stagesInPage[j].moduleIdList = projectStage.moduleIdList;
                        break;
                    }
                }
            }
            $("#stage-container").html($.tmpl("stageTemplate", stagesInPage));

            //重新刷新本项目阶段选择情况
            $("#stage-container .select-stage-checkbox").prop("checked", false);
            for (var i = 0; i < stagesInPage.length; i ++) {
                var stage = stagesInPage[i];
                $("#stage-container li[stageid='" + stage.id + "'] .select-stage-checkbox").prop("checked", stage.selected);
            }
            currentStage = null;
        },

        //当更换了当前选中的阶段之前，先把阶段的信息保存下来
        updateStage: function() {
            if (currentStage == undefined)
                return;
            //更新中心选择情况
            currentStage.stageCenters = [];
            var $allSelected = $("#stage-center tr input:checked");
            for (var i = 0; i < $allSelected.length; i ++) {
                var $tr = $($allSelected[i]).parents("tr");
                var center = $.tmplItem($tr).data;
                var stageCenter = {
                    centerId: center.id,
                    memberIdList: []
                };

                var $leader = $tr.find(".leader .center-member");
                if ($leader.length > 0) {
                    stageCenter.leaderId = $.tmplItem($($leader[0])).data.id;
                }

                var $members = $tr.find(".members .center-member");
                for (var j = 0; j < $members.length; j ++)
                    stageCenter.memberIdList.push($.tmplItem($($members[j])).data.id);

                currentStage.stageCenters.push(stageCenter);
            }
            currentStage.centerCount = currentStage.stageCenters.length;

            //更新模块选择情况
            currentStage.moduleIdList = [];
            $allSelected = $("#all-module-container tr input:checked");
            for (var i = 0; i < $allSelected.length; i ++) {
                var moduleId = $($allSelected[i]).attr("moduleId");
                currentStage.moduleIdList.push(moduleId);
            }
        },

        onStageChanged: function() {
            var stageCenters = currentStage.stageCenters;
            if (stageCenters == undefined)
                stageCenters = [];

            //clear center selection
            $("#stage-center .select-center-checkbox").prop("checked", false);
            $("#stage-center .member-container").html('');

            for (var i = 0; i < stageCenters.length; i ++) {
                var stageCenter = stageCenters[i];
                var $tr = $("#stage-center tr[centerId='" + stageCenter.centerId + "']");
                $tr.find(".select-center-checkbox").prop("checked", true);
                if (stageCenter.leaderId) {
                    var leaderName = Global.getUserName(stageCenter.leaderId);
                    if (leaderName) {
                        $tr.find(".leader").html($.tmpl("memberTemplate", {
                            id: stageCenter.leaderId,
                            name: leaderName
                        }));
                    } else {
                        $tr.find(".leader").html('');
                    }
                }
                var members = [];
                if (stageCenter.memberIdList) {
                    for (var j = 0; j < stageCenter.memberIdList.length; j++) {
                        var memberId = stageCenter.memberIdList[j];
                        members.push({
                            id: memberId,
                            name: Global.getUserName(memberId)
                        });
                    }
                }
                $tr.find(".members").html($.tmpl("memberTemplate", members));
            }

            //中心的过滤器中，默认选中“已选”
            $("#stage-center .center-filter li[value='selected']").trigger("click");

            //重新刷新本阶段的模块选择情况
            var stageModuleIdList = currentStage.moduleIdList;
            if (stageModuleIdList == undefined)
                stageModuleIdList = [];
            $("#all-module-container .select-module-checkbox").prop("checked", false);
            for (var i = 0; i < stageModuleIdList.length; i ++) {
                var id = stageModuleIdList[i];
                $("#all-module-container .select-module-checkbox[moduleId='" + id + "']").prop("checked", true);
            }

        },

        updateProject: function() {
            DataStructure.control2object(currentProject, "Project");
            var stageCount = 0;
            currentProject.stages = [];
            for (var i = 0; i < stagesInPage.length; i ++) {
                var stage = stagesInPage[i];
                if (!stage.selected)
                    continue;
                stage.centerCount = stage.stageCenters.length;
                currentProject.stages.push(stage);
                stageCount ++;
            }
            currentProject.stageCount = stageCount;
        },

        saveProject: function() {
            f.updateProject();
            if (newProject) {
                Ajax.call({
                    url: "addProject",
                    p: {
                        project: currentProject
                    },
                    f: function(response) {
                        Notify.info("添加项目成功");
                        newProject = false;
                        currentStage = undefined;
                        f.loadProjects();
                        currentPageMode = PAGE_MODE_PROJECT_MANAGER;
                        f.onPageModeChange();
                    }
                });
            } else {
                currentProject.centerContent = undefined;
                currentProject.stageContent = undefined;
                Ajax.call({
                    url: "updateProject",
                    p: {
                        project: currentProject
                    },
                    f: function(response) {
                        Notify.info("保存项目成功");
                        currentStage = undefined;
                        f.loadProjects();
                        currentPageMode = PAGE_MODE_PROJECT_MANAGER;
                        f.onPageModeChange();
                    }
                });
            }
        },

        onAdd: function() {
            newProject = true;
            currentPageMode = PAGE_MODE_ADD_PROJECT_1;

            currentProject = {
                centers: [],
                stages: []
            };

            //填充测试用数据
            if (Global.debugMode == true) {
                Test.createEmptyProject(currentProject);
            }

            currentProject.purpose = Global.allDataTemplates.ProjectPurpose.content;
            currentProject.range = Global.allDataTemplates.ProjectRange.content;
            currentProject.foundation = Global.allDataTemplates.ProjectFoundation.content;
            currentProject.assignee = Global.allDataTemplates.Assignee.content;
            currentProject.address = Global.allDataTemplates.Address.content;
            currentProject.telephone = Global.allDataTemplates.Telephone.content;
            currentProject.mobilephone = Global.allDataTemplates.Mobilephone.content;
            currentProject.wechat = Global.allDataTemplates.Wechat.content;
            currentProject.url = Global.allDataTemplates.Url.content;

            f.openProject();
        },

        onSearch: function() {
            f.loadProjects();
        },

        renderModules: function() {
            var html = [];
            for (var i = 0; i < Global.allModules.length; i ++) {
                var module = Global.allModules[i];
                if (i % 3 == 0) {
                    html.push('<tr>');
                }
                html.push('<td><input class="select-module-checkbox" type="checkbox" moduleId="' + module.id + '"><span>' + module.name + '</span></td>');
                if ((i + 1) % 3 == 0) {
                    html.push('</tr>');
                }
            }
            $("#all-module-container").html(html.join(''));
        },

        updateProjectCenters: function() {
            currentProject.centers = [];
            $('#project-center .select-center-checkbox:checked').each(function() {
                var center = $.tmplItem($(this)).data;
                var code = $(this).parents("tr").find(".project-center-code").html();
                var principal = $(this).parents("tr").find(".project-center-principal").html();
                var operateDepartment = $(this).parents("tr").find(".project-center-operateDepartment").html();
                var researcher = $(this).parents("tr").find(".project-center-researcher").html();
                currentProject.centers.push({
                    id: center.id,
                    name: center.name,
                    address: center.address,
                    firstChar: center.firstChar,
                    code: code,
                    principal: principal,
                    operateDepartment: operateDepartment,
                    researcher: researcher
                });
            });
        },

        onPageModeChange: function() {
            f.enableAllInputControl(currentPageMode != PAGE_MODE_PROJECT_PREVIEW && currentPageMode != PAGE_MODE_PROJECT_DETAIL);
            if (currentProject && currentProject.leaderId == Global.userId) {
                $("#project-leaderId").attr("disabled", true);
            }

            $("#add-project-page").hide();
            $("#project-manager-page").hide();
            $("#stage-manager-page").hide();
            $("#center-manager-page").hide();
            $("#buttons button").hide();
            switch (currentPageMode) {
                case PAGE_MODE_PROJECT_MANAGER:
                    $("#project-manager-page").show();
                    break;
                case PAGE_MODE_STAGE_MANAGER:
                    $("#stage-manager-page").show();
                    break;
                case PAGE_MODE_CENTER_MANAGER:
                    $("#center-manager-page").show();
                    break;
                case PAGE_MODE_ADD_PROJECT_1:
                    $("#add-project-page").show();
                    $(".project-property-page").hide();
                    $(".project-property-page[page='" + currentPageMode + "']").show();
                    $("#add-project-page-nav li").removeClass("active");
                    $("#add-project-page-nav li[page='" + currentPageMode + "']").addClass("active");
                    $("#next-step").show();
                    break;
                case PAGE_MODE_ADD_PROJECT_2:
                    $("#add-project-page").show();
                    $(".project-property-page").hide();
                    $(".project-property-page[page='" + currentPageMode + "']").show();
                    $("#add-project-page-nav li").removeClass("active");
                    $("#add-project-page-nav li[page='" + currentPageMode + "']").addClass("active");
                    $("#next-step").show();
                    $("#prev-step").show();
                    $(".date-picker").datetimepicker({
                        minView: 2,
                        format:'yyyy-mm-dd',
                        language: 'zh-CN',
                        todayHighlight: true,
                        todayBtn: true,
                        autoclose: true
                    });
                    break;
                case PAGE_MODE_ADD_PROJECT_3:
                    $("#add-project-page").show();
                    $(".project-property-page").hide();
                    $(".project-property-page[page='" + currentPageMode + "']").show();
                    $("#add-project-page-nav li").removeClass("active");
                    $("#add-project-page-nav li[page='" + currentPageMode + "']").addClass("active");
                    $("#save").show();
                    $("#preview").show();
                    $("#prev-step").show();
                    $("#stage-center").find(".center-container").html($.tmpl("stageCenterTemplate", currentProject.centers));
                    //默认选中第1个阶段
                    $("#stage-container li:eq(0)").trigger("click");
                    break;
                case PAGE_MODE_PROJECT_PREVIEW:
                    $("#add-project-page").show();
                    $("#back-edit").show();
                    $(".project-property-page").show();
                    $("#add-project-page-nav li").removeClass("active");
                    break;
                case PAGE_MODE_PROJECT_DETAIL:
                    $("#add-project-page").show();
                    $("#back-list").show();
                    $(".project-property-page").show();
                    $("#add-project-page-nav li").removeClass("active");
                    $("#stage-center").find(".center-container").html($.tmpl("stageCenterTemplate", currentProject.centers));
                    break;
            }

        },

        loadProjects: function() {
            Ajax.call({
                url: "loadProjects",
                p: {
                    keywords: $("#keywords").val(),
                    start: start,
                    limit: limit
                },
                f: function(response) {
                    Global.allDataTemplates = response.allDataTemplates;
                    f.renderProjects(response.result);
                    Global.refreshControlsByPrivilege();
                }
            })
        },

        renderProjects: function(result) {
            $("#project-container").html($.tmpl("projectTemplate", result.list, {
                getStatusString: function (item) {
                    if (item.canceled)
                        return GlobalConstants.PROJECT_STATUS["canceled"];
                    return GlobalConstants.PROJECT_STATUS[item.status];
                }
            }));
            $("#pagination").MyPagination({
                currentPage: result.currentPage,
                resultsPerPage: result.limit,
                totalPage: result.totalPage,
                totalCount: result.totalCount,
                callback: {
                    onGotoPage:function(para) {
                        limit = para.limit;
                        start = (para.page - 1) * limit;
                        f.loadProjects();
                    }
                }
            });
        },

        toProjectManager: function() {
            currentPageMode = PAGE_MODE_PROJECT_MANAGER;
            f.onPageModeChange();
        },

        toStageManager: function() {
            currentPageMode = PAGE_MODE_STAGE_MANAGER;
            f.onPageModeChange();
        },

        toCenterManager: function() {
            currentPageMode = PAGE_MODE_CENTER_MANAGER;
            f.onPageModeChange();
        },
        empty: null
    }
}();

$(document).ready(function() {
    ProjectManager.init();
});


