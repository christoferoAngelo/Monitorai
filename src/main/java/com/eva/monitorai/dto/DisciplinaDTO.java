package com.eva.monitorai.dto;

public class DisciplinaDTO {

    private Long id;

    private String nome;

    private String codigo;

    private Long cursoId;
    
    private String cursoNome;

    private Long monitorId;
    
    private String monitorNome;

    public DisciplinaDTO() {
    }

    public DisciplinaDTO(
            Long id,
            String nome,
            String codigo,
            Long cursoId,
            Long monitorId
    ) {
        this.id = id;
        this.nome = nome;
        this.codigo = codigo;
        this.cursoId = cursoId;
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

    public Long getCursoId() {
        return cursoId;
    }

    public void setCursoId(Long cursoId) {
        this.cursoId = cursoId;
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

