package com.eva.monitorai.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.eva.monitorai.security.JwtFilter;

import jakarta.servlet.Filter;

/*=============================================================================================
 * 
 * 
 * 			ESSA CLASSE CRIA AS CONFIGURAÇÕES DO SISTEMA DE SEGURANÇA
 * 			- /LOGIN E /REGISTER SÃO LIBERADOS PARA TODOS
 * 			- /BRINQUEDOS, /MARCAS, /CATEGORIAS E /USUARIOS SÓ É LIBERADO PARA QUEM TA LOGADO COMO ADMIN
 * 
 * 
 * ========================================================================================== */

@Configuration 
@EnableMethodSecurity
public class SecurityConfig {

	@Autowired
    private JwtFilter jwtFilter;
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	    http
	        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
	        .csrf(csrf -> csrf.disable())
	        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        .authorizeHttpRequests(auth -> auth
	        	    // 1. Libera preflight de CORS
	        	    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

	        	    // 2. Libera rotas públicas de login e registro
	        	    .requestMatchers("/auth/**").permitAll()

	        	    // 3. Rotas específicas por Role
	        	    // (O Spring vai procurar por ROLE_ADMIN, ROLE_MONITOR, ROLE_ALUNO)
	        	    .requestMatchers("/admin/**").hasRole("ADMIN")
	        	    .requestMatchers("/monitor/**").hasAnyRole("MONITOR", "ADMIN") 
	        	    
	        	    // 4. Qualquer outra requisição precisa apenas estar logado (ex: portal do aluno)
	        	    .anyRequest().authenticated()
	        	);
	    
	    http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

	    return http.build();
	}

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedHeaders(Arrays.asList(
        	    "Authorization", 
        	    "Content-Type", 
        	    "X-Requested-With", 
        	    "Accept", 
        	    "Origin", 
        	    "Access-Control-Request-Method", 
        	    "Access-Control-Request-Headers"
        ));
        
        // Define a origem exata do seu Front-end
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); 
        
        // Métodos permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Headers permitidos
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        
        // ESSENCIAL: Exponha o header Authorization se o front precisar ler o token dele
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        // Como isso é true, o AllowedOrigins lá em cima não pode ser "*"
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
