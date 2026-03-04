Objetivo
Validar a integração entre:
- Sugestões de cidades
- Previsão do tempo
- Ranking de atividades

Pré-condições
- A API está online
- Navegador ou ferramenta como Postman/Insomnia
- Conexão com internet

Caso 1 — Autocomplete de cidades
Passos
- Digitar “votup” no campo de busca.
- Observar lista de sugestões.
Resultado esperado
- Lista aparece com cidades compatíveis.
- Cada item contém nome da cidade.

Caso 2 — Cidade inválida
Passos
- Digitar “zzzzzz”.
Resultado esperado
- Lista vazia.

Caso 3 — Previsão do tempo (7 dias)
Passos
- Selecionar cidade com lat -20.71889 e lon -46.60972.
- Chamar endpoint /weather.
Resultado esperado
- 7 dias retornados.
- Cada dia contém temperatura, precipitação e condições.

 Caso 4 — Ranking de atividades
Passos
- Selecionar cidade.
- Chamar /activities.
Resultado esperado
- 7 itens.
- Cada item contém:
- data
- atividade
- rank (1–10)
- justificativ

 Caso 5 — API lenta
Passos
- Simular rede lenta no navegador.
- Chamar /weather.
Resultado esperado
- Sistema exibe mensagem de timeout ou fallback.

 Caso 6 — Falha de API
Passos
- Desconectar internet.
- Chamar qualquer endpoint.
Resultado esperado
- Mensagem clara de erro.
