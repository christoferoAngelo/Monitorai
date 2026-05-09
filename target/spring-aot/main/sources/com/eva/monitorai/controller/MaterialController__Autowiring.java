package com.eva.monitorai.controller;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link MaterialController}.
 */
@Generated
public class MaterialController__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static MaterialController apply(RegisteredBean registeredBean,
      MaterialController instance) {
    AutowiredFieldValueResolver.forRequiredField("materialRepository").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("usuarioRepository").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
