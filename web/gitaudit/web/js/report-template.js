/**
 * Created by zhouhaibin on 2016/9/19.
 */
var ReportTemplate = function(){
    return{
        initTemplate: function() {
            var discoveryTemplate =
                '<div class="discovery-level">' +
                    '<div class="font-hwxh-14">${ReportDetail.getHanziNumber(index)}、 ${level}</div>' +
                    '<div type="1" class="list-group problem-list">' +
                        '{{each(i, problemView) problemViews}}' +
                        '<div id="${problemView.id}" class="problem-item" problemId="${problemId}">' +
                            '<div mode="detail" class="editable" fieldId="problem" itemId="${problemView.id}" opinion="false">' +
                                '<div class="row">' +
                                    '<span class="problem-index font-hwfs-bold-12">${index}. </span>' +
                                    '<span class="detail-control detail-content problem-detail-control font-hwfs-bold-12">${problemView.problemName}</span>' +
                                    '<textarea class="col-md-12 edit-control edit-content problem-edit-control" style="display:none; width:100%;"></textarea>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="text-right">' +
                                        '<button class="btn btn-success edit-button detail-control">修改</button>' +
                                        '<button class="btn btn-success reset-button detail-control">重置</button>' +
                                        '<button class="btn btn-success save-button edit-control">保存</button>' +
                                        '<input type="checkbox" class="detail-control opinion-accepted"><span class="detail-control opinion-flag">建议已处理</span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div mode="detail" class="problem-opinion editable" fieldId="problem" opinion="true" itemId="${problemView.id}">' +
                                '<div class="row">' +
                                    '<div class="opinion-label">评审意见</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="col-md-12 detail-control detail-content">${problemView.problemOpinion}</div>' +
                                    '<textarea class="col-md-12 edit-control edit-content" style="height: 120px; display:none; width:100%;"></textarea>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="pull-right">' +
                                        '<button class="btn btn-success edit-button detail-control">编辑评审意见</button>' +
                                        '<button class="btn btn-success save-button edit-control">保存</button>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            //'<hr>' +
                            '<div type="1" class="list-group patient-list">' +
                                '{{each(j, patientView) problemView.patientViews}}' +
                                    '{{if patientView.discoveryViews.length == 1}}' +//如果一个受试者只有一条记录
                                        '{{each(k, discoveryView) patientView.discoveryViews}}' +
                                            '<div class="discovery-item" id="${id}">' +
                                                //问题描述
                                                '<div mode="detail" class="editable" fieldId="description" itemId="${discoveryView.id}" opinion="false">' +
                                                    '<span class="patient-index">${patientView.index}）</span>' +
                                                    '{{if patientView.patientNo != "-"}}' +
                                                    '<span class="patient-item font-hwfs-12">受试者${patientView.patientNo}：</span>' +
                                                    '{{/if}}' +
                                                    '<span class="detail-control detail-content discovery-description font-hwfs-12">${discoveryView.description}</span><span class="stage">${ReportDetail.getCenterCode(discoveryView)}</span>' +
                                                    '<div class="row">' +
                                                        '<textarea class="col-md-12 edit-control edit-content" style="display:none; width:100%;"></textarea>' +
                                                    '</div>' +
                                                    '<div class="row">' +
                                                        '<div class="text-right">' +
                                                            '<button class="btn btn-success edit-button detail-control">修改</button>' +
                                                            '<button class="btn btn-success edit-discovery detail-control">详细</button>' +
                                                            '<button class="btn btn-success save-button edit-control">保存</button>' +
                                                            '<input type="checkbox" class="detail-control opinion-accepted">' +
                                                            '<span class="detail-control opinion-flag">建议已处理</span>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                                //问题描述的评审意见
                                                '<div mode="detail" class="editable" fieldId="description" opinion="true" itemId="${discoveryView.id}">' +
                                                    '<div class="row">' +
                                                        '<div class="opinion-label">评审意见:</div>' +
                                                    '</div>' +
                                                    '<div class="row">' +
                                                        '<div class="col-md-12 detail-control detail-content discovery-description-opinion font-hwfs-12">${discoveryView.descriptionOpinion}</div>' +
                                                        '<textarea class="col-md-12 edit-control edit-content" style="height: 120px; display:none; width:100%;"></textarea>' +
                                                    '</div>' +
                                                    '<div class="row">' +
                                                        '<div class="pull-right">' +
                                                            '<button class="btn btn-success edit-button detail-control">编辑评审意见</button>' +
                                                            '<button class="btn btn-success save-button edit-control">保存</button>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                                //分级员分级
                                                '<div class="row level2">' +
                                                    '<span class="level2-item">分级员分级：${discoveryView.level2}</span>' +
                                                '</div>' +
                                                //'<br>' +
                                            '</div>' +
                                        '{{/each}}' +
                                    '{{else}}' +//如果受试者有多条记录
                                    '<div id="${id}">' +
                                        '<span class="patient-index font-hwfs-12">${patientView.index}）</span>' +
                                        '<span class="patient-item font-hwfs-12">受试者${patientView.patientNo}：</span>' +
                                        '<div type="a" class="list-group description-list">' +
                                        '{{each(k, discoveryView) patientView.discoveryViews}}' +
                                            '<div class="discovery-item" id="${id}">' +
                                                //问题描述
                                                '<div mode="detail" class="editable" fieldId="description" itemId="${discoveryView.id}" opinion="false">' +
                                                    '<span class="description-index">${ReportDetail.getLetter(discoveryView.index)}）</span>' +
                                                    '<span class="detail-control detail-content discovery-description description-detail-control">${discoveryView.description}</span><span class="stage">${ReportDetail.getCenterCode(discoveryView)}</span>' +
                                                    '<div class="row">' +
                                                        '<textarea class="col-md-12 edit-control edit-content" style="display: none; width:100%;"></textarea>' +
                                                    '</div>' +
                                                    '<div class="row">' +
                                                        '<div class="text-right">' +
                                                            '<button class="btn btn-success edit-button detail-control">修改</button>' +
                                                            '<button class="btn btn-success edit-discovery detail-control">详细</button>' +
                                                            '<button class="btn btn-success save-button edit-control">保存</button>' +
                                                            '<input type="checkbox" class="detail-control opinion-accepted">' +
                                                            '<span class="detail-control opinion-flag">建议已处理</span>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                                //问题描述的评审意见
                                                '<div mode="detail" class="editable" fieldId="description" opinion="true" itemId="${discoveryView.id}">' +
                                                    '<div class="row">' +
                                                        '<div class="opinion-label">评审意见:</div>' +
                                                    '</div>' +
                                                    '<div class="row">' +
                                                        '<div class="col-md-12 detail-control detail-content discovery-description-opinion">${discoveryView.descriptionOpinion}</div>' +
                                                        '<textarea class="col-md-12 edit-control edit-content" style="height: 120px; display:none; width:100%;"></textarea>' +
                                                    '</div>' +
                                                    '<div class="row">' +
                                                        '<div class="pull-right">' +
                                                            '<button class="btn btn-success edit-button detail-control">编辑评审意见</button>' +
                                                            '<button class="btn btn-success save-button edit-control">保存</button>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                                //分级员分级
                                                '<div class="row level2">' +
                                                    '<span class="level2-item">分级员分级：${discoveryView.level2}</span>' +
                                                '</div>' +
                                                //'<br>' +
                                            '</div>' +
                                        '{{/each}}' +
                                        '</div>' +
                                    '</div>' +
                                    '{{/if}}' +
                                '{{/each}}' +
                            '</div>' +
                            '<div class="row">' +
                                '<span class="category-item font-hwfs-12">分类：${problemView.category}</span>' +
                            '</div>' +
                            '<div class="row">' +
                                '<span class="reference-span1 font-hwfs-12">依据：</span>' +
                                '<span class="reference-span2" style="width: 1085px;">' +
                                    '<div class="reference-container">' +
                                        '{{each(k, reference) problemView.references}}' +
                                        '<div mode="detail" class="editable reference-item" fieldId="reference" itemId="${reference.id}" opinion="false" referenceId="${referenceId}">' +
                                            '<div class="row">' +
                                                '<span class="detail-control detail-content font-hwfs-12">${reference.name}</span>' +
                                                '<textarea class="col-md-12 edit-control edit-content" style="display:none; width:100%;"></textarea>' +
                                            '</div>' +
                                            '<div class="row">' +
                                                '<div class="text-right">' +
                                                    '<button class="btn btn-success edit-button detail-control">修改</button>' +
                                                    '<button class="btn btn-success delete-reference detail-control">删除</button>' +
                                                    '<button class="btn btn-success save-button edit-control">保存</button>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                        '{{/each}}' +
                                    '</div>' +
                                    '<button class="btn btn-success add-reference">添加</button>' +
                                '</span>' +
                            '</div>' +
                            '<br>' +
                        '</div>' +
                        '{{/each}}' +
                    '</div>' +
                '</div>';

            $.template("discoveryTemplate", discoveryTemplate);

            var referenceTemplate =
                '<div mode="detail" class="editable reference-item" fieldId="reference" itemId="${id}" opinion="false" referenceId="${referenceId}">' +
                    '<div class="row">' +
                        '<span class="detail-control detail-content font-hwfs-12">${name}</span>' +
                        '<textarea class="col-md-12 edit-control edit-content" style="width:100%;"></textarea>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="text-right">' +
                            '<button class="btn btn-success edit-button detail-control">修改</button>' +
                            '<button class="btn btn-success delete-reference detail-control">删除</button>' +
                            '<button class="btn btn-success save-button edit-control">保存</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            $.template("referenceTemplate", referenceTemplate);
        },

        empty: null
    }
}();

