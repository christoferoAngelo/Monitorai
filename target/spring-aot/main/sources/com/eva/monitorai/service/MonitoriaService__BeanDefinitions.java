package com.eva.monitorai.service;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link MonitoriaService}.
 */
@Generated
public class MonitoriaService__BeanDefinitions {
  /**
   * Get the bean definition for 'monitoriaService'.
   */
  public static BeanDefinition getMonitoriaServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(MonitoriaService.class);
    InstanceSupplier<MonitoriaService> instanceSupplier = InstanceSupplier.using(MonitoriaService::new);
    instanceSupplier = instanceSupplier.andThen(MonitoriaService__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
