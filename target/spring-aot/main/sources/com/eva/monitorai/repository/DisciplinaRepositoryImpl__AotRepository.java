package com.eva.monitorai.repository;

import com.eva.monitorai.model.entity.Disciplina;
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
 * AOT generated JPA repository implementation for {@link DisciplinaRepository}.
 */
@Generated
public class DisciplinaRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public DisciplinaRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link DisciplinaRepository#existsByCodigo(java.lang.String)}.
   */
  public boolean existsByCodigo(String codigo) {
    String queryString = "SELECT d.id FROM Disciplina d WHERE d.codigo = :codigo";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("codigo", codigo);
    query.setMaxResults(1);

    return !query.getResultList().isEmpty();
  }

  /**
   * AOT generated implementation of {@link DisciplinaRepository#findByCursoId(java.lang.Long)}.
   */
  public List<Disciplina> findByCursoId(Long cursoId) {
    String queryString = "SELECT d FROM Disciplina d WHERE d.curso.id = :cursoId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("cursoId", cursoId);

    return (List<Disciplina>) query.getResultList();
  }

  /**
   * AOT generated implementation of {@link DisciplinaRepository#findByMonitorId(java.lang.Long)}.
   */
  public List<Disciplina> findByMonitorId(Long monitorId) {
    String queryString = "SELECT d FROM Disciplina d WHERE d.monitor.id = :monitorId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("monitorId", monitorId);

    return (List<Disciplina>) query.getResultList();
  }
}
