package com.eva.monitorai.service;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link MonitoriaService}.
 */
@Generated
public class MonitoriaService__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static MonitoriaService apply(RegisteredBean registeredBean, MonitoriaService instance) {
    AutowiredFieldValueResolver.forRequiredField("monitoriaRepository").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("monitorRepository").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("disciplinaRepository").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("usuarioRepository").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
