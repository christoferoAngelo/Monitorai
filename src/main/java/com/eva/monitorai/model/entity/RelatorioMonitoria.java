package com.eva.monitorai.model.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "relatorios_monitoria")
public class RelatorioMonitoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relaciona relatório à monitoria
    @ManyToOne
    @JoinColumn(name = "monitoria_id")
    private Monitoria monitoria;

    private LocalDate data;

    private Integer quantidadeAlunos;

    @Column(length = 1000)
    private String conteudoAbordado;

    @Column(length = 1000)
    private String observacoes;

    public RelatorioMonitoria() {
    }

    public RelatorioMonitoria(Long id, Monitoria monitoria, LocalDate data,
                              Integer quantidadeAlunos,
                              String conteudoAbordado,
                              String observacoes) {
        this.id = id;
        this.monitoria = monitoria;
        this.data = data;
        this.quantidadeAlunos = quantidadeAlunos;
        this.conteudoAbordado = conteudoAbordado;
        this.observacoes = observacoes;
    }

    public Long getId() {
        return id;
    }

    public Monitoria getMonitoria() {
        return monitoria;
    }

    public void setMonitoria(Monitoria monitoria) {
        this.monitoria = monitoria;
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