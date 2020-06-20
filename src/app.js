const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());


function validateRepositoryId(request, response, next){
  const { id }  = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid repository ID' });
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  if(likes && ((!title) && (!url) && (!techs) )){
    return response.json({likes: 0});
  }
  
  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found' });
  }

  const repository = {
    id,
    title,
    url,
    techs
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found'});
  }
  
  repositories.splice(repositoryIndex,1); //Função utilizada para remover um objeto do array

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0 ){
    return response.status(400).json({ error: 'Repository not found'});
  }

  repositories[repositoryIndex].likes += 1;

  return response.status(200).json({ likes: repositories[repositoryIndex].likes });
});

module.exports = app;
