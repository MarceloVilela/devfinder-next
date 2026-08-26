# Plano de Correção da Rota `generateTranscription`

## Objetivo
- Usar `youtube-dl-exec` para baixar áudio MP3 de uma URL do YouTube.
- Transcrever o áudio com `@xenova/transformers` usando Whisper.
- Retornar diretamente o texto da transcrição no `res.json()`.
- Garantir tipagem correta para `transcript.text`.

## Dependências
- `youtube-dl-exec`
- `@xenova/transformers`

## Passos

### 1. Instalar `youtube-dl-exec`

```bash
npm install youtube-dl-exec
```

### 2. Atualizar o arquivo da rota

Substituir o trecho de `yt-dlp-wrap` por `youtube-dl-exec`:
- Receber `youtubeUrl` de `req.body.youtubeUrl`
- Executar:
  - `youtube-dl-exec` com `-x --audio-format mp3 --output audio.mp3`
- Usar o arquivo gerado `audio.mp3` como entrada para o Whisper

### 3. Ajustar a tipagem do retorno do pipeline

Definir um tipo explícito para o resultado do Whisper:

```ts
type WhisperResult = { text: string };
const transcript = await transcriber('audio.mp3') as WhisperResult;
```

Isso garante que `transcript.text` seja reconhecido no TypeScript.

### 4. Retornar somente o texto da transcrição

Alterar o `res.json()` para retornar apenas o texto:

```ts
return res.status(200).json(transcript.text);
```

### 5. Limpar o arquivo temporário

Após a transcrição, remover `audio.mp3` para não deixar arquivos temporários:

```ts
await fs.promises.unlink('audio.mp3');
```

### 6. Tratamento de erros

- Se a URL for inválida ou o download falhar, retornar `500` com mensagem de erro.
- Se a transcrição falhar, retornar `500` igualmente.

## Observações importantes

- A rota deve funcionar mesmo sem legenda, porque o Whisper faz reconhecimento de fala diretamente do áudio.
- Em ambientes serverless como Vercel, é preciso verificar se a escrita de arquivos temporários é permitida.
- Se necessário, usar o diretório temporário do sistema em vez de `audio.mp3` na raiz.

## Exemplo do fluxo final

1. Receber `youtubeUrl` no corpo da requisição.
2. Baixar áudio MP3 com `youtube-dl-exec`.
3. Transcrever com `pipeline('automatic-speech-recognition', 'Xenova/whisper-small')`.
4. Retornar `transcript.text` em `res.json()`.
