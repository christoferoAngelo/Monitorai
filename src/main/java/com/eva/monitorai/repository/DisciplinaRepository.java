package com.eva.monitorai.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.eva.monitorai.model.entity.Disciplina;

public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {

    boolean existsByCodigo(String codigo);

    @Query("""
           SELECT DISTINCT d FROM Disciplina d
           JOIN FETCH d.cursos c
           LEFT JOIN FETCH d.monitor
           WHERE c.id = :cursoId
           """)
    List<Disciplina> buscarPorCurso(@Param("cursoId") Long cursoId);

    List<Disciplina> findByMonitorId(Long monitorId);
}