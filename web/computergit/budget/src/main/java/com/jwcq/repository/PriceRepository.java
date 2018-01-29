package com.jwcq.repository;

import com.jwcq.entity.Price;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import javax.persistence.Table;

/**
 * Created by luotuo on 17-5-19.
 */

@Repository
@Table(name = "price")
@Qualifier("priceRepository")
public interface PriceRepository extends JpaRepository<Price, Long> {

}
