# Guia de Integração com Services

Este documento explica como usar os services para integrar o frontend com o backend.

## 📁 Estrutura

```
src/
├── types/
│   └── index.ts          # Tipos compartilhados (espelhados do backend)
├── services/
│   ├── api.ts            # Configuração base e utils
│   ├── auth.ts           # Serviço de autenticação
│   ├── students.ts       # Serviço de alunos
│   ├── materials.ts      # Serviço de materiais
│   ├── locations.ts      # Serviço de locais
│   ├── senseis.ts        # Serviço de senseis
│   ├── contacts.ts       # Serviço de contatos
│   └── index.ts          # Export central
```

## 🎯 Tipagem Compartilhada

Os tipos em `src/types/index.ts` espelham os models do backend, garantindo type-safety:

```typescript
import type { User, Student, Material, Location } from '@/types';
```

## 🔐 Autenticação

O serviço de autenticação já está integrado no `AuthContext`:

```typescript
import { authService } from '@/services';

// Login
const response = await authService.login({ email, password });
// Token é salvo automaticamente no localStorage

// Register
const response = await authService.register({ name, email, password, location });

// Logout
await authService.logout();
// Remove token e limpa localStorage
```

## 📚 Usando Services nos Componentes

### Exemplo 1: Listar Alunos (Admin Dashboard)

```typescript
import { useEffect, useState } from 'react';
import { studentsService } from '@/services';
import type { Student } from '@/types';

function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentsService.getAll();
        setStudents(data);
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {students.map(student => (
        <div key={student.id}>
          <h3>{student.name}</h3>
          <p>Kyu: {student.kyu}</p>
          <p>Local: {student.location}</p>
        </div>
      ))}
    </div>
  );
}
```

### Exemplo 2: Aprovar Aluno

```typescript
import { studentsService } from '@/services';

async function handleApprove(studentId: string) {
  try {
    await studentsService.approveStudent(studentId);
    // Atualizar lista
    alert('Aluno aprovado!');
  } catch (error) {
    alert('Erro ao aprovar aluno');
  }
}
```

### Exemplo 3: Criar Material (Admin)

```typescript
import { materialsService } from '@/services';
import type { Material } from '@/types';

async function handleCreateMaterial(data: Partial<Material>) {
  try {
    const newMaterial = await materialsService.create({
      title: data.title,
      type: data.type,
      description: data.description,
      video_url: data.video_url,
      min_kyu: data.min_kyu,
    });

    alert('Material criado!');
    return newMaterial;
  } catch (error) {
    alert('Erro ao criar material');
  }
}
```

### Exemplo 4: Listar Locais (Gallery)

```typescript
import { useEffect, useState } from 'react';
import { locationsService } from '@/services';
import type { Location } from '@/types';

function Gallery() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationsService.getAll();
        setLocations(data);
      } catch (error) {
        console.error('Erro ao carregar locais:', error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div>
      {locations.map(location => (
        <div key={location.id}>
          <h2>{location.name}</h2>
          <p>{location.description}</p>
          {location.images.map((img, idx) => (
            <img key={idx} src={img.image_url} alt={img.caption} />
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Exemplo 5: Formulário de Contato

```typescript
import { useState } from 'react';
import { contactsService } from '@/services';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await contactsService.create(formData);
      alert(response.message || 'Mensagem enviada!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Erro ao enviar mensagem');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Nome"
      />
      {/* ... outros campos ... */}
      <button type="submit">Enviar</button>
    </form>
  );
}
```

### Exemplo 6: Filtrar Materiais por Kyu

```typescript
import { materialsService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

function StudentMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!user?.kyu) return;

      // Buscar materiais disponíveis para o kyu do aluno
      const data = await materialsService.getAll({
        min_kyu: user.kyu
      });

      setMaterials(data);
    };

    fetchMaterials();
  }, [user]);

  // ...
}
```

## 🛡️ Tratamento de Erros

Os services usam a classe `ApiError` que contém status e mensagem:

```typescript
import { ApiError } from '@/services';

try {
  await studentsService.create(data);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Não autorizado - redirecionar para login
      navigate('/login');
    } else if (error.status === 403) {
      // Sem permissão
      alert('Você não tem permissão para esta ação');
    } else {
      alert(error.message);
    }
  } else {
    alert('Erro desconhecido');
  }
}
```

## 🔄 React Query (Recomendado)

Para melhor gerenciamento de cache e estado, considere usar React Query:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsService } from '@/services';

// Query para listar
function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => studentsService.getAll(),
  });
}

// Mutation para criar
function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => studentsService.create(data),
    onSuccess: () => {
      // Invalidar cache e recarregar
      queryClient.invalidateQueries(['students']);
    },
  });
}

// Uso no componente
function StudentsList() {
  const { data: students, isLoading } = useStudents();
  const createMutation = useCreateStudent();

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      {students?.map(student => (
        <div key={student.id}>{student.name}</div>
      ))}
      <button onClick={() => createMutation.mutate({ /* data */ })}>
        Criar Aluno
      </button>
    </div>
  );
}
```

## 🎨 Padrões de Uso

### 1. Loading States

```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await service.doSomething();
  } catch (error) {
    // handle error
  } finally {
    setLoading(false);
  }
};
```

### 2. Toast Notifications

```typescript
import { toast } from '@/hooks/use-toast';

try {
  await studentsService.create(data);
  toast({
    title: "Sucesso!",
    description: "Aluno criado com sucesso",
  });
} catch (error) {
  toast({
    title: "Erro",
    description: error.message,
    variant: "destructive",
  });
}
```

### 3. Refresh após Mutação

```typescript
const [students, setStudents] = useState([]);

const refreshStudents = async () => {
  const data = await studentsService.getAll();
  setStudents(data);
};

const handleCreate = async (data) => {
  await studentsService.create(data);
  await refreshStudents(); // Recarrega lista
};
```

## 📝 Checklist de Migração

Para cada página/componente que usa mocks:

- [ ] Identificar quais dados são usados
- [ ] Importar o service correspondente e types
- [ ] Substituir mocks por chamadas ao service
- [ ] Adicionar loading states
- [ ] Adicionar error handling
- [ ] Testar funcionalidade
- [ ] Remover código de mock

## 🎯 Próximos Arquivos para Atualizar

1. **AdminDashboard.tsx** - Listar e aprovar alunos
2. **StudentDashboard.tsx** - Listar materiais do aluno
3. **Home.tsx** - Listar senseis
4. **Gallery.tsx** - Listar locais
5. **Contact.tsx** - Enviar mensagem de contato

## 🔗 Recursos

- [API Documentation](./API_DOCUMENTATION.md)
- [MongoDB Setup](./MONGODB_SETUP.md)
- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
