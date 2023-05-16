function bodyParser(request, callback) {
  let body = '';

  request.on('data', (chunk) => {
    // fica ouvindo as mensagens e, sempre que chega um evento com o nome data, 
    // com uma parte do meu body, vou concatenando ele dentro da variável 
    body += chunk;
  });

  request.on('end', () => {
    // quando chega a última mensagem que finaliza, o evento end é chamado e 
    // dentro dele é feito o parse pra transformar a string em JSON,
    // injeta esse objeto dentro da request e chama a funcao de callback (o handler)
    body = JSON.parse(body);
    request.body = body;
    callback();
  });
}

module.exports = bodyParser;