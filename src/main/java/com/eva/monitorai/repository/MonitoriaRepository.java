package com.eva.monitorai.repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.eva.monitorai.model.entity.Monitoria;

public interface MonitoriaRepository extends JpaRepository<Monitoria, Long> {

    List<Monitoria> findByMonitorId(Long monitorId);
    List<Monitoria> findByAtivaTrue();
    List<Monitoria> findByDisciplinaId(Long disciplinaId);
    Optional<Monitoria> findByDisciplinaIdAndAtivaTrue(Long disciplinaId);

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
           "AND m.ativa = true AND m.id <> :idAtual " +
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

    // NOVA: Verificar se já existe monitoria ativa para a mesma disciplina
    @Query("SELECT m FROM Monitoria m WHERE m.disciplina.id = :disciplinaId AND m.ativa = true")
    List<Monitoria> buscarMonitoriaAtivaDaDisciplina(@Param("disciplinaId") Long disciplinaId);

    @Query("SELECT m FROM Monitoria m " +
           "LEFT JOIN FETCH m.disciplina " +
           "LEFT JOIN FETCH m.disciplina.cursos " +
           "LEFT JOIN FETCH m.monitor " +
           "LEFT JOIN FETCH m.monitor.usuario")
    List<Monitoria> buscarTodasComRelacionamentos();
}