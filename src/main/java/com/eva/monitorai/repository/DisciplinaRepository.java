package com.eva.monitorai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eva.monitorai.model.entity.Disciplina;

public interface DisciplinaRepository
        extends JpaRepository<Disciplina, Long> {

    boolean existsByCodigo(String codigo);

    List<Disciplina> findByCursoId(Long cursoId);

    List<Disciplina> findByMonitorId(Long monitorId);
    
 
}