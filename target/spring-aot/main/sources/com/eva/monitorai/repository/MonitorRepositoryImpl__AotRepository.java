package com.eva.monitorai.repository;

import com.eva.monitorai.model.entity.Monitor;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.lang.Long;
import java.lang.String;
import java.util.Optional;
import org.springframework.aot.generate.Generated;
import org.springframework.data.jpa.repository.aot.AotRepositoryFragmentSupport;
import org.springframework.data.jpa.repository.query.QueryEnhancerSelector;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;

/**
 * AOT generated JPA repository implementation for {@link MonitorRepository}.
 */
@Generated
public class MonitorRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public MonitorRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link MonitorRepository#findByUsuarioId(java.lang.Long)}.
   */
  public Optional<Monitor> findByUsuarioId(Long usuarioId) {
    String queryString = "SELECT m FROM Monitor m WHERE m.usuario.id = :usuarioId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("usuarioId", usuarioId);

    return Optional.ofNullable((Monitor) convertOne(query.getSingleResultOrNull(), false, Monitor.class));
  }
}
