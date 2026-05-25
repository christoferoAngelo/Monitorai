package com.eva.monitorai.model.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "materiais")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String conteudo; // Pode ser usado pra uma descrição do vídeo/material

    @Column(nullable = false)
    private String url; // Aqui vai o link do YouTube

    @Enumerated(EnumType.STRING)
    private TipoMaterial tipo; // VIDEO, DOCUMENTO, QUIZZ

    // Qual monitor postou isso?
    @ManyToOne
    @JoinColumn(name = "monitor_id")
    private Monitor autor;

    // Para qual disciplina é esse material?
    @ManyToOne
    @JoinColumn(name = "disciplina_id")
    private Disciplina disciplina;

    @ManyToMany
    @JoinTable(
        name = "material_curtidas",
        joinColumns = @JoinColumn(name = "material_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private Set<Usuario> curtidas = new HashSet<>();

    // CONSTRUTORES

    public Material() {
    }

    public Material(Long id, String titulo, String conteudo) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
    }


    // GETTERS E SETTERS

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

    public Set<Usuario> getCurtidas() {
        return curtidas;
    }

    public void setCurtidas(Set<Usuario> curtidas) {
        this.curtidas = curtidas;
    }

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public TipoMaterial getTipo() {
		return tipo;
	}

	public void setTipo(TipoMaterial tipo) {
		this.tipo = tipo;
	}

	public Monitor getAutor() {
		return autor;
	}

	public void setAutor(Monitor autor) {
		this.autor = autor;
	}

	public Disciplina getDisciplina() {
		return disciplina;
	}

	public void setDisciplina(Disciplina disciplina) {
		this.disciplina = disciplina;
	}
    
    
}