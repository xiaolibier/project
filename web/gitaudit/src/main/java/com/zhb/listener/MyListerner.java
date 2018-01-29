package com.zhb.listener;

import com.zhb.manager.MemoryCache;
import com.zhb.manager.PageManager;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletContextEvent;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Enumeration;
import java.util.Properties;

/**
 * Created by zhouhaibin on 2016/7/19.
 * 系统初始化的监听器
 */
public class MyListerner extends ContextLoaderListener {
    static Logger logger = Logger.getLogger(MyListerner.class);

    @Override
    public void contextInitialized(ServletContextEvent event) {
        initLogPath(event);
        String threadName = new SimpleDateFormat("HHmmss").format(new Timestamp(System.currentTimeMillis())) + "MAIN";
        Thread.currentThread().setName(threadName);
        logger.debug("audit begin start");

        logger.debug("contextInitialized begin...");
        super.contextInitialized(event);
        logger.debug("contextInitialized end.");

        ApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(event.getServletContext());
        MemoryCache.initialize(applicationContext);
        PageManager.reloadConfig();
        logger.debug("audit started");
    }

    public void initLogPath(ServletContextEvent servletContextEvent) {
        String logPath = System.getenv().get("AUDIT_LOG_PATH");
        System.out.println("logPath=" + logPath);
        if (logPath == null)
            return ;
        logPath = logPath.replace("\\", "/");
        if (!logPath.endsWith("/"))
            logPath += "/";
        String prefix = servletContextEvent.getServletContext().getRealPath("/");
        String file = "WEB-INF/classes/log4j.properties";
        String filePath = prefix + file;
        Properties props = new Properties();
        try {
            FileInputStream istream = new FileInputStream(filePath);
            props.load(istream);
            istream.close();
            Enumeration enumeration = props.propertyNames();
            while(enumeration.hasMoreElements()) {
                String name = (String)enumeration.nextElement();
                if (name.endsWith(".File") && name.startsWith("log4j.appender.")) {
                    props.setProperty(name, logPath + props.getProperty(name));
                }
            }
            PropertyConfigurator.configure(props);//装入log4j配置信息
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }
    }
}
