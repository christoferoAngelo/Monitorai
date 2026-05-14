package com.eva.monitorai.repository;

import com.eva.monitorai.model.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    // Busca todos os materiais postados por um Monitor específico usando o ID dele
    List<Material> findByAutorId(Long monitorId);
}