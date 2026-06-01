package com.eva.monitorai.model.entity;

import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "monitorias")
public class Monitoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Monitor responsável
    @ManyToOne
    @JoinColumn(name = "monitor_id")
    private Monitor monitor;

    // Disciplina da monitoria
    @ManyToOne
    @JoinColumn(name = "disciplina_id")
    private Disciplina disciplina;

    private String diaSemana;

    private LocalTime horarioInicio;

    private LocalTime horarioFim;

    private String sala;

    private String semestreReferencia;

    private boolean ativa = true;
    

    @Transient // Indica que este método não é uma coluna do banco
    public List<String> getCursosNomes() {
        if (this.disciplina != null && this.disciplina.getCursos() != null) {
            return this.disciplina.getCursos().stream()
                    .map(curso -> curso.getNome()) // Altere para getNome() se for o atributo da sua classe Curso
                    .collect(java.util.stream.Collectors.toList());
        }
        return java.util.Collections.emptyList();
    }

    public Monitoria() {
    }

    public Monitoria(Long id, Monitor monitor, Disciplina disciplina, String diaSemana,
                      LocalTime horarioInicio, LocalTime horarioFim,
                      String sala, String semestreReferencia, boolean ativa) {
        this.id = id;
        this.monitor = monitor;
        this.disciplina = disciplina;
        this.diaSemana = diaSemana;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
        this.sala = sala;
        this.semestreReferencia = semestreReferencia;
        this.ativa = ativa;
    }

    public Long getId() {
        return id;
    }

    public Monitor getMonitor() {
        return monitor;
    }

    public void setMonitor(Monitor monitor) {
        this.monitor = monitor;
    }

    public Disciplina getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(Disciplina disciplina) {
        this.disciplina = disciplina;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalTime getHorarioInicio() {
        return horarioInicio;
    }

    public void setHorarioInicio(LocalTime horarioInicio) {
        this.horarioInicio = horarioInicio;
    }

    public LocalTime getHorarioFim() {
        return horarioFim;
    }

    public void setHorarioFim(LocalTime horarioFim) {
        this.horarioFim = horarioFim;
    }

    public String getSala() {
        return sala;
    }

    public void setSala(String sala) {
        this.sala = sala;
    }

    public String getSemestreReferencia() {
        return semestreReferencia;
    }

    public void setSemestreReferencia(String semestreReferencia) {
        this.semestreReferencia = semestreReferencia;
    }

    public boolean isAtiva() {
        return ativa;
    }

    public void setAtiva(boolean ativa) {
        this.ativa = ativa;
    }
}