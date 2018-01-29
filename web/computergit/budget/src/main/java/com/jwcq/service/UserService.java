package com.jwcq.service;

import com.jwcq.config.Config;
import com.jwcq.entity.User;
import com.jwcq.repository.UserRepository;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by liuma on 2017/6/7.
 */
@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

     /**
     * 根据email获取当前用户的角色
     * */
    public String getRole(){
        List<User> users=userRepository.findByAccount(getUserAccount());
        if(users==null||users.size()==0){
            return Config.VIEWER;
        }else if(users.get(0).getRole().contains(Config.ADMIN)){
            return Config.ADMIN;

        }else if(users.get(0).getRole().contains(Config.USER)){
            return Config.USER;

        }else if(users.get(0).getRole().contains(Config.REVIEWER)){
            return Config.REVIEWER;

        }
        else return Config.VIEWER;
    }


    /**
     * 根据当前用户的信息
     * */
    public User getUserInfo(){
        List<User> users=userRepository.findByAccount(getUserAccount());
        if(users==null||users.size()==0){
            User user=new User();
            user.setName("未登录测试");
            user.setEmail("未登录@未登录.com");
            user.setContact("15556123456");
            user.setRole(Config.VIEWER);
            return user;
        }else{
            return users.get(0);
        }

    }
    /**
     * 获取知会者
     * */
    /**
     * 根据当前用户的信息
     * */
    public List<User> getNotifier(){
        List<User> users=userRepository.findByRole(Config.NOTIFY);
        if(users==null||users.size()==0){
            User user=new User();
            user.setName("未登录测试");
            user.setEmail("未登录@未登录.com");
            user.setContact("15011488150");
            user.setRole(Config.VIEWER);
            users=new ArrayList<User>();
            users.add(user);
            return users;
        }else{

            return users;
        }

    }

    /**
     * 获取用户email
     * */
    public String getUserAccount() {
//        shiro-cas
        Subject subject = SecurityUtils.getSubject();
        if (subject == null || subject.getPrincipals() == null) {
            return null;
        }

        return (String) subject.getPrincipals().getPrimaryPrincipal();
//        shiro-cas
//        return "未登录@未登录.com";com
    }



}
