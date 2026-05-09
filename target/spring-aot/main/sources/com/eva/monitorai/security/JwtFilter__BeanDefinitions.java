package com.eva.monitorai.security;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link JwtFilter}.
 */
@Generated
public class JwtFilter__BeanDefinitions {
  /**
   * Get the bean definition for 'jwtFilter'.
   */
  public static BeanDefinition getJwtFilterBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(JwtFilter.class);
    InstanceSupplier<JwtFilter> instanceSupplier = InstanceSupplier.using(JwtFilter::new);
    instanceSupplier = instanceSupplier.andThen(JwtFilter__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
