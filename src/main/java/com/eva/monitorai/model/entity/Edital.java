package com.eva.monitorai.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "editais")
public class Edital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descricao;
    private String tipo; // "VAGAS" ou "RESULTADO"
    
    // Campos comuns
    private String numeroEdital;
    private LocalDateTime dataPublicacao;
    private String status; // "ATIVO" ou "ENCERRADO"
    
    // Para VAGAS - período de inscrições
    private String periodoInicio;
    private String periodoFim;
    
    // Para RESULTADO - arquivo PDF
    @Column(columnDefinition = "TEXT")
    private String conteudoPdf; 
    private String urlPdf;
    private String nomeArquivo;
    private String tipoArquivo;
    private Long tamanhoArquivo;
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
    public String getNumeroEdital() { return numeroEdital; }
    public void setNumeroEdital(String numeroEdital) { this.numeroEdital = numeroEdital; }
    
    public LocalDateTime getDataPublicacao() { return dataPublicacao; }
    public void setDataPublicacao(LocalDateTime dataPublicacao) { this.dataPublicacao = dataPublicacao; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPeriodoInicio() { return periodoInicio; }
    public void setPeriodoInicio(String periodoInicio) { this.periodoInicio = periodoInicio; }
    
    public String getPeriodoFim() { return periodoFim; }
    public void setPeriodoFim(String periodoFim) { this.periodoFim = periodoFim; }
    
    public String getConteudoPdf() { return conteudoPdf; }
    public void setConteudoPdf(String conteudoPdf) { this.conteudoPdf = conteudoPdf; }
    
    public String getNomeArquivo() { return nomeArquivo; }
    public void setNomeArquivo(String nomeArquivo) { this.nomeArquivo = nomeArquivo; }
    
    public String getTipoArquivo() { return tipoArquivo; }
    public void setTipoArquivo(String tipoArquivo) { this.tipoArquivo = tipoArquivo; }
    
    public Long getTamanhoArquivo() { return tamanhoArquivo; }
    public void setTamanhoArquivo(Long tamanhoArquivo) { this.tamanhoArquivo = tamanhoArquivo; }
    
    public String getUrlPdf() { return urlPdf; }
    public void setUrlPdf(String urlPdf) { this.urlPdf = urlPdf; }
}