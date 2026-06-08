package com.eva.monitorai.dto;

import java.time.LocalDateTime;

public class ComentarioResponseDTO {

    private Long id;
    private String texto;
    private String username;
    private LocalDateTime dataCriacao;

    public ComentarioResponseDTO(Long id, String texto, String username, LocalDateTime dataCriacao) {
        this.id = id;
        this.texto = texto;
        this.username = username;
        this.dataCriacao = dataCriacao;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTexto() {
		return texto;
	}

	public void setTexto(String texto) {
		this.texto = texto;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public LocalDateTime getDataCriacao() {
		return dataCriacao;
	}

	public void setDataCriacao(LocalDateTime dataCriacao) {
		this.dataCriacao = dataCriacao;
	}

    
}