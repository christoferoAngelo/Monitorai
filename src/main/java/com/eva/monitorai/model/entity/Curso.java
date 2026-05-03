package com.eva.monitorai.model.entity;

import jakarta.persistence.*;
import java.util.List;

// Import necessário para evitar loop infinito no JSON
import com.fasterxml.jackson.annotation.JsonIgnore;

// Curso (ADS, Engenharia, etc)
@Entity
public class Curso {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String codigo; // Ex: ADS001

    // Um curso tem várias disciplinas
    @OneToMany(mappedBy = "curso")
    @JsonIgnore // impede loop infinito na resposta da API
    private List<Disciplina> disciplinas;

    public Curso() {}

    public Curso(Long id, String nome, String codigo) {
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

    public List<Disciplina> getDisciplinas() {
        return disciplinas;
    }

    public void setDisciplinas(List<Disciplina> disciplinas) {
        this.disciplinas = disciplinas;
    }
}
