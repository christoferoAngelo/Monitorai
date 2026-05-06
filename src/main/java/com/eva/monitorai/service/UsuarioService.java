package com.eva.monitorai.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired 
    private BCryptPasswordEncoder encoder;

    public Usuario registrar(Usuario usuario) {

        if (usuario.getUsername() == null || usuario.getUsername().isBlank()) {
            throw new RuntimeException("Nome de usuário é obrigatório");
        }

        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new RuntimeException("Senha é obrigatória");
        }

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new RuntimeException("Email é obrigatório");
        }

        if (repository.findByUsername(usuario.getUsername()).isPresent()) {
            throw new RuntimeException("Nome de usuário já existe");
        }

        if (repository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        // Se quem mandou o JSON não enviou a role, define como Aluno por padrão
        if (usuario.getRole() == null || usuario.getRole().isBlank()) {
            usuario.setRole("ROLE_ALUNO");
        } else {
            // Garante que a role venha com o prefixo correto, caso o front mande só "MONITOR"
            if (!usuario.getRole().startsWith("ROLE_")) {
                usuario.setRole("ROLE_" + usuario.getRole().toUpperCase());
            }
        }

        usuario.setSenha(encoder.encode(usuario.getSenha()));

        return repository.save(usuario);
    }
    

    public Usuario login(String username, String password) {
        Usuario usuario = repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        if (!encoder.matches(password, usuario.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }
        return usuario;
    }
}