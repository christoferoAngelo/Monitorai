package com.eva.monitorai.model.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidade que representa uma Disciplina no sistema.
 * Uma disciplina pode estar vinculada a múltiplos cursos e possuir um monitor responsável.
 */
@Entity
@Table(name = "disciplinas")
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String codigo; // Gerado automaticamente via ciclo de vida do JPA (@PrePersist)

    // =========================================================================
    // RELACIONAMENTOS
    // =========================================================================

    /**
     * Relacionamento Muitos-para-Muitos com a entidade Curso.
     * Mapeado pelo atributo "disciplinas" presente na classe Curso (lado inverso da relação).
     * Utilizamos Set em vez de List para evitar duplicidade de registros na tabela de junção.
     */
    @ManyToMany(mappedBy = "disciplinas")
    private Set<Curso> cursos = new HashSet<>();

    /**
     * Relacionamento Muitos-para-Um com a entidade Usuario.
     * Indica o monitor atual associado a esta disciplina.
     */
    @ManyToOne
    @JoinColumn(name = "monitor_id")
    private Usuario monitor;

    // =========================================================================
    // CONSTRUTORES
    // =========================================================================

    /**
     * Construtor padrão exigido pelo JPA/Hibernate.
     */
    public Disciplina() {
    }

    /**
     * Construtor completo para inicialização manual de dados.
     */
    public Disciplina(Long id, String nome, String codigo) {
        this.id = id;
        this.nome = nome;
        this.codigo = codigo;
    }

    // =========================================================================
    // GATILHOS DE CICLO DE VIDA (JPA LIFECYCLE HOOKS)
    // =========================================================================

    /**
     * Método executado de forma automática imediatamente antes do registro ser inserido no banco de dados.
     * Garante que toda disciplina possua um código identificador único baseado em timestamp se não fornecido.
     */
    @PrePersist
    public void geradorCodigoAutomatico() {
        if (this.codigo == null || this.codigo.trim().isEmpty()) {
            this.codigo = "DISC" + System.currentTimeMillis();
        }
    }

    // =========================================================================
    // MÉTODOS AUXILIARES (HELPER METHODS)
    // =========================================================================

    /**
     * Sincroniza a associação bidirecional entre Disciplina e Curso.
     */
    public void adicionarCurso(Curso curso) {
        this.cursos.add(curso);
        curso.getDisciplinas().add(this);
    }

    /**
     * Sincroniza a desassociação bidirecional entre Disciplina e Curso.
     */
    public void removerCurso(Curso curso) {
        this.cursos.remove(curso);
        curso.getDisciplinas().remove(this);
    }

    // =========================================================================
    // GETTERS E SETTERS
    // =========================================================================

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

    public Set<Curso> getCursos() {
        return cursos;
    }

    public void setCursos(Set<Curso> cursos) {
        this.cursos = cursos;
    }

    public Usuario getMonitor() {
        return monitor;
    }

    public void setMonitor(Usuario monitor) {
        this.monitor = monitor;
    }
}