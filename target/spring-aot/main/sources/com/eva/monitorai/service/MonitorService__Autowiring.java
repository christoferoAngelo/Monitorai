package com.eva.monitorai.service;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link MonitorService}.
 */
@Generated
public class MonitorService__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static MonitorService apply(RegisteredBean registeredBean, MonitorService instance) {
    AutowiredFieldValueResolver.forRequiredField("monitorRepository").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("usuarioRepository").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
