package com.eva.monitorai.controller;

import java.util.Map;

/*=============================================================================================
 * 
 * 
 * 			ESSA CLASSE É O CONTROLLER DAS AUTENTICAÇÕES DE USUÁRIO
 * 			/REGISTER PARA CRIAR CONTA -> RECEBE UM USUARIO JSON
 * 			/LOGIN -> RECEBE UM JSON COM USERNAME E SENHA
 * 			
 * 
 * 
 * ========================================================================================== */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.UsuarioRepository;
import com.eva.monitorai.security.JwtUtil;
import com.eva.monitorai.security.UserDetailsImpl;
import com.eva.monitorai.security.UserDetailsServiceImpl;
import com.eva.monitorai.service.UsuarioService;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UsuarioService service;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil1;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    

    @Autowired
    private PasswordEncoder passwordEncoder; // Injeção do encoder (BCrypt)
    

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        // 1. Validação de existência
        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            return ResponseEntity.badRequest().body("Erro: Usuário já existe!");
        }

        // 2. Validação do tamanho do RA
        if (usuario.getRa() == null || usuario.getRa().length() != 13) {
            return ResponseEntity.badRequest().body("Erro: O RA deve conter exatamente 13 dígitos.");
        }

        // 3. Encriptar senha
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        
        if (usuario.getRole() == null) {
            usuario.setRole("ALUNO");
        }

        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuário registrado com sucesso! RA: " + usuario.getRa());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginRequest) {
        try {
            // 1. Valida se o usuário e senha batem
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getSenha())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ou senha inválidos");
        }

        // 2. Se deu certo, busca o UserDetails e gera o token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        final String token = jwtUtil1.gerarToken(userDetails);

        // 3. Retorna o token em um JSON
        return ResponseEntity.ok(new TokenResponseDTO(token));
    }
    
    // DTO para a resposta
    class TokenResponseDTO {
        private String token;
        public TokenResponseDTO(String token) { this.token = token; }
        public String getToken() { return token; }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Se o seu principal for o UserDetailsImpl que criamos:
        if (auth.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            Usuario usuario = userDetails.getUsuario();
            
            // Retornamos um Map para garantir que o JSON tenha os nomes certos
            return ResponseEntity.ok(Map.of(
                "username", usuario.getUsername(),
                "role", usuario.getRole(),
                "email", usuario.getEmail()
            ));
        }

        return ResponseEntity.ok(auth.getPrincipal());
    }
}