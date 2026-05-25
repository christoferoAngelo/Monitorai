package com.eva.monitorai.dto;

import java.time.LocalDateTime;

public class MonitoriaAtuacaoDTO {

    private Long id;
    private Long monitoriaId;
    private Long monitorId;
    private String monitorNome;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private Boolean ativa;

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getMonitoriaId() { return monitoriaId; }
    public void setMonitoriaId(Long monitoriaId) { this.monitoriaId = monitoriaId; }
    
    public Long getMonitorId() { return monitorId; }
    public void setMonitorId(Long monitorId) { this.monitorId = monitorId; }
    
    public String getMonitorNome() { return monitorNome; }
    public void setMonitorNome(String monitorNome) { this.monitorNome = monitorNome; }
    
    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }
    
    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }
    
    public Boolean getAtiva() { return ativa; }
    public void setAtiva(Boolean ativa) { this.ativa = ativa; }
}