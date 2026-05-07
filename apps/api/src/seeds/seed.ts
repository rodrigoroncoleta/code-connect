import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';
import { Comment } from '../posts/comment.entity';
import { PostLike } from '../posts/post-like.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

const THUMBNAILS = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
  'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80',
  'https://images.unsplash.com/photo-1602992708529-c9fdb12905c9?w=800&q=80',
  null, // post sem thumbnail (para testar placeholder)
];

const MOCK_POSTS = [
  {
    title: 'Construindo um Design System com React e Tailwind CSS',
    description:
      'Aprenda como criar um design system robusto e escalável utilizando React como base de componentes e Tailwind CSS para estilização. Vamos explorar átomos, moléculas e organismos seguindo o padrão Atomic Design.',
    content: '# Design System\n\n```tsx\nexport const Button = ({ children }: ButtonProps) => (\n  <button className="bg-accent text-accent-text px-4 py-2 rounded">{children}</button>\n);\n```',
    tags: ['React', 'Tailwind', 'Design System'],
    thumbnailIndex: 0,
  },
  {
    title: 'TypeScript avançado: tipos utilitários que você precisa conhecer',
    description:
      'Uma exploração profunda dos tipos utilitários do TypeScript como Partial, Required, Pick, Omit e como combiná-los para criar tipos seguros e expressivos no seu projeto.',
    content: '# Tipos utilitários\n\n```ts\ntype PostPreview = Pick<Post, "id" | "title" | "thumbnail">;\n```',
    tags: ['TypeScript', 'JavaScript'],
    thumbnailIndex: 1,
  },
  {
    title: 'NestJS: arquitetura modular para APIs RESTful escaláveis',
    description:
      'Como estruturar uma API NestJS seguindo boas práticas de arquitetura modular, injeção de dependência, guards e interceptors. Um guia completo para projetos de médio e grande porte.',
    content: null,
    tags: ['NestJS', 'Node.js', 'API REST'],
    thumbnailIndex: 2,
  },
  {
    title: 'Acessibilidade na web: além do aria-label',
    description:
      'Um mergulho nas práticas de acessibilidade que vão além do básico. Aprenda sobre semântica HTML, gerenciamento de foco, testes com leitores de tela e como auditar sua aplicação.',
    content: null,
    tags: ['Acessibilidade', 'HTML', 'UX'],
    thumbnailIndex: 3,
  },
  {
    title: 'React Query vs SWR: qual escolher para gerenciamento de dados?',
    description:
      'Comparação detalhada entre as duas bibliotecas mais populares para data fetching no React. Vamos analisar caching, revalidação, mutações e casos de uso específicos de cada uma.',
    content: '# React Query\n\n```tsx\nconst { data, isLoading } = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });\n```',
    tags: ['React', 'React Query', 'SWR'],
    thumbnailIndex: 4,
  },
  {
    title: 'Docker Compose para desenvolvimento full-stack com Node.js e PostgreSQL',
    description:
      'Configure um ambiente de desenvolvimento completo com Docker Compose, incluindo Node.js, PostgreSQL e pgAdmin. Esqueça os problemas de configuração do banco local.',
    content: null,
    tags: ['Docker', 'PostgreSQL', 'DevOps'],
    thumbnailIndex: 5,
  },
  {
    title: 'Testes de componentes React com Vitest e Testing Library',
    description:
      'Como escrever testes significativos para seus componentes React seguindo os princípios da Testing Library: testar comportamento, não implementação. Do setup ao CI.',
    content: '# Teste de componente\n\n```tsx\nit("should render button", () => {\n  render(<Button>Click me</Button>);\n  expect(screen.getByRole("button")).toBeInTheDocument();\n});\n```',
    tags: ['React', 'Vitest', 'Testes', 'Testing Library'],
    thumbnailIndex: 6,
  },
  {
    title: 'Git avançado: rebase interativo, bisect e outros comandos poderosos',
    description:
      'Domine os comandos Git que separam desenvolvedores plenos dos seniores. Rebase interativo para histórico limpo, bisect para encontrar bugs, reflog como rede de segurança.',
    content: null,
    tags: ['Git', 'DevOps', 'Ferramentas'],
    thumbnailIndex: 7, // null thumbnail — teste de placeholder
  },
  {
    title: 'CSS Grid na prática: layouts complexos sem frameworks',
    description:
      'Construa layouts complexos e responsivos usando apenas CSS Grid. Sem Bootstrap, sem frameworks. Aprenda grid-template-areas, subgrid e como combinar com Flexbox.',
    content: null,
    tags: ['CSS', 'Front-end', 'Layout'],
    thumbnailIndex: 0,
  },
  {
    title: 'Vite 5: o bundler que mudou o desenvolvimento front-end',
    description:
      'Por que o Vite se tornou o padrão da indústria para projetos React e Vue. Análise do HMR ultrarrápido, builds otimizados com Rollup e como migrar do Create React App.',
    content: null,
    tags: ['Vite', 'Front-end', 'Build'],
    thumbnailIndex: 1,
  },
  {
    title: 'PostgreSQL: índices avançados para queries de alta performance',
    description:
      'Quando usar índices B-tree, Hash, GIN e GiST no PostgreSQL. Como analisar planos de execução com EXPLAIN ANALYZE e otimizar queries que travam em produção.',
    content: null,
    tags: ['PostgreSQL', 'Database', 'Performance'],
    thumbnailIndex: 2,
  },
  {
    title: 'Clean Architecture no front-end com React',
    description:
      'Aplicando os princípios de Clean Architecture no front-end. Separação de entidades, casos de uso, adaptadores e a camada de UI. Como manter o React fora do núcleo da aplicação.',
    content: null,
    tags: ['React', 'Arquitetura', 'Clean Code'],
    thumbnailIndex: 3,
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const dataSource = app.get(DataSource);
  const usersRepo = dataSource.getRepository(User);
  const postsRepo = dataSource.getRepository(Post);
  const commentsRepo = dataSource.getRepository(Comment);
  const likesRepo = dataSource.getRepository(PostLike);

  // Limpa dados existentes respeitando ordem de FKs
  await dataSource.query('TRUNCATE TABLE post_like, comment, post RESTART IDENTITY CASCADE');

  // Cria usuário seed se não existir
  let author = await usersRepo.findOneBy({ email: 'julio@codeconnect.dev' });
  if (!author) {
    author = usersRepo.create({
      name: 'Julio Marques',
      email: 'julio@codeconnect.dev',
      passwordHash: await bcrypt.hash('senha123', 10),
    });
    author = await usersRepo.save(author);
  }

  let author2 = await usersRepo.findOneBy({ email: 'ana@codeconnect.dev' });
  if (!author2) {
    author2 = usersRepo.create({
      name: 'Ana Beatriz',
      email: 'ana@codeconnect.dev',
      passwordHash: await bcrypt.hash('senha123', 10),
    });
    author2 = await usersRepo.save(author2);
  }

  const authors = [author, author2];

  // Cria posts
  const savedPosts: Post[] = [];
  for (let i = 0; i < MOCK_POSTS.length; i++) {
    const mock = MOCK_POSTS[i];
    const post = postsRepo.create({
      title: mock.title,
      description: mock.description,
      content: mock.content ?? null,
      thumbnail: THUMBNAILS[mock.thumbnailIndex] ?? null,
      tags: mock.tags,
      author: authors[i % authors.length],
    });
    savedPosts.push(await postsRepo.save(post));
  }

  // Adiciona alguns comentários e likes
  const commentTexts = [
    'Excelente post! Me ajudou muito.',
    'Conteúdo muito bem explicado, obrigado!',
    'Faltou mencionar o uso de memo para otimização.',
    'Já estava procurando exatamente isso!',
  ];

  for (let i = 0; i < savedPosts.length; i++) {
    const post = savedPosts[i];
    const numComments = (i % 3) + 1;
    for (let j = 0; j < numComments; j++) {
      const comment = commentsRepo.create({
        content: commentTexts[(i + j) % commentTexts.length],
        post,
        author: authors[(i + j) % authors.length],
      });
      await commentsRepo.save(comment);
    }

    // Likes alternados
    if (i % 2 === 0) {
      const like = likesRepo.create({ post, user: authors[1] });
      await likesRepo.save(like);
    }
    if (i % 3 === 0) {
      const like = likesRepo.create({ post, user: authors[0] });
      await likesRepo.save(like);
    }
  }

  console.log(`✅ Seed concluído: ${savedPosts.length} posts criados.`);
  await app.close();
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
