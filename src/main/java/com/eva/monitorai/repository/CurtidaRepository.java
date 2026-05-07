package com.eva.monitorai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eva.monitorai.model.entity.Curtida;
import com.eva.monitorai.model.entity.Material;
import com.eva.monitorai.model.entity.Usuario;

public interface CurtidaRepository extends JpaRepository<Curtida, Long> {

    // verifica se já curtiu
    boolean existsByUsuarioAndMaterial(Usuario usuario, Material material);

    // busca curtida específica
    Optional<Curtida> findByUsuarioAndMaterial(Usuario usuario, Material material);

    // quantidade de curtidas
    long countByMaterial(Material material);
}