package com.jwcq.repository;

import com.jwcq.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

/**
 * Created by liuma on 2017/5/19.
 */
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Project findById(int id);


    List<Project> findByNameLike(String name);

    @Query(value="select * from budget_summary where serial_number like %?1% and name like %?2% and (sponsor like %?3% or sponsor_code like %?3%) and user like %?4% and state like %?5% and create_time>?6 and create_time<?7 and is_delete=0 order by id desc",nativeQuery = true)
    List<Project>findProject(String serial,String name,String sponsor,String user,String state,Date start,Date end);

    @Query(value="select * from budget_summary where serial_number=?1 and version=?2 and is_delete=0 order by id desc",nativeQuery = true)
    List<Project> findBySerialNumberAndVersion(String serial,String version);

    @Query(value="select serial_number, version from budget_summary where id>0",nativeQuery = true)
    List findObjectById();

    @Query(value="select * from budget_summary where serial_number=?1 order by version_num desc",nativeQuery = true)
    List<Project> findProjectsBySerial(String serial);

    @Modifying
    @Transactional
    @Query(value="update budget_summary set state=?2 where id=?1",nativeQuery = true)
    int updateProjectState(int id,String state);

    @Modifying
    @Transactional
    @Query(value="update budget_summary set remarks=?2 where id=?1",nativeQuery = true)
    int updateRemarks(int id,String remark);

    @Query(value="SELECT Auto_increment FROM information_schema.TABLES WHERE  TABLE_SCHEMA = 'budget' and table_name = 'budget_summary'",nativeQuery = true)
    int getNextId();


}