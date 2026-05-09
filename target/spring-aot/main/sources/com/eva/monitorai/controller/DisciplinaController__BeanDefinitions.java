package com.eva.monitorai.controller;

import com.eva.monitorai.service.DisciplinaService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link DisciplinaController}.
 */
@Generated
public class DisciplinaController__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'disciplinaController'.
   */
  private static BeanInstanceSupplier<DisciplinaController> getDisciplinaControllerInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<DisciplinaController>forConstructor(DisciplinaService.class)
            .withGenerator((registeredBean, args) -> new DisciplinaController(args.get(0)));
  }

  /**
   * Get the bean definition for 'disciplinaController'.
   */
  public static BeanDefinition getDisciplinaControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(DisciplinaController.class);
    beanDefinition.setInstanceSupplier(getDisciplinaControllerInstanceSupplier());
    return beanDefinition;
  }
}
