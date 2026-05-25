package com.eva.monitorai.model.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "atuacoes_monitoria")
public class AtuacaoMonitoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "monitoria_id")
    private Monitoria monitoria;

    @ManyToOne
    @JoinColumn(name = "monitor_id")
    private Monitor monitor;

    private LocalDate dataInicio;

    private LocalDate dataFim;  // null = ainda tá ativo

    private boolean ativa = true;

    public AtuacaoMonitoria() {
    }

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Monitoria getMonitoria() { return monitoria; }
    public void setMonitoria(Monitoria monitoria) { this.monitoria = monitoria; }

    public Monitor getMonitor() { return monitor; }
    public void setMonitor(Monitor monitor) { this.monitor = monitor; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }

    public boolean isAtiva() { return ativa; }
    public void setAtiva(boolean ativa) { this.ativa = ativa; }
}