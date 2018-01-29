package com.jwcq.service;

import com.jwcq.config.Config;
import com.jwcq.entity.Project;
import com.jwcq.repository.ProjectPageRepository;
import com.jwcq.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Date;
import java.util.List;

/**
 * Created by liuma on 2017/5/18.
 */
@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectPageRepository projectPageRepository;


    public List<Project> findByProjectLike(String serial, String name, String sponsor,String user,String state,Date start, Date end) {
        //return null;
        return projectRepository.findProject(serial,name,sponsor,user,state,start,end);

    }


    public Iterable<Project> findByProjectLike(String serial, String name, String sponsor,String user,String state, Date start, Date end, Pageable pageable) {
       Iterable<Project>projects= projectPageRepository.findProject(serial,name,sponsor,user,state,start,end,pageable);
        return projects;

    }
    //评审页面的查找，不包括暂存的预算
    public Iterable<Project> findByAuditProjectLike(String serial, String name, String sponsor,String user,String state, Date start, Date end, Pageable pageable) {
        Iterable<Project>projects= projectPageRepository.findAuditProject(serial,name,sponsor,user,state,start,end,pageable);
        return projects;

    }

    public Iterable<Project> findTest(Pageable page){
        return projectPageRepository.getProjects(page);

    }


    public Project createProject(Project project) {
        if(projectRepository.findBySerialNumberAndVersion(project.getSerial_number(),project.getVersion()).size()==0){
            return projectRepository.save(project);
        }else{
            return null;
        }

    }
    public int findMaxId(){
       return projectRepository.getNextId();
    }


    public Project updateProject(Project project) {
        return  projectRepository.save(project);
    }

    public int updateRemarks(int id,String remark){
        return projectRepository.updateRemarks(id,remark);
    }

    public List<Project> copyProject(int id) {
        return null;
    }


    public Project findProjectById(int id) {
        return  projectRepository.findById(id);
    }


    public boolean deleteProjectById(int id) {
        Project project= projectRepository.findById(id);
        if(project==null)return false;
        else {
            project.setIs_delete(1);
            projectRepository.save(project);
            return true;
        }
    }



    public List<Project> findAll() {
        Sort sort = new Sort(Sort.Direction.DESC, "id");
        List<Project> projects=projectRepository.findAll(sort);
        return projects;
    }


    public Iterable<Project> findAll(Pageable pageable) {
        Iterable<Project>projects= projectPageRepository.findAll(pageable);
        return projects;
    }


    public List test(){
        return projectRepository.findObjectById();
    }


    public int findMaxProjectId(String serial) {
        List<Project>projects= projectRepository.findProjectsBySerial(serial);
        if(projects==null||projects.size()==0)return 0;
        else return projects.get(0).getVersion_num();
    }



    /**
     * 提交项目审核
     * 提交前是暂存、提交后是审核中，审核后是审核通过/审核驳回
     * **/

    public boolean submitProjectById(int id) {
        Project project= projectRepository.findById(id);
        if(project==null)return false;
        else if(Config.TEMP.equals(project.getState())||Config.REJECT.equals(project.getState())){
            //暂存状态或者驳回状态的
            projectRepository.updateProjectState(id,Config.REVIEWING);
            return true;
        } else
            return false;
    }

    /**
     * 审核驳回
     * **/

    public boolean rejectProjectById(int id) {
        Project project= projectRepository.findById(id);
        if(project==null)return false;
        else if(Config.REVIEWING.equals(project.getState())){
            projectRepository.updateProjectState(id,Config.REJECT);
            return true;
        }else  return false;
    }
    /**
     * 审核通过
     * **/

    public boolean passProjectById(int id) {
        Project project= projectRepository.findById(id);
        if(project==null)return false;
        else if(Config.REVIEWING.equals(project.getState())){
            projectRepository.updateProjectState(id,Config.PASS);
            return true;
        }else return false;
    }
}
