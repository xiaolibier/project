package com.jwcq.service;

import com.jwcq.config.Config;
import com.jwcq.entity.Confident;
import com.jwcq.entity.Project;
import com.jwcq.repository.ConfidentRepository;
import com.jwcq.utils.Format;
import com.jwcq.utils.SpecificationFactory;
import com.jwcq.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specifications;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * Created by liuma on 2017/5/18.
 */
@Service
public class ConfidentService {
    @Autowired
    private ConfidentRepository confidentRepository;

    public Confident findById(Long id){
        return confidentRepository.findOne(id);
    }

    public Confident save(Confident confident){
        return confidentRepository.save(confident);
    }
    public Confident create(Confident confident){
       return confidentRepository.saveAndFlush(confident);
    }
    public List<String> findMembers(){
        return confidentRepository.findMembers();
    }
    public void delete(Long id){
        confidentRepository.delete(id);
    }

    public Page<Confident> findByparams(Long currentUserId,
                                        String code, String project_name, String sponsor, String userName, Date start_time, Date end_time, PageRequest pageRequest
    ){
        Specifications<Confident> conditions=Specifications.where(SpecificationFactory.greater("id",0));
        if(currentUserId!=null)conditions=conditions.and(SpecificationFactory.equal("user_id",currentUserId));//只有管理员不用筛选，其他用户只能筛选这个
        if(StringUtils.isNotBlank(project_name))conditions=conditions.and(SpecificationFactory.containsLike("project_name",project_name));
        if(StringUtils.isNotBlank(code))conditions=conditions.and(SpecificationFactory.containsLike("code",code));
        if(StringUtils.isNotBlank(sponsor))conditions=conditions.and(SpecificationFactory.containsLike("sponsor",sponsor));
        if(StringUtils.isNotBlank(userName))conditions=conditions.and(SpecificationFactory.containsLike("user_name",userName));
        if(start_time==null){
            System.out.println("null ===start_time"+start_time);
            start_time= Format.formatDate("2017-01-01");
        }
        if(end_time==null){
            System.out.println("null ===end_time"+end_time);
            end_time=Format.formatDate("2025-01-01");
        }
        conditions= conditions.and(SpecificationFactory.isBetween("create_time",start_time,end_time));
        return confidentRepository.findAll(conditions,pageRequest);
    }

}
