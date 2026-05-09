package com.eva.monitorai.controller;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link MonitoriaController}.
 */
@Generated
public class MonitoriaController__BeanDefinitions {
  /**
   * Get the bean definition for 'monitoriaController'.
   */
  public static BeanDefinition getMonitoriaControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(MonitoriaController.class);
    InstanceSupplier<MonitoriaController> instanceSupplier = InstanceSupplier.using(MonitoriaController::new);
    instanceSupplier = instanceSupplier.andThen(MonitoriaController__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
