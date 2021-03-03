# AutoCrypto Frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## Project deploy

### Verifique se está utilizando o projeto correto
```
firebase projects:list
```
Resposta:
| Project Display Name        | Project ID | Project Number |Resource Location ID |
| ------------- | ------------- | ------------- |-----:|
| ...      |  ... | ... | ... |
| cardapio's     |  **cardapio-s (current)** | 569874076437 | southamerica-east1 |
| ...      |  ... | ... | ... |

Caso não esteja no projeto correto, utilize o comando:
```
firebase use cardapio-s
```

### Compile o projeto
```
npm run build
```

### Faça o deploy
```
firebase deploy --only hosting
```