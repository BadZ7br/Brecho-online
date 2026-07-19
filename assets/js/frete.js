/**
 * CORRE BRECHÓ — Cálculo de frete
 * 1) Valida o CEP e consulta a ViaCEP (API pública, gratuita, sem chave)
 *    para descobrir cidade/UF reais do destinatário.
 * 2) Aplica uma tabela de zonas por UF (origem: São Paulo/SP) + peso do
 *    carrinho para simular o valor, no mesmo espírito de uma tabela PAC/SEDEX.
 * Não é uma cotação oficial dos Correios/transportadora — é um simulador
 * funcional baseado no endereço real do CEP informado.
 */
(function (global) {
  "use strict";

  // base = até 1kg | perKg = adicional por kg extra | days = prazo em dias úteis
  const ZONES = {
    SP: { label: "Sudeste — SP (local)", base: 12.9, perKg: 2.8, minDays: 1, maxDays: 3 },
    RJ: { label: "Sudeste", base: 21.9, perKg: 3.9, minDays: 2, maxDays: 5 },
    MG: { label: "Sudeste", base: 21.9, perKg: 3.9, minDays: 2, maxDays: 5 },
    ES: { label: "Sudeste", base: 23.9, perKg: 4.1, minDays: 3, maxDays: 6 },
    PR: { label: "Sul", base: 24.9, perKg: 4.2, minDays: 3, maxDays: 6 },
    SC: { label: "Sul", base: 26.9, perKg: 4.4, minDays: 3, maxDays: 6 },
    RS: { label: "Sul", base: 28.9, perKg: 4.6, minDays: 4, maxDays: 7 },
    GO: { label: "Centro-Oeste", base: 32.9, perKg: 5.2, minDays: 5, maxDays: 8 },
    DF: { label: "Centro-Oeste", base: 31.9, perKg: 5.0, minDays: 4, maxDays: 7 },
    MT: { label: "Centro-Oeste", base: 36.9, perKg: 5.6, minDays: 6, maxDays: 9 },
    MS: { label: "Centro-Oeste", base: 35.9, perKg: 5.5, minDays: 5, maxDays: 9 },
    BA: { label: "Nordeste", base: 34.9, perKg: 5.4, minDays: 5, maxDays: 9 },
    SE: { label: "Nordeste", base: 37.9, perKg: 5.7, minDays: 6, maxDays: 10 },
    AL: { label: "Nordeste", base: 38.9, perKg: 5.8, minDays: 6, maxDays: 10 },
    PE: { label: "Nordeste", base: 38.9, perKg: 5.8, minDays: 6, maxDays: 10 },
    PB: { label: "Nordeste", base: 39.9, perKg: 5.9, minDays: 6, maxDays: 10 },
    RN: { label: "Nordeste", base: 39.9, perKg: 5.9, minDays: 6, maxDays: 10 },
    CE: { label: "Nordeste", base: 40.9, perKg: 6.0, minDays: 6, maxDays: 10 },
    PI: { label: "Nordeste", base: 41.9, perKg: 6.1, minDays: 7, maxDays: 11 },
    MA: { label: "Nordeste", base: 42.9, perKg: 6.2, minDays: 7, maxDays: 11 },
    TO: { label: "Norte", base: 43.9, perKg: 6.4, minDays: 7, maxDays: 12 },
    AM: { label: "Norte", base: 54.9, perKg: 7.8, minDays: 9, maxDays: 15 },
    PA: { label: "Norte", base: 49.9, perKg: 7.2, minDays: 8, maxDays: 14 },
    AC: { label: "Norte", base: 57.9, perKg: 8.1, minDays: 10, maxDays: 16 },
    RO: { label: "Norte", base: 52.9, perKg: 7.5, minDays: 9, maxDays: 14 },
    RR: { label: "Norte", base: 59.9, perKg: 8.4, minDays: 10, maxDays: 17 },
    AP: { label: "Norte", base: 57.9, perKg: 8.0, minDays: 9, maxDays: 16 }
  };

  const FREE_SHIPPING_THRESHOLD = 400; // frete grátis acima deste subtotal

  function sanitizeCep(raw) {
    return (raw || "").replace(/\D/g, "");
  }

  function isValidCepFormat(digits) {
    return /^\d{8}$/.test(digits);
  }

  // Consulta ViaCEP -> { uf, localidade } ou lança erro
  async function lookupCep(digits) {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!res.ok) throw new Error("Falha ao consultar o CEP.");
    const data = await res.json();
    if (data.erro) throw new Error("CEP não encontrado.");
    return { uf: data.uf, cidade: data.localidade };
  }

  // Calcula o frete final: { cost, minDays, maxDays, zoneLabel, cidade, uf, free }
  function calcularFrete(uf, weightKg, subtotal) {
    const zone = ZONES[uf];
    if (!zone) throw new Error("UF fora da área de entrega simulada.");

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      return {
        cost: 0,
        free: true,
        minDays: zone.minDays,
        maxDays: zone.maxDays,
        zoneLabel: zone.label
      };
    }

    const billableWeight = Math.max(weightKg, 0.3);
    const extraKg = Math.max(0, billableWeight - 1);
    const cost = zone.base + extraKg * zone.perKg;

    return {
      cost: Math.round(cost * 100) / 100,
      free: false,
      minDays: zone.minDays,
      maxDays: zone.maxDays,
      zoneLabel: zone.label
    };
  }

  global.CorreFrete = {
    sanitizeCep,
    isValidCepFormat,
    lookupCep,
    calcularFrete,
    FREE_SHIPPING_THRESHOLD
  };
})(window);
