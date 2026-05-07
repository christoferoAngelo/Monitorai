package com.eva.monitorai.exception;

import java.time.LocalDateTime;

public class ErrorResponse {

    private String erro;
    private LocalDateTime data;

    public ErrorResponse(String erro) {
        this.erro = erro;
        this.data = LocalDateTime.now();
    }

    public String getErro() {
        return erro;
    }

    public LocalDateTime getData() {
        return data;
    }
}