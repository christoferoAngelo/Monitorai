package com.eva.monitorai.dto;

import java.util.List;

public class DisciplinaDTO {

    private Long id;

    private String nome;

    private String codigo;

    private List<Long> cursosIds;
    
    private String cursoNome;

    private Long monitorId;
    
    private String monitorNome;

    public DisciplinaDTO() {
    }

    public DisciplinaDTO(
            Long id,
            String nome,
            String codigo,
            List<Long> cursosIds,
            Long monitorId
    ) {
        this.id = id;
        this.nome = nome;
        this.codigo = codigo;
        this.cursosIds = cursosIds;
        this.monitorId = monitorId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public List<Long> getCursosIds() {
        return cursosIds;
    }

    public void setCursosIds(List<Long> cursosIds) {
        this.cursosIds = cursosIds;
    }
    
    public Long getMonitorId() {
        return monitorId;
    }

    public void setMonitorId(Long monitorId) {
        this.monitorId = monitorId;
    }
    
    public String getCursoNome() { return cursoNome; }
    public void setCursoNome(String cursoNome) { this.cursoNome = cursoNome; }
    
    public String getMonitorNome() { return monitorNome; }
    public void setMonitorNome(String monitorNome) { this.monitorNome = monitorNome; }
}

