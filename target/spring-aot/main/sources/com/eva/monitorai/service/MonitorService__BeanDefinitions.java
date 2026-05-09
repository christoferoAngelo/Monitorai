package com.eva.monitorai.service;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link MonitorService}.
 */
@Generated
public class MonitorService__BeanDefinitions {
  /**
   * Get the bean definition for 'monitorService'.
   */
  public static BeanDefinition getMonitorServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(MonitorService.class);
    InstanceSupplier<MonitorService> instanceSupplier = InstanceSupplier.using(MonitorService::new);
    instanceSupplier = instanceSupplier.andThen(MonitorService__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
