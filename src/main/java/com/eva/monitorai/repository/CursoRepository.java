package com.eva.monitorai.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.eva.monitorai.model.entity.Curso;


// Repository - Acesso ao banco
public interface CursoRepository extends JpaRepository<Curso, Long> {
	
	List<Curso> findByNomeContainingIgnoreCase(String nome);

    // Verifica se já existe um curso com esse código (usado na geração automática)
    boolean existsByCodigo(String codigo);

    // Busca um curso pelo código
    Optional<Curso> findByCodigo(String codigo);

    // Verifica se já existe um curso com esse nome
    boolean existsByNome(String nome);
    
   

}
