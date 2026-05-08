package com.eva.monitorai.dto;

import java.time.LocalDate;

public class RelatorioMonitoriaDTO {

    private Long monitoriaId;

    private LocalDate data;

    private Integer quantidadeAlunos;

    private String conteudoAbordado;

    private String observacoes;

    public RelatorioMonitoriaDTO() {
    }

    public Long getMonitoriaId() {
        return monitoriaId;
    }

    public void setMonitoriaId(Long monitoriaId) {
        this.monitoriaId = monitoriaId;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Integer getQuantidadeAlunos() {
        return quantidadeAlunos;
    }

    public void setQuantidadeAlunos(Integer quantidadeAlunos) {
        this.quantidadeAlunos = quantidadeAlunos;
    }

    public String getConteudoAbordado() {
        return conteudoAbordado;
    }

    public void setConteudoAbordado(String conteudoAbordado) {
        this.conteudoAbordado = conteudoAbordado;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}