# Descricao deste aplicativo

Este tipo de aplicativo, que permite aos usuários consultar a hora atual em diferentes fusos horários e cidades,
pode ser pesquisado da seguinte forma `Africa/Luanda`

# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

# faca os ajustes com base o codigo da aplicacao

Para instalar o Remix e configurar o projeto diretamente na pasta atual, você pode seguir os seguintes passos:

### 1. Inicialize o Projeto Remix na Pasta Atual

Se você já estiver na pasta onde deseja criar o projeto, use o seguinte comando para criar um novo projeto Remix com TypeScript:

```bash
npx create-remix@latest . --typescript
```

Este comando cria um novo projeto Remix com suporte a TypeScript na pasta atual (o ponto `.` indica a pasta atual).

### 2. Instale Dependências

Depois de criar o projeto, instale `axios` para fazer chamadas HTTP:

```bash
npm install axios
```

### 3. Crie a Rota e o Componente de Busca

Crie um arquivo para a rota que lidará com a busca e a exibição da hora. No diretório `app/routes`, crie um arquivo chamado `time.tsx`.

Adicione o seguinte código a `time.tsx`:

```tsx
import { json, LoaderFunction, useLoaderData } from "remix";
import axios from "axios";
import { useState } from "react";

type LoaderData = {
  time?: string;
  error?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const city = url.searchParams.get("city") || "";

  if (!city) {
    return json<LoaderData>({});
  }

  try {
    const response = await axios.get(
      `http://worldtimeapi.org/api/timezone/${city}`
    );
    const time = response.data.datetime;
    return json<LoaderData>({ time });
  } catch {
    return json<LoaderData>({ error: "Unable to fetch time" });
  }
};

export default function Time() {
  const data = useLoaderData<LoaderData>();
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <h1>Get Current Time</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city timezone (e.g., America/New_York)"
        />
        <button type="submit">Search</button>
      </form>
      {submitted && (
        <div>
          {data.error ? (
            <p>{data.error}</p>
          ) : (
            <p>
              Current Time in {city}: {data.time}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

### 4. Atualize o `app/routes/index.tsx`

Se desejar, você pode adicionar um link para a página de busca no arquivo `index.tsx`:

```tsx
import { Link } from "remix";

export default function Index() {
  return (
    <div>
      <h1>Welcome to the Time App</h1>
      <Link to="/time">Go to Time Search</Link>
    </div>
  );
}
```

### 5. Execute o Servidor de Desenvolvimento

Inicie o servidor de desenvolvimento do Remix:

```bash
npm run dev
```

Agora você pode abrir seu navegador e ir para `http://localhost:3000/time` para usar o recurso de busca e visualizar a hora atual de uma cidade.

Certifique-se de usar nomes de fusos horários válidos suportados pela World Time API, como `America/New_York` ou `Europe/London`.
