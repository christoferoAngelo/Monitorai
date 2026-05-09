package com.eva.monitorai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eva.monitorai.model.entity.Monitoria;

public interface MonitoriaRepository extends JpaRepository<Monitoria, Long> {

    // Buscar monitorias por monitor
    List<Monitoria> findByMonitorId(Long monitorId);

    // Buscar monitorias ativas
    List<Monitoria> findByAtivaTrue();

    // Buscar por disciplina
    List<Monitoria> findByDisciplinaId(Long disciplinaId);
}