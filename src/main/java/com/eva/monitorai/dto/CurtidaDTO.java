package com.eva.monitorai.dto;

public class CurtidaDTO {

    private Long materialId;
    private Long totalCurtidas;
    private Boolean curtido;

    public CurtidaDTO(){}

    public CurtidaDTO(
            Long materialId,
            Long totalCurtidas,
            Boolean curtido
    ){
        this.materialId = materialId;
        this.totalCurtidas = totalCurtidas;
        this.curtido = curtido;
    }

    public Long getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Long materialId) {
        this.materialId = materialId;
    }

    public Long getTotalCurtidas() {
        return totalCurtidas;
    }

    public void setTotalCurtidas(Long totalCurtidas) {
        this.totalCurtidas = totalCurtidas;
    }

    public Boolean getCurtido() {
        return curtido;
    }

    public void setCurtido(Boolean curtido) {
        this.curtido = curtido;
    }
}