package com.jwcq.repository;

import com.jwcq.entity.BudgetCalculator;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.persistence.Table;

/**
 * Created by liuma on 2017/9/29.
 */
@Repository
@Table(name = "open_budget_calculator")
@Qualifier("calculatorRepository")
public interface CalculatorRepository extends JpaRepository<BudgetCalculator, Long>,JpaSpecificationExecutor<BudgetCalculator> {



}