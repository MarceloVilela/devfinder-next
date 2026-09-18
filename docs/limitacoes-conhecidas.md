# Limitações conhecidas

## Backend de referência sem SLA

`NEXT_PUBLIC_API_URL` aponta, por padrão, para um deploy gratuito (Render) sem garantia de
disponibilidade; a instância pode ficar lenta/indisponível (cold start, sono por inatividade), o
que já gerou 504 nas listagens (`/`, `/video`, `/user`, `/channel`) na primeira carga real do
app — achado A4 (v4, Etapa 2).

Mitigado (não eliminado — é limitação de terceiro, fora de controle deste repositório): o
`fetch` das 4 listagens usa timeout curto (`fetchJSON`, parâmetro `timeoutMs`) com fallback
amigável em vez do 504 cru — ver `src/lib/fetchJSON.ts` e `src/components/FeedbackMessage`.
