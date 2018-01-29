package com.jwcq.repository;

import com.jwcq.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Date;
import java.util.List;

/**
 * Created by liuma on 2017/5/19.
 */
public interface ProjectPageRepository extends PagingAndSortingRepository<Project, Long> {
    Project findById(int id);

    List<Project> findByNameLike(String name);
    @Query(value="select bean from Project bean where serial_number like %?1% and name like %?2% and (sponsor like %?3% or sponsor_code like %?3%) and user like %?4% and state like %?5% and  create_time>?6 and create_time<?7 and is_delete=0")
    Page findProject(String serial, String name, String sponsor, String user,String state,Date start, Date end, Pageable page);

    @Query(value="select bean from Project bean where serial_number like %?1% and name like %?2% and (sponsor like %?3% or sponsor_code like %?3%) and user like %?4% and state like %?5% and  create_time>?6 and create_time<?7 and is_delete=0 and state != '暂存'")
    Page findAuditProject(String serial, String name, String sponsor, String user,String state,Date start, Date end, Pageable page);


    @Query(value="select bean.id,bean.center_number from Project bean",nativeQuery = false)
    Page getProjects(Pageable page);

    @Query(value="select * from budget_summary where serial_number=?1 and version=?2 and is_delete=0",nativeQuery = true)
    List<Project> findBySerialNumberAndVersion(String serial, String version);

    @Query(value="select serial_number, version from budget_summary where id>0",nativeQuery = true)
    List findObjectById();

}
