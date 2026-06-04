package com.eva.monitorai.dto;

import java.util.List;

public class PerfilDTO {

    private String username;
    private String email;
    private String role;
    private String ra;

    private List<MaterialDTO> materiaisSalvos;

    public PerfilDTO() {
    }

    public PerfilDTO(
            String username,
            String email,
            String role,
            String ra,
            List<MaterialDTO> materiaisSalvos
    ) {
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

    public List<MaterialDTO> getMateriaisSalvos() {
        return materiaisSalvos;
    }

    public void setMateriaisSalvos(List<MaterialDTO> materiaisSalvos) {
        this.materiaisSalvos = materiaisSalvos;
    }
}