package com.eva.monitorai.config;

import com.eva.monitorai.repository.CursoRepository;
import com.eva.monitorai.repository.DisciplinaRepository;
import com.eva.monitorai.service.DisciplinaService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.ConfigurationClassUtils;

/**
 * Bean definitions for {@link DataLoader}.
 */
@Generated
public class DataLoader__BeanDefinitions {
  /**
   * Get the bean definition for 'dataLoader'.
   */
  public static BeanDefinition getDataLoaderBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(DataLoader.class);
    beanDefinition.setTargetType(DataLoader.class);
    ConfigurationClassUtils.initializeConfigurationClass(DataLoader.class);
    beanDefinition.setInstanceSupplier(DataLoader$$SpringCGLIB$$0::new);
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'carregarDados'.
   */
  private static BeanInstanceSupplier<CommandLineRunner> getCarregarDadosInstanceSupplier() {
    return BeanInstanceSupplier.<CommandLineRunner>forFactoryMethod(DataLoader$$SpringCGLIB$$0.class, "carregarDados", CursoRepository.class, DisciplinaRepository.class, DisciplinaService.class)
            .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("dataLoader", DataLoader.class).carregarDados(args.get(0), args.get(1), args.get(2)));
  }

  /**
   * Get the bean definition for 'carregarDados'.
   */
  public static BeanDefinition getCarregarDadosBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(CommandLineRunner.class);
    beanDefinition.setFactoryBeanName("dataLoader");
    beanDefinition.setInstanceSupplier(getCarregarDadosInstanceSupplier());
    return beanDefinition;
  }
}
