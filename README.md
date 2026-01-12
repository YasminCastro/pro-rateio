# Pro Rateio

Uma aplicação web para dividir contas proporcionalmente pelo tempo que cada pessoa ficou presente, desenvolvida com Next.js, React e TypeScript. Esta ferramenta ajuda você a calcular o rateio justo de contas (água, energia, aluguel, etc.) baseado nos períodos de presença de cada pessoa.

## 🚀 Funcionalidades

- **Gerenciamento de pessoas**: Adicione pessoas e defina múltiplos períodos de presença para cada uma
- **Gerenciamento de contas**: Adicione contas com valor total e período de cobrança
- **Cálculo proporcional**: Divide o valor da conta proporcionalmente aos dias que cada pessoa esteve presente
- **Múltiplos períodos**: Cada pessoa pode ter vários períodos de presença (útil para casos onde alguém saiu e voltou)
- **Edição de dados**: Edite pessoas e contas a qualquer momento
- **Persistência de dados**: Salva automaticamente todas as informações no navegador (localStorage)
- **Interface responsiva**: Funciona perfeitamente em desktop e mobile
- **Cálculo automático**: Os resultados são recalculados automaticamente quando você adiciona, edita ou remove dados

## 🛠️ Tecnologias

- [Next.js 16](https://nextjs.org/) - Framework React
- [React 19](https://react.dev/) - Biblioteca UI
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [date-fns](https://date-fns.org/) - Manipulação de datas
- [Lucide React](https://lucide.dev/) - Ícones

## 📦 Instalação

1. Clone o repositório:

```bash
git clone <seu-repositorio>
cd pro-rateio
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no navegador

## 💡 Como Usar

### 1. Adicionar Pessoas

1. Clique em **"Adicionar Pessoa"**
2. Informe o nome da pessoa
3. Defina os períodos de presença (data de início e data de fim)
4. Você pode adicionar múltiplos períodos para a mesma pessoa (útil se alguém saiu e voltou)
5. Clique em **"Adicionar"**

**Dica**: Por padrão, os campos de data já vêm preenchidos com o primeiro e último dia do mês atual.

### 2. Adicionar Contas

1. Clique em **"Adicionar Conta"**
2. Informe o nome da conta (ex: "Conta de Água", "Conta de Energia")
3. Informe o valor total da conta
4. Defina o período de cobrança (data de início e data de fim)
5. Clique em **"Adicionar"**

**Dica**: Por padrão, os campos de data já vêm preenchidos com o primeiro e último dia do mês atual.

### 3. Visualizar Resultados

Após adicionar pessoas e contas, os resultados do rateio são calculados e exibidos automaticamente. Para cada conta, você verá:

- **Total de dias** do período da conta
- **Dias de cada pessoa** durante o período da conta
- **Percentual** que cada pessoa representa
- **Valor a pagar** por cada pessoa

### 4. Editar ou Remover

- Clique no ícone de **lápis** para editar uma pessoa ou conta
- Clique no ícone de **lixeira** para remover uma pessoa ou conta

## 📊 Como Funciona o Cálculo

O sistema calcula o rateio proporcionalmente aos dias que cada pessoa esteve presente durante o período da conta:

1. **Cálculo de interseção**: Para cada pessoa, o sistema verifica quais períodos de presença se sobrepõem com o período da conta
2. **Soma de dias**: Soma todos os dias que cada pessoa esteve presente durante o período da conta
3. **Cálculo proporcional**:
   - Calcula o total de dias de todas as pessoas
   - Para cada pessoa: `(Dias da pessoa / Total de dias) × Valor da conta`
4. **Percentual**: Calcula a porcentagem que cada pessoa representa no total

### Exemplo Prático

Imagine uma conta de R$ 300,00 no período de 01/01 a 31/01 (31 dias):

- **Pessoa A**: Esteve presente de 01/01 a 15/01 (15 dias)
- **Pessoa B**: Esteve presente de 10/01 a 31/01 (22 dias)
- **Pessoa C**: Esteve presente de 01/01 a 31/01 (31 dias)

**Cálculo**:

- Total de dias: 15 + 22 + 31 = 68 dias
- Pessoa A: (15 / 68) × 300 = R$ 66,18
- Pessoa B: (22 / 68) × 300 = R$ 97,06
- Pessoa C: (31 / 68) × 300 = R$ 136,76

## 💾 Persistência de Dados

Todos os dados são salvos automaticamente no **localStorage** do navegador. Isso significa que:

- ✅ Seus dados persistem mesmo após fechar o navegador
- ✅ Não é necessário criar conta ou fazer login
- ⚠️ Os dados são armazenados apenas no seu navegador (não são sincronizados entre dispositivos)
- ⚠️ Se você limpar os dados do navegador, as informações serão perdidas

## 🎨 Estrutura do Projeto

```
pro-rateio/
├── app/                    # Páginas e layouts
│   ├── page.tsx           # Página principal
│   └── layout.tsx         # Layout global
├── components/            # Componentes React
│   ├── add-person-dialog.tsx    # Diálogo para adicionar/editar pessoa
│   ├── add-bill-dialog.tsx      # Diálogo para adicionar/editar conta
│   ├── bill-calculation-card.tsx # Card com resultados do rateio
│   └── ui/                # Componentes de UI reutilizáveis
├── lib/                   # Lógica de negócio
│   ├── calculations.ts    # Funções de cálculo do rateio
│   ├── storage.ts         # Funções de persistência (localStorage)
│   ├── types.ts           # Definições de tipos TypeScript
│   └── utils.ts           # Funções utilitárias
└── public/                # Arquivos estáticos
```

## 📝 Licença

Este projeto é de uso pessoal.

## 👤 Autor

Yas Castro - [yascastro.com.br](https://www.yascastro.com.br)
