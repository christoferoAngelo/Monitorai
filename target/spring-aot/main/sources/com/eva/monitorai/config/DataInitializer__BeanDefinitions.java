package com.eva.monitorai.config;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.annotation.ConfigurationClassUtils;

/**
 * Bean definitions for {@link DataInitializer}.
 */
@Generated
public class DataInitializer__BeanDefinitions {
  /**
   * Get the bean definition for 'dataInitializer'.
   */
  public static BeanDefinition getDataInitializerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(DataInitializer.class);
    beanDefinition.setTargetType(DataInitializer.class);
    ConfigurationClassUtils.initializeConfigurationClass(DataInitializer.class);
    InstanceSupplier<DataInitializer> instanceSupplier = InstanceSupplier.using(DataInitializer$$SpringCGLIB$$0::new);
    instanceSupplier = instanceSupplier.andThen(DataInitializer__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
