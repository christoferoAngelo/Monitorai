package com.eva.monitorai.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.util.Date;


/*=============================================================================================
 * 
 * 
 * 			ESSA CLASSE POSSUI MÉTODOS UTEIS PARA O JWT (Json Web Token)
 * 
 * 
 * ========================================================================================== */


@Component
public class JwtUtil {

    private final String SECRET_KEY = "sua_chave_secreta_muito_longA_PARA_SEGURANCA";

    public String gerarToken(UserDetails userDetails) {
        return JWT.create()
                .withSubject(userDetails.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 horas
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }

    public String extrairUsername(String token) {
        return JWT.require(Algorithm.HMAC256(SECRET_KEY))
                .build()
                .verify(token)
                .getSubject();
    }

    public boolean validarToken(String token, UserDetails userDetails) {
        String username = extrairUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpirado(token));
    }

    private boolean isTokenExpirado(String token) {
        Date expiration = JWT.require(Algorithm.HMAC256(SECRET_KEY))
                .build()
                .verify(token)
                .getExpiresAt();
        return expiration.before(new Date());
    }
}
