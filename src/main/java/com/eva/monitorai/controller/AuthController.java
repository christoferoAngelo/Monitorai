package com.eva.monitorai.controller;

import java.util.Map;
import java.util.Optional;

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
        
        // 1. Define role padrão
        if (usuario.getRole() == null || usuario.getRole().isBlank()) {
            usuario.setRole("ALUNO");
        }
        
        // 2. Verificar se ALUNO - RA é obrigatório
        if ("ALUNO".equals(usuario.getRole())) {
            if (usuario.getRa() == null || !usuario.getRa().matches("\\d{13}")) {
                return ResponseEntity.badRequest().body("O RA deve conter exatamente 13 dígitos numéricos.");
            }
        }
        
        // ======== LÓGICA DE REATIVAÇÃO ========
        // Primeiro: procurar usuário pelo email
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());
        
        if (usuarioExistente.isPresent()) {
            Usuario u = usuarioExistente.get();
            
            // Se o usuário existe mas está inativo, reativa!
            if (Boolean.FALSE.equals(u.getAtivo())) {
                u.setAtivo(true);
                u.setSenha(passwordEncoder.encode(usuario.getSenha()));
                usuarioRepository.save(u);
                return ResponseEntity.ok("Usuário reativado com sucesso!Bem-vindo de volta!");
            } else {
                // Se existe e está ativo, retorna erro
                return ResponseEntity.badRequest().body("Este e-mail já está cadastrado!");
            }
        }
        
        //Também verificar pelo RA (para alunos)
        if ("ALUNO".equals(usuario.getRole()) && usuario.getRa() != null) {
            Optional<Usuario> usuarioPorRa = usuarioRepository.findByRa(usuario.getRa());
            if (usuarioPorRa.isPresent()) {
                Usuario u = usuarioPorRa.get();
                if (Boolean.FALSE.equals(u.getAtivo())) {
                    // Reativar pelo RA
                    u.setAtivo(true);
                    u.setSenha(passwordEncoder.encode(usuario.getSenha()));
                    usuarioRepository.save(u);
                    return ResponseEntity.ok("Usuário reativado com sucesso! Bem-vindo de volta!");
                } else {
                    return ResponseEntity.badRequest().body("Este RA já está cadastrado!");
                }
            }
        }
        // ======== FIM DA LÓGICA ========
        
        // 3. Validações normais (email institucional,Username único,etc)
        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            return ResponseEntity.badRequest().body("Nome de usuário já está em uso!");
        }
        
        String email = usuario.getEmail();
        if (email == null || (!email.endsWith("@aluno.cps.sp.gov.br") && !email.endsWith("@fatec.sp.gov.br"))) {
            return ResponseEntity.badRequest().body("Use um e-mail institucional.");
        }

        // 4. Encriptar senha e salvar
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setAtivo(true); // Garante que novos usuarios comecem ativos
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuário registrado com sucesso!");
    }


@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Usuario loginRequest) {
    String login = loginRequest.getUsername(); // pode ser email
    
    // Se for email, procura o usuário pelo email
    if (login.contains("@")) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(login);
        if (usuarioOpt.isPresent()) {
            login = usuarioOpt.get().getUsername(); // usa o username real
        }
    }
    
    try {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(login, loginRequest.getSenha())
        );
    } catch (BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos");
    }

    final UserDetails userDetails = userDetailsService.loadUserByUsername(login);
    final String token = jwtUtil1.gerarToken(userDetails);

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
    
    @GetMapping("/me/perfil")
    public ResponseEntity<?> meuPerfil() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (auth.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            Usuario usuario = userDetails.getUsuario();
            
            // Retorna o ID também!
            return ResponseEntity.ok(Map.of(
                "id", usuario.getId(),
                "username", usuario.getUsername(),
                "role", usuario.getRole(),
                "email", usuario.getEmail()
            ));
        }

        return ResponseEntity.ok(auth.getPrincipal());
    }
}