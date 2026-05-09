package com.eva.monitorai.controller;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link MonitoriaController}.
 */
@Generated
public class MonitoriaController__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static MonitoriaController apply(RegisteredBean registeredBean,
      MonitoriaController instance) {
    AutowiredFieldValueResolver.forRequiredField("monitoriaService").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
