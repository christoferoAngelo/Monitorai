package com.eva.monitorai.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eva.monitorai.model.entity.AtuacaoMonitoria;

public interface AtuacaoMonitoriaRepository extends JpaRepository<AtuacaoMonitoria, Long> {

    List<AtuacaoMonitoria> findByMonitoriaId(Long monitoriaId);
    
    List<AtuacaoMonitoria> findByMonitorId(Long monitorId);
    
    Optional<AtuacaoMonitoria> findByMonitoriaIdAndAtivaTrue(Long monitoriaId);
    
    Optional<AtuacaoMonitoria> findByMonitorIdAndAtivaTrue(Long monitorId);
    
    @Query("SELECT a FROM AtuacaoMonitoria a " +
    	       "LEFT JOIN FETCH a.monitoria m " +
    	       "LEFT JOIN FETCH m.disciplina d " +
    	       "LEFT JOIN FETCH a.monitor mon " +
    	       "LEFT JOIN FETCH mon.usuario u " +
    	       "WHERE a.ativa = false " +  // Somente finalizadas
    	       "ORDER BY a.dataFim DESC")
    	List<AtuacaoMonitoria> buscarHistorico(
    	    @Param("monitorId") Long monitorId,
    	    @Param("disciplinaId") Long disciplinaId,
    	    @Param("anoSemestre") String anoSemestre
    	);
}