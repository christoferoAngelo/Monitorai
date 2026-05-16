package com.eva.monitorai.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eva.monitorai.model.entity.Curso;

/**
 * Repository responsável pela abstração e acesso aos dados da entidade Curso.
 */
public interface CursoRepository extends JpaRepository<Curso, Long> {
    
    List<Curso> findByNomeContainingIgnoreCase(String nome);
    
    @Query("SELECT c FROM Curso c LEFT JOIN FETCH c.disciplinas WHERE c.id = :id")
    Optional<Curso> findByIdComDisciplinas(@Param("id") Long id);

    // Verifica se já existe um curso com esse código (usado na geração automática)
    boolean existsByCodigo(String codigo);

    // Busca um curso pelo código
    Optional<Curso> findByCodigo(String codigo);

    // Verifica se já existe um curso com esse nome
    boolean existsByNome(String nome);
}