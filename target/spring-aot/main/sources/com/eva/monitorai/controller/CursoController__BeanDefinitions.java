package com.eva.monitorai.controller;

import com.eva.monitorai.service.CursoService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link CursoController}.
 */
@Generated
public class CursoController__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'cursoController'.
   */
  private static BeanInstanceSupplier<CursoController> getCursoControllerInstanceSupplier() {
    return BeanInstanceSupplier.<CursoController>forConstructor(CursoService.class)
            .withGenerator((registeredBean, args) -> new CursoController(args.get(0)));
  }

  /**
   * Get the bean definition for 'cursoController'.
   */
  public static BeanDefinition getCursoControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(CursoController.class);
    beanDefinition.setInstanceSupplier(getCursoControllerInstanceSupplier());
    return beanDefinition;
  }
}
