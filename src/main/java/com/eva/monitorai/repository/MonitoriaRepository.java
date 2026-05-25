package com.eva.monitorai.repository;

import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eva.monitorai.model.entity.Monitoria;

public interface MonitoriaRepository extends JpaRepository<Monitoria, Long> {

    // Buscar monitorias por monitor
    List<Monitoria> findByMonitorId(Long monitorId);

    
    // Buscar monitorias ativas
    List<Monitoria> findByAtivaTrue();

    // Buscar por disciplina
    List<Monitoria> findByDisciplinaId(Long disciplinaId);
    
    @Query("SELECT m FROM Monitoria m WHERE m.sala = :sala AND m.diaSemana = :diaSemana " +
    	       "AND m.ativa = true " +
    	       "AND ((:inicio >= m.horarioInicio AND :inicio < m.horarioFim) " +
    	       "OR (:fim > m.horarioInicio AND :fim <= m.horarioFim) " +
    	       "OR (m.horarioInicio >= :inicio AND m.horarioInicio < :fim))")
    	List<Monitoria> buscarConflitosDeSala(
    	    @Param("sala") String sala, 
    	    @Param("diaSemana") String diaSemana, 
    	    @Param("inicio") LocalTime inicio, 
    	    @Param("fim") LocalTime fim
    	);
    
    @Query("SELECT m FROM Monitoria m WHERE m.sala = :sala AND m.diaSemana = :diaSemana " +
    	       "AND m.ativa = true AND m.id <> :idAtual " + // <--- Ignora a própria monitoria
    	       "AND ((:inicio >= m.horarioInicio AND :inicio < m.horarioFim) " +
    	       "OR (:fim > m.horarioInicio AND :fim <= m.horarioFim) " +
    	       "OR (m.horarioInicio >= :inicio AND m.horarioInicio < :fim))")
    	List<Monitoria> buscarConflitosDeSalaExcetoId(
    	    @Param("sala") String sala, 
    	    @Param("diaSemana") String diaSemana, 
    	    @Param("inicio") LocalTime inicio, 
    	    @Param("fim") LocalTime fim,
    	    @Param("idAtual") Long idAtual
    	);
    
    @Query("SELECT m FROM Monitoria m " +
    	       "LEFT JOIN FETCH m.disciplina " +
    	       "LEFT JOIN FETCH m.disciplina.cursos " +
    	       "LEFT JOIN FETCH m.monitor " +
    	       "LEFT JOIN FETCH m.monitor.usuario")
    	List<Monitoria> buscarTodasComRelacionamentos();
    
    
}