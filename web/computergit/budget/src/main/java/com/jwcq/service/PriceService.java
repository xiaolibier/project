package com.jwcq.service;


import com.jwcq.repository.PriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.jwcq.entity.*;

/**
 * Created by luotuo on 17-5-19.
 */

@Service
public class PriceService {

    @Autowired
    private PriceRepository priceRepository;

    public Iterable<Price> getAll(){
      return  priceRepository.findAll();
    }
}
