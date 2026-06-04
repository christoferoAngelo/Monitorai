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

    	 // 1. Define role padrão se não vier
        if (usuario.getRole() == null || usuario.getRole().isBlank()) {
            usuario.setRole("ALUNO");
        }
        
        // ==========================================
        // 2. LÓGICA CONDICIONAL DO RA - ADICIONAR AQUI
        // ==========================================
        if ("ALUNO".equals(usuario.getRole())) {
            // Para ALUNO: RA é obrigatório
            if (usuario.getRa() == null || usuario.getRa().isBlank()) {
                throw new RuntimeException("RA é obrigatório para alunos");
            }
            if (!usuario.getRa().matches("^\\d{13}$")) {
                throw new RuntimeException("O RA deve ter 13 dígitos");
            }
            // Verifica se RA já existe
            if (repository.findByRa(usuario.getRa()).isPresent()) {
                throw new RuntimeException("RA já cadastrado");
            }
        } else {
            // Para ADMIN/MONITOR: RA deve ser null
            usuario.setRa(null);
        }
        // ==========================================
    	
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