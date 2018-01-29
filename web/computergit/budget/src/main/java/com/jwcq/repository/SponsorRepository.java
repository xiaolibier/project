package com.jwcq.repository;

import com.jwcq.entity.Project;
import com.jwcq.entity.Sponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

/**
 * Created by liuma on 2017/5/19.
 */
public interface SponsorRepository extends JpaRepository<Sponsor, Long> {
    Sponsor findById(int id);

    List<Sponsor> findByName(String name);

    List<Sponsor> findByCode(String code);

    List<Sponsor> findByNameOrCode(String name,String code);


}