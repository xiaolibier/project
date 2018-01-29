package com.jwcq.repository;

import com.jwcq.entity.Confident;
import com.jwcq.entity.User;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.persistence.Table;
import java.util.List;

/**
 * Created by liuma on 2017/5/19.
 */
@Repository
@Table(name = "confident")
@Qualifier("confidentRepository")
public interface ConfidentRepository extends JpaRepository<Confident, Long>,JpaSpecificationExecutor<Confident> {

    @Query(value="select bean.user_name from Confident bean group by bean.user_name")
    List findMembers();

}