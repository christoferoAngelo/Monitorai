package com.eva.monitorai.exception;

public class MaterialNotFoundException extends RuntimeException {

    public MaterialNotFoundException() {
        super("Material não encontrado");
    }
}