package com.eva.monitorai.service;

import com.eva.monitorai.repository.CursoRepository;
import com.eva.monitorai.repository.DisciplinaRepository;
import com.eva.monitorai.repository.UsuarioRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link DisciplinaService}.
 */
@Generated
public class DisciplinaService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'disciplinaService'.
   */
  private static BeanInstanceSupplier<DisciplinaService> getDisciplinaServiceInstanceSupplier() {
    return BeanInstanceSupplier.<DisciplinaService>forConstructor(DisciplinaRepository.class, CursoRepository.class, UsuarioRepository.class)
            .withGenerator((registeredBean, args) -> new DisciplinaService(args.get(0), args.get(1), args.get(2)));
  }

  /**
   * Get the bean definition for 'disciplinaService'.
   */
  public static BeanDefinition getDisciplinaServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(DisciplinaService.class);
    beanDefinition.setInstanceSupplier(getDisciplinaServiceInstanceSupplier());
    return beanDefinition;
  }
}
