package com.eva.monitorai.model.entity;

import jakarta.persistence.*;

@Entity
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    
    @Column(unique = true, nullable = false)  
    private String codigo;  // código será gerado automaticamente

    // =====================================
    // RELACIONAMENTO COM CURSO
    // =====================================

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso;

    // =====================================
    // RELACIONAMENTO COM MONITOR
    // =====================================

    @ManyToOne
    @JoinColumn(name = "monitor_id")
    private Usuario monitor;

    
    // CONSTRUTORES
    public Disciplina() {
    }
    
    
   
    public Disciplina(Long id, String nome, String codigo) {
        this.id = id;
        this.nome = nome;
        this.codigo = codigo;
    }
    
    
 // =====================================
    // MÉTODO QUE GERA O CÓDIGO AUTOMATICAMENTE
    // =====================================
    
    @PrePersist  // Esta anotação faz o método rodar ANTES de salvar no banco
    public void gerarCodigo() {
        // Se o código estiver vazio ou nulo, gera um novo
        if (this.codigo == null || this.codigo.isEmpty()) {
            // Gera código no formato: DISC + timestamp atual em milissegundos
            // Exemplo: DISC20260509143022 (DISC + data/hora)
            this.codigo = "DISC" + System.currentTimeMillis();
        }
    }
    
    // GETTER E SETTER

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

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }

    public Usuario getMonitor() {
        return monitor;
    }

    public void setMonitor(Usuario monitor) {
        this.monitor = monitor;
    }
}