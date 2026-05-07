package com.eva.monitorai.exception;

public class UsuarioNotFoundException extends RuntimeException {

    public UsuarioNotFoundException() {
        super("Usuário não encontrado");
    }
}