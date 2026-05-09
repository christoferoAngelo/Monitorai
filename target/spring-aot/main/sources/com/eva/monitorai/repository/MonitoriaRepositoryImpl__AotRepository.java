package com.eva.monitorai.repository;

import com.eva.monitorai.model.entity.Monitoria;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.lang.Long;
import java.lang.String;
import java.util.List;
import org.springframework.aot.generate.Generated;
import org.springframework.data.jpa.repository.aot.AotRepositoryFragmentSupport;
import org.springframework.data.jpa.repository.query.QueryEnhancerSelector;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;

/**
 * AOT generated JPA repository implementation for {@link MonitoriaRepository}.
 */
@Generated
public class MonitoriaRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public MonitoriaRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link MonitoriaRepository#findByAtivaTrue()}.
   */
  public List<Monitoria> findByAtivaTrue() {
    String queryString = "SELECT m FROM Monitoria m WHERE m.ativa = TRUE";
    Query query = this.entityManager.createQuery(queryString);

    return (List<Monitoria>) query.getResultList();
  }

  /**
   * AOT generated implementation of {@link MonitoriaRepository#findByDisciplinaId(java.lang.Long)}.
   */
  public List<Monitoria> findByDisciplinaId(Long disciplinaId) {
    String queryString = "SELECT m FROM Monitoria m WHERE m.disciplina.id = :disciplinaId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("disciplinaId", disciplinaId);

    return (List<Monitoria>) query.getResultList();
  }

  /**
   * AOT generated implementation of {@link MonitoriaRepository#findByMonitorId(java.lang.Long)}.
   */
  public List<Monitoria> findByMonitorId(Long monitorId) {
    String queryString = "SELECT m FROM Monitoria m WHERE m.monitor.id = :monitorId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("monitorId", monitorId);

    return (List<Monitoria>) query.getResultList();
  }
}
