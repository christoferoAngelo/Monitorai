package com.eva.monitorai.dto;

import java.util.Set;

import com.eva.monitorai.model.entity.Material;

public class PerfilDTO {

    private String username;
    private String email;
    private String role;
    private String ra;

    private Set<Material> materiaisSalvos;

    public PerfilDTO() {
    }

    public PerfilDTO(String username, String email,
                     String role, String ra,
                     Set<Material> materiaisSalvos) {

        this.username = username;
        this.email = email;
        this.role = role;
        this.ra = ra;
        this.materiaisSalvos = materiaisSalvos;
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
}