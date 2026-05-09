package com.eva.monitorai.service;

import com.eva.monitorai.repository.CursoRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link CursoService}.
 */
@Generated
public class CursoService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'cursoService'.
   */
  private static BeanInstanceSupplier<CursoService> getCursoServiceInstanceSupplier() {
    return BeanInstanceSupplier.<CursoService>forConstructor(CursoRepository.class)
            .withGenerator((registeredBean, args) -> new CursoService(args.get(0)));
  }

  /**
   * Get the bean definition for 'cursoService'.
   */
  public static BeanDefinition getCursoServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(CursoService.class);
    beanDefinition.setInstanceSupplier(getCursoServiceInstanceSupplier());
    return beanDefinition;
  }
}
