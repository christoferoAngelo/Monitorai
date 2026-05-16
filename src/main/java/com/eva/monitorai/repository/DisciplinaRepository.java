package com.eva.monitorai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.eva.monitorai.model.entity.Disciplina;

public interface DisciplinaRepository
        extends JpaRepository<Disciplina, Long> {

    boolean existsByCodigo(String codigo);

    @Query("""
    		SELECT d FROM Disciplina d
    		JOIN d.cursos c
    		WHERE c.id = :cursoId
    		""")
    		List<Disciplina> buscarPorCurso(Long cursoId);

    List<Disciplina> findByMonitorId(Long monitorId);
    
    
    
 
}