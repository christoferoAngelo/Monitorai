package com.eva.monitorai.security;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link JwtFilter}.
 */
@Generated
public class JwtFilter__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static JwtFilter apply(RegisteredBean registeredBean, JwtFilter instance) {
    AutowiredFieldValueResolver.forRequiredField("jwtUtil").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("userDetailsService").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
