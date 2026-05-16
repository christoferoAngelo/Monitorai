package com.eva.monitorai.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.eva.monitorai.model.entity.Disciplina;

/**
 * Repositório de dados para a entidade Disciplina.
 * Contém consultas customizadas para otimização de relacionamentos Muitos-para-Muitos.
 */
public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {

    /**
     * Verifica a existência de uma disciplina pelo seu código único.
     */
    boolean existsByCodigo(String codigo);

    /**
     * Busca todas as disciplinas vinculadas a um determinado Curso.
     * Utiliza 'JOIN FETCH' para carregar preventivamente a coleção de cursos e o monitor,
     * evitando múltiplas consultas (N+1) e erros de LazyInitializationException no Service/DTO.
     */
    @Query("""
           SELECT DISTINCT d FROM Disciplina d
           JOIN FETCH d.cursos c
           LEFT JOIN FETCH d.monitor
           WHERE c.id = :cursoId
           """)
    List<Disciplina> buscarPorCurso(@Param("cursoId") Long cursoId);

    /**
     * Lista todas as disciplinas que estão sob a responsabilidade de um monitor específico.
     */
    List<Disciplina> findByMonitorId(Long monitorId);
}