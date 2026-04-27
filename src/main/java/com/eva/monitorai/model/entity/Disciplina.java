package com.eva.monitorai.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

//Disciplina é igual matéria (Banco de dados, Programação Linear, ETC)

@Entity
public class Disciplina {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String codigo; // Ex: MAT101
    
	public Disciplina() {

	}
	
	public Disciplina(Long id, String nome, String codigo) {
		super();
		this.id = id;
		this.nome = nome;
		this.codigo = codigo;
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
    
    
    
}