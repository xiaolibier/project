package com.jwcq.service;

import com.jwcq.entity.Sponsor;
import com.jwcq.repository.SponsorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.logging.SocketHandler;

/**
 * Created by liuma on 2017/6/7.
 */
@Service
public class SponsorService {

    @Autowired
    private SponsorRepository sponsorRepository;

    /**
     * 查找申办方/委托方
     * */
    public Sponsor findSponsorById(int id){
        return sponsorRepository.findById(id);
    }
    /**
     * 通过名称查找申办方/委托方
     * */
    public Sponsor findSponsorsByName(String name){
        List<Sponsor> sponsors=sponsorRepository.findByName(name);
        if(sponsors!=null&&sponsors.size()>0){
            return sponsors.get(0);
        }else{
            Sponsor sp=  new Sponsor();
            sp.setName("未知");
            sp.setCode("UNKNOWN");
            return sp;
        }
    }
    /**
     * 通过代码查找申办方/委托方
     * */
    public Sponsor findSponsorsByCode(String code){
        List<Sponsor> sponsors=sponsorRepository.findByCode(code);
        if(sponsors!=null&&sponsors.size()>0){
            return sponsors.get(0);
        }else{
            Sponsor sp=  new Sponsor();
            sp.setName("");
            sp.setCode("");
            return sp;
        }
    }

   /*
   * 获取所有申办方、委托方列表
   * **/
   public List<Sponsor> findAllSponsor(){
       return sponsorRepository.findAll();
   }

   /**
    * 新建委托方
    * */

   public boolean saveSponsor(String name,String code){
       List<Sponsor> sp=  sponsorRepository.findByNameOrCode(name,code);
       if(sp==null||sp.size()==0){
           Sponsor sponsor=new Sponsor();
           sponsor.setName(name);
           sponsor.setCode(code);
           sponsorRepository.save(sponsor);
        return true;
        }
        return false;
   }

}
