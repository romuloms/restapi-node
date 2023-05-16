const http = require('http');
const { URL } = require('url');

const bodyParser = require('./helpers/bodyParser')
const routes = require('./routes');

const server = http.createServer((request, response) => {
    const parsedUrl = new URL(`http://localhost:3000${request.url}`);
    // é necessário fazer o parse da URL pra poder extrair os query params 
    // o true transforma o query param de uma string pra um objeto

    console.log(`Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`);

    let { pathname } = parsedUrl;
    let id = null;

    const splitEndpoint = pathname.split('/').filter(Boolean);
    // split do endpoint nas barras pra poder identificar quando a requisição tá
    // chegando com um id 
    // a string vazia é um valor false no JS, o filter está filtrando essa 
    // string vazia no endpoint ao filtrar os valores que são falsos

    if(splitEndpoint.length > 1) {
        pathname = `/${splitEndpoint[0]}/:id`;
        // quando a requisição chega com id, tem que colocar o /:id pra poder
        // identificar qual é o id nas rotas 
        
        id = splitEndpoint[1];
        // salva o id que tá chegando na rota dentro desta variável que posteriormente
        // vai ser injetada dentro de uma propriedade params (l.42) que é um obj
    }

    const route = routes.find((routeObj) => (
        routeObj.endpoint === pathname && routeObj.method === request.method
        // pesquisa, dentro do array de rotas, uma que faça um 'match' tanto de
        // endpoint quanto de método com o que tá chegando na url
    ))

    if(route) {
        // injeta os query params dentro do request quando encontrar uma rota
        request.query = Object.fromEntries(parsedUrl.searchParams);
        request.params = { id };

        response.send = (statusCode, body) => {
            // esse método é criado para não precisar repetir o código abaixo
            // sempre que precisar enviar uma resposta pra request
            response.writeHead(statusCode, { 'Contet-Type': 'application/json' });
            response.end(JSON.stringify(body));
        };

        if(['POST', 'PUT', 'PATCH'].includes(request.method)) {
            // verifica se o método que tá chegando é POST, PUT ou PATCH
            bodyParser(request, () => route.handler(request, response));
            // se for, pega o stream do body e transforma em um JSON
            // stream: info que chega aos poucos, por isso a função de callback
        } else {
            route.handler(request, response);
            // só executa depois que cair no request.on('end') do bodyParser
        }
    } else {
        response.writeHead(404, { 'Contet-Type': 'text/html' });
        response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
    }

    // if(request.url === '/users' && request.method === 'GET') {
    //     UserController.listUsers(request, response)
    // } else {
        
    // }
})

server.listen(3000, () => console.log('Server started at http://localhost:3000'));