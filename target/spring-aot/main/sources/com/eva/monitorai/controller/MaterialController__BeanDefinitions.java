package com.eva.monitorai.controller;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link MaterialController}.
 */
@Generated
public class MaterialController__BeanDefinitions {
  /**
   * Get the bean definition for 'materialController'.
   */
  public static BeanDefinition getMaterialControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(MaterialController.class);
    InstanceSupplier<MaterialController> instanceSupplier = InstanceSupplier.using(MaterialController::new);
    instanceSupplier = instanceSupplier.andThen(MaterialController__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
