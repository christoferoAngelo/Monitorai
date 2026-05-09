package com.eva.monitorai.controller;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link AuthController}.
 */
@Generated
public class AuthController__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static AuthController apply(RegisteredBean registeredBean, AuthController instance) {
    AutowiredFieldValueResolver.forRequiredField("service").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("usuarioRepository").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("authenticationManager").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("jwtUtil1").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("userDetailsService").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("passwordEncoder").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
