package com.eva.monitorai.controller;

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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eva.monitorai.model.entity.Usuario;
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
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {

        try {

            Usuario novoUsuario = service.registrar(usuario);

            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
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
        final String token = jwtUtil.gerarToken(userDetails);

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
    public Usuario me(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return userDetails.getUsuario();
    }
}