const express = require('express');
const axios = require('axios');

const app = express();
const port = 5200;

app.get('/', async (req, res) => {
  try {
    // Faz uma solicitação GET para localhost:8080/auth/login
    const response = await axios.get('http://localhost:8080/auth/login');

    // Retorna os dados recebidos na resposta
    res.send(response.data);
  } catch (error) {
    // Lida com erros, se houver
    console.error('Erro na solicitação:', error.message);
    res.status(500).send('Erro na solicitação');
  }
});

app.listen(port, () => {
  console.log(`Servidor está ouvindo em http://localhost:${port}`);
});