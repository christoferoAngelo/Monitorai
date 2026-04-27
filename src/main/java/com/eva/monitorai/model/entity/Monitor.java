package com.eva.monitorai.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "monitores")
public class Monitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relaciona o Monitor ao Usuário (que já tem o RA, Nome, Email)
    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // A matéria que ele monitora
    @ManyToOne
    @JoinColumn(name = "disciplina_id")
    private Disciplina disciplina;

    private String horariosDisponiveis; // Pode ser um campo simples ou uma lista de objetos
    private String local; //local da monitoria física
    private boolean ativo = true; 
    private String bio; //bio ou descrição q o monitor cria pra sí mesmo quando cria a conta pra falar um pouco do q ele sabe e tudo mais
    private Float nota; //média da nota que os alunos dão pra ele 
    
    
    
    public Monitor() {
	}
    
    
    
	public Monitor(Long id, Usuario usuario, Disciplina disciplina, String horariosDisponiveis, String local,
			boolean ativo, String bio, Float nota) {
		super();
		this.id = id;
		this.usuario = usuario;
		this.disciplina = disciplina;
		this.horariosDisponiveis = horariosDisponiveis;
		this.local = local;
		this.ativo = ativo;
		this.bio = bio;
		this.nota = nota;
	}



	// Getters e Setters
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Usuario getUsuario() {
		return usuario;
	}
	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}
	public Disciplina getDisciplina() {
		return disciplina;
	}
	public void setDisciplina(Disciplina disciplina) {
		this.disciplina = disciplina;
	}
	public String getHorariosDisponiveis() {
		return horariosDisponiveis;
	}
	public void setHorariosDisponiveis(String horariosDisponiveis) {
		this.horariosDisponiveis = horariosDisponiveis;
	}
	public String getLocal() {
		return local;
	}
	public void setLocal(String local) {
		this.local = local;
	}
	public boolean isAtivo() {
		return ativo;
	}
	public void setAtivo(boolean ativo) {
		this.ativo = ativo;
	}
	public String getBio() {
		return bio;
	}
	public void setBio(String bio) {
		this.bio = bio;
	}
	public Float getNota() {
		return nota;
	}
	public void setNota(Float nota) {
		this.nota = nota;
	}
    
    
    
}
