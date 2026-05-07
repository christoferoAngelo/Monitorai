package com.eva.monitorai.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "curtidas")
public class Curtida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // usuário que curtiu
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // material curtido
    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;

    // getters e setters

    public Long getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }
}