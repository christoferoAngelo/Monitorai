package com.eva.monitorai;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link MonitoraiApplication}.
 */
@Generated
public class MonitoraiApplication__BeanDefinitions {
  /**
   * Get the bean definition for 'monitoraiApplication'.
   */
  public static BeanDefinition getMonitoraiApplicationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(MonitoraiApplication.class);
    beanDefinition.setInstanceSupplier(MonitoraiApplication::new);
    return beanDefinition;
  }
}
