package com.eva.monitorai.repository;

import com.eva.monitorai.model.entity.Curtida;
import com.eva.monitorai.model.entity.Material;
import com.eva.monitorai.model.entity.Usuario;
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
 * AOT generated JPA repository implementation for {@link CurtidaRepository}.
 */
@Generated
public class CurtidaRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public CurtidaRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link CurtidaRepository#countByMaterial(com.eva.monitorai.model.entity.Material)}.
   */
  public long countByMaterial(Material material) {
    String queryString = "SELECT COUNT(c) FROM Curtida c WHERE c.material = :material";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("material", material);

    return (Long) convertOne(query.getSingleResultOrNull(), false, Long.class);
  }

  /**
   * AOT generated implementation of {@link CurtidaRepository#existsByUsuarioAndMaterial(com.eva.monitorai.model.entity.Usuario,com.eva.monitorai.model.entity.Material)}.
   */
  public boolean existsByUsuarioAndMaterial(Usuario usuario, Material material) {
    String queryString = "SELECT c.id FROM Curtida c WHERE c.usuario = :usuario AND c.material = :material";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("usuario", usuario);
    query.setParameter("material", material);
    query.setMaxResults(1);

    return !query.getResultList().isEmpty();
  }

  /**
   * AOT generated implementation of {@link CurtidaRepository#findByUsuarioAndMaterial(com.eva.monitorai.model.entity.Usuario,com.eva.monitorai.model.entity.Material)}.
   */
  public Optional<Curtida> findByUsuarioAndMaterial(Usuario usuario, Material material) {
    String queryString = "SELECT c FROM Curtida c WHERE c.usuario = :usuario AND c.material = :material";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("usuario", usuario);
    query.setParameter("material", material);

    return Optional.ofNullable((Curtida) convertOne(query.getSingleResultOrNull(), false, Curtida.class));
  }
}
