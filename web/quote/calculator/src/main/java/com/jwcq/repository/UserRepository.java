package com.jwcq.repository;

import com.jwcq.entity.User;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.persistence.Table;
import java.util.List;

/**
 * Created by liuma on 2017/5/19.
 */

@Repository
@Table(name = "user")
@Qualifier("userRepository")
public interface UserRepository extends JpaRepository<User, Long> {
    User findById(int id);

    List<User> findByRole(String role);



    List<User> findByAccount(String account);

    List<User> findByContact(String contact);

    @Query(value="select bean from User bean where bean.account = ?1 and bean.password like %?2%")
    List<User> findByAccountAndPassword(String name,String password);

    @Query(value="select bean from User bean where bean.contact = ?1 and bean.password like %?2%")
    List<User> findByPhoneAndPassword(String name,String password);

    @Query(value="select bean from User bean where bean.contact = ?1")
    List<User> findByPhone(String contact);

}