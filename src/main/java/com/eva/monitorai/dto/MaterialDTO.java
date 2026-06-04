package com.eva.monitorai.dto;

public class MaterialDTO {

    private Long id;

    private String titulo;
    private String conteudo;
    private String url;
    private String tipo;

    private Integer totalCurtidas;

    public MaterialDTO() {
    }

    public MaterialDTO(
            Long id,
            String titulo,
            String conteudo,
            String url,
            String tipo,
            Integer totalCurtidas
    ) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.url = url;
        this.tipo = tipo;
        this.totalCurtidas = totalCurtidas;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getTotalCurtidas() {
        return totalCurtidas;
    }

    public void setTotalCurtidas(Integer totalCurtidas) {
        this.totalCurtidas = totalCurtidas;
    }
}