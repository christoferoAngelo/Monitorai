package com.eva.monitorai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eva.monitorai.model.entity.Comentario;

public interface ComentarioRepository extends JpaRepository<Comentario, Long>{

    List<Comentario> findByMaterialId(Long materialId);
}