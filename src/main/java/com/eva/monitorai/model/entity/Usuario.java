package com.eva.monitorai.model.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

@Entity
@Table(name = "usuarios")
public class Usuario {
	
	@Column(nullable = false)
	private Boolean ativo = true;
	 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    private String senha;

    private String role; // ADMIN, ALUNO ou MONITOR

    @Column(unique = true)
    private String ra; // Todos os alunos e monitores terão preenchido. Admin pode ser null.
    
    // Para redefinição de senha
    @Column(nullable = false)
    private Boolean solicitacaoRedefinicaoSenha = false;
    
    // Data da solicitação (opcional, para ordenação)
    private LocalDateTime dataSolicitacaoSenha;
    
    @JsonIgnore
	@ManyToMany(mappedBy = "curtidas")
	private Set<Material> materiaisCurtidos = new HashSet<>();
    
    @ManyToMany
    @JoinTable(
        name = "usuario_salvos",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "material_id")
    )
    private Set<Material> materiaisSalvos = new HashSet<>();
	
    // Construtores
	
    public Usuario() {
	}

	public Usuario(Long id, String username, String email, String senha, String role, String ra) {
		super();
		this.id = id;
		this.username = username;
		this.email = email;
		this.senha = senha;
		this.role = role;
		this.ra = ra;
	}

	// Getters e Setters
	  public Boolean getAtivo() {
	        return ativo;
	    }
	    
	    public void setAtivo(Boolean ativo) {
	        this.ativo = ativo;
	    }
	
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getRa() {
		return ra;
	}

	public void setRa(String ra) {
		this.ra = ra;
	}
	
	public Set<Material> getMateriaisSalvos() {
	    return materiaisSalvos;
	}

	public void setMateriaisSalvos(Set<Material> materiaisSalvos) {
	    this.materiaisSalvos = materiaisSalvos;
	}
	
	
	public Boolean getSolicitacaoRedefinicaoSenha() {
        return solicitacaoRedefinicaoSenha;
    }
    
    public void setSolicitacaoRedefinicaoSenha(Boolean solicitacaoRedefinicaoSenha) {
        this.solicitacaoRedefinicaoSenha = solicitacaoRedefinicaoSenha;
    }
    
    public LocalDateTime getDataSolicitacaoSenha() {
        return dataSolicitacaoSenha;
    }
    
    public void setDataSolicitacaoSenha(LocalDateTime dataSolicitacaoSenha) {
        this.dataSolicitacaoSenha = dataSolicitacaoSenha;
    }
}
