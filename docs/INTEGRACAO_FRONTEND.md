# 🔗 Integração Frontend com API

## Como substituir os mocks pela API real

### 1️⃣ **Atualizar AuthContext** (`src/contexts/AuthContext.tsx`)

Substitua o código do login hardcoded pela chamada real à API:

```typescript
const login = async (email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Credenciais inválidas");
    }

    const data = await response.json();

    setToken(data.token);
    setUser(data.user);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
```

---

### 2️⃣ **Criar hook para API** (`src/hooks/useApi.ts`)

```typescript
import { useAuth } from '@/contexts/AuthContext';

export function useApi() {
  const { token } = useAuth();

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`http://localhost:8080${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro na requisição');
    }

    return response.json();
  };

  return {
    get: (endpoint: string) => apiRequest(endpoint),
    post: (endpoint: string, data: any) =>
      apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint: string, data: any) =>
      apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (endpoint: string) =>
      apiRequest(endpoint, { method: 'DELETE' }),
  };
}
```

---

### 3️⃣ **Atualizar AdminDashboard** (`src/pages/AdminDashboard.tsx`)

#### Buscar alunos da API:

```typescript
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';

const AdminDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  // Carregar alunos ao montar o componente
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/students');
      setStudents(data.students);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      toast({ title: 'Erro', description: 'Falha ao carregar alunos' });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar novo aluno
  const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      const data = await api.post('/api/students', studentData);
      setStudents([data.student, ...students]);
      toast({ title: 'Sucesso', description: 'Aluno adicionado!' });
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
      toast({ title: 'Erro', description: 'Falha ao adicionar aluno' });
    }
  };

  // Atualizar aluno
  const handleUpdateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const data = await api.put(`/api/students/${id}`, updates);
      setStudents(students.map(s => s.id === id ? data.student : s));
      toast({ title: 'Sucesso', description: 'Aluno atualizado!' });
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      toast({ title: 'Erro', description: 'Falha ao atualizar aluno' });
    }
  };

  // Deletar aluno
  const handleDeleteStudent = async (id: string) => {
    try {
      await api.delete(`/api/students/${id}`);
      setStudents(students.filter(s => s.id !== id));
      toast({ title: 'Sucesso', description: 'Aluno removido!' });
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      toast({ title: 'Erro', description: 'Falha ao remover aluno' });
    }
  };

  return (
    // ... seu JSX aqui
  );
};
```

---

### 4️⃣ **Atualizar StudentDashboard** (`src/pages/StudentDashboard.tsx`)

```typescript
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState({ kihons: [], katas: [], theory: [] });
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    loadMaterials();
  }, [user]);

  const loadMaterials = async () => {
    try {
      setLoading(true);

      // Buscar materiais adequados ao kyu do aluno
      const kihonData = await api.get(`/api/materials?type=kihon&min_kyu=${user?.kyu || 9}`);
      const kataData = await api.get(`/api/materials?type=kata&min_kyu=${user?.kyu || 9}`);
      const theoryData = await api.get(`/api/materials?type=theory&min_kyu=${user?.kyu || 9}`);

      setMaterials({
        kihons: kihonData.materials,
        katas: kataData.materials,
        theory: theoryData.materials,
      });
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando materiais...</div>;
  }

  return (
    // ... seu JSX aqui
  );
};
```

---

### 5️⃣ **Atualizar Home** (`src/pages/Home.tsx`)

Substituir localStorage por API:

```typescript
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';

const Home = () => {
  const [senseis, setSenseis] = useState<Sensei[]>([]);
  const api = useApi();

  useEffect(() => {
    loadSenseis();
  }, []);

  const loadSenseis = async () => {
    try {
      const data = await api.get('/api/senseis');
      setSenseis(data.senseis);
    } catch (error) {
      console.error('Erro ao carregar senseis:', error);
      // Fallback para dados mock se API falhar
      setSenseis([
        { name: "Sensei Alessandro", rank: "4º Dan - Faixa Preta", description: "..." },
        { name: "Sensei Milena", rank: "2º Dan - Faixa Preta", description: "..." },
        { name: "Sensei Vinicius", rank: "1º Dan - Faixa Preta", description: "..." },
      ]);
    }
  };

  return (
    // ... seu JSX aqui
  );
};
```

---

### 6️⃣ **Atualizar Contact** (`src/pages/Contact.tsx`)

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar mensagem");
    }

    const data = await response.json();

    toast({
      title: "Mensagem enviada!",
      description: data.message,
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
  } catch (error) {
    console.error("Error:", error);
    toast({
      title: "Erro",
      description: "Falha ao enviar mensagem. Tente novamente.",
      variant: "destructive",
    });
  }
};
```

---

## 🎯 Checklist de Migração

- [ ] Criar `src/hooks/useApi.ts`
- [ ] Atualizar `AuthContext.tsx` (login, register, logout)
- [ ] Atualizar `AdminDashboard.tsx` (students CRUD)
- [ ] Atualizar `AdminDashboard.tsx` (materials CRUD)
- [ ] Atualizar `AdminDashboard.tsx` (locations CRUD)
- [ ] Atualizar `AdminDashboard.tsx` (senseis CRUD)
- [ ] Atualizar `StudentDashboard.tsx` (buscar materials)
- [ ] Atualizar `Home.tsx` (buscar senseis)
- [ ] Atualizar `Gallery.tsx` (buscar locations)
- [ ] Atualizar `Contact.tsx` (enviar formulário)

---

## 🧪 Testando

1. Inicie o servidor: `npm run dev`
2. Abra o navegador em `http://localhost:8080`
3. Faça login com:
   - Admin: `adm@email.com` / `1234`
   - Aluno: `aluno@email.com` / `1234`
4. Teste as funcionalidades CRUD no painel admin

---

## 📝 Notas

- As requisições da API são logadas no console do servidor
- Use o hook `useApi` para requisições autenticadas
- Trate erros apropriadamente com try/catch
- Adicione loading states para melhor UX
- Use React Query/TanStack Query para cache e otimização (opcional)

---

## 🚀 Otimizações Futuras

### React Query (recomendado)

```bash
npm install @tanstack/react-query
```

```typescript
// src/hooks/useStudents.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';

export function useStudents() {
  const api = useApi();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.get('/api/students'),
  });

  const createStudent = useMutation({
    mutationFn: (student: any) => api.post('/api/students', student),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    students: data?.students || [],
    isLoading,
    error,
    createStudent: createStudent.mutate,
  };
}
```

Isso adiciona:
- ✅ Cache automático
- ✅ Refetch em background
- ✅ Optimistic updates
- ✅ Retry automático em caso de erro
