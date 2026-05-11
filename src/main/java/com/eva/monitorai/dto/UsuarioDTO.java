package com.eva.monitorai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UsuarioDTO {
	
	private Long id;
    
    @NotBlank(message = "Usuário é obrigatório")
    @Size(min = 3, max = 20, message = "O usuário deve ter entre 3 e 20 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "O usuário deve ser uma palavra só e sem caracteres especiais")
    private String username;
    
    @NotBlank(message = "E-mail é obrigatório")
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@(aluno\\.cps\\.sp\\.gov\\.br|fatec\\.sp\\.gov\\.br)$",
        message = "O e-mail deve ser institucional (@aluno.cps.sp.gov.br ou @fatec.sp.gov.br)"
    )
    private String email;

    // WRITE_ONLY impede que a senha seja enviada de volta nas respostas JSON da API
    @JsonProperty(access = Access.WRITE_ONLY)
    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
    private String senha;

    private String role;

    @NotBlank(message = "O RA é obrigatório")
    @Pattern(regexp = "^\\d{13}$", message = "O RA deve conter exatamente 13 dígitos numéricos")
    private String ra;

    // Construtor vazio padrão
    public UsuarioDTO() {
    }

    // Construtor com campos (incluindo a senha se necessário)
    public UsuarioDTO(Long id, String username, String email, String senha, String role, String ra) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.senha = senha;
        this.role = role;
        this.ra = ra;
    }

    // Getters e Setters
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
}