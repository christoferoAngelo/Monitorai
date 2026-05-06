package com.eva.monitorai.security;


import java.util.Collection;
import java.util.List;

import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.eva.monitorai.model.entity.Usuario;


/*=============================================================================================
 * 
 * 
 * 			ESSA CLASSE PRECISA EXISTIR PRA DAR OVERRIDE EM MÉTODOS 
 * 			PRÉ CONFIGURADOS DO SPRING SECURITY QUE NÓS NÃO UTILIZAMOS
 * 			NESSE PROJETO
 * 
 * 
 * ========================================================================================== */


public class UserDetailsImpl implements UserDetails {

    private Usuario usuario;

    public UserDetailsImpl(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleAtribuida = usuario.getRole();
        
        // Se por acaso vier nulo, evita erro
        if (roleAtribuida == null) roleAtribuida = "ALUNO";

        // Se a role já começar com ROLE_, não duplica
        if (roleAtribuida.startsWith("ROLE_")) {
            return List.of(new SimpleGrantedAuthority(roleAtribuida));
        }
        
        return List.of(new SimpleGrantedAuthority("ROLE_" + roleAtribuida));
    }

    @Override
    public String getPassword() {
        return usuario.getSenha();
    }

    @Override
    public String getUsername() {
        return usuario.getUsername();
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public boolean isAccountNonExpired() { return true; }
    public boolean isAccountNonLocked() { return true; }
    public boolean isCredentialsNonExpired() { return true; }
    public boolean isEnabled() { return true; }

}
