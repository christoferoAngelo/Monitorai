package com.eva.monitorai.repository;

import com.eva.monitorai.model.entity.Curso;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.lang.String;
import java.util.Optional;
import org.springframework.aot.generate.Generated;
import org.springframework.data.jpa.repository.aot.AotRepositoryFragmentSupport;
import org.springframework.data.jpa.repository.query.QueryEnhancerSelector;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;

/**
 * AOT generated JPA repository implementation for {@link CursoRepository}.
 */
@Generated
public class CursoRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public CursoRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link CursoRepository#existsByCodigo(java.lang.String)}.
   */
  public boolean existsByCodigo(String codigo) {
    String queryString = "SELECT c.id FROM Curso c WHERE c.codigo = :codigo";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("codigo", codigo);
    query.setMaxResults(1);

    return !query.getResultList().isEmpty();
  }

  /**
   * AOT generated implementation of {@link CursoRepository#existsByNome(java.lang.String)}.
   */
  public boolean existsByNome(String nome) {
    String queryString = "SELECT c.id FROM Curso c WHERE c.nome = :nome";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("nome", nome);
    query.setMaxResults(1);

    return !query.getResultList().isEmpty();
  }

  /**
   * AOT generated implementation of {@link CursoRepository#findByCodigo(java.lang.String)}.
   */
  public Optional<Curso> findByCodigo(String codigo) {
    String queryString = "SELECT c FROM Curso c WHERE c.codigo = :codigo";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("codigo", codigo);

    return Optional.ofNullable((Curso) convertOne(query.getSingleResultOrNull(), false, Curso.class));
  }
}
