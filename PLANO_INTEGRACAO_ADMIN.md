# Plano de Integração - Admin Dashboard

## 📊 Análise do Código Atual

### Estado Atual (Mockado)

O `AdminDashboard.tsx` possui **4 abas** com dados mockados:

#### 1. **Alunos (Students)** 🎯 PRIORIDADE
- **Linhas**: 30-34, 145-298
- **Mock**: Array com 3 alunos hardcoded
- **Operações**:
  - ✅ Listar alunos
  - ✅ Adicionar aluno (dialog)
  - ✅ Editar aluno (dialog)
  - ❌ Deletar aluno (não implementado)
  - ❌ Aprovar/Rejeitar aluno pendente
- **Campos**:
  ```typescript
  {
    id: number,
    name: string,
    birthDate: string,
    email?: string,
    celular?: string,
    kyu: number,
    location: string,
    status: "active" | "pending"
  }
  ```

#### 2. **Materiais (Materials)**
- **Linhas**: 56-62, 300-444
- **Mock**: Array vazio (será populado dinamicamente)
- **Operações**: Adicionar, Editar, Remover
- **Tipos**: kihon, kata, theory, bunkai

#### 3. **Locais (Locations)**
- **Linhas**: 36-47, 446-618
- **Mock**: Array com 2 locais + imagens
- **Operações**: Adicionar (TODO), Editar, Gerenciar fotos

#### 4. **Senseis**
- **Linhas**: 78-106, 620-749
- **Armazenamento**: localStorage
- **Status**: ⚠️ Não precisa migrar (já usa localStorage)

---

## 🎯 FOCO: Integração de Alunos

### Problemas Identificados

1. **❌ Tipos incompatíveis**:
   - Frontend: `id: number`, `birthDate: string`, `celular: string`
   - Backend: `id: string` (MongoDB ObjectId), não tem `birthDate` nem `celular`

2. **❌ Campos ausentes no backend**:
   - `birthDate` - não existe no model
   - `celular` - não existe no model

3. **❌ Funcionalidades faltando**:
   - Aprovar/Rejeitar alunos pendentes
   - Deletar aluno
   - Filtrar por status

4. **❌ Estado local**: Tudo em `useState`, sem sincronização com backend

---

## 📋 PLANO DE AÇÃO

### **Fase 1: Ajustes no Backend** ⚙️

#### 1.1. Atualizar Model Student
**Arquivo**: `server/models/Student.ts`

Adicionar campos faltantes:
```typescript
export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  birthDate?: Date;        // 🆕 NOVO
  phone?: string;           // 🆕 NOVO (renomear de celular)
  kyu: number;
  location: string;
  status: 'active' | 'pending' | 'inactive';
}
```

#### 1.2. Atualizar Seed
**Arquivo**: `server/scripts/seed.ts`

Adicionar campo `birthDate` e `phone` aos alunos de teste.

---

### **Fase 2: Atualizar Types Frontend** 📝

#### 2.1. Sincronizar Tipos
**Arquivo**: `src/types/index.ts`

Atualizar interface `Student` para incluir:
```typescript
export interface Student {
  id: string;              // ⚠️ Mudou de number para string
  userId: string;
  name: string;
  email: string;
  birthDate?: string;      // 🆕 ISO date string
  phone?: string;          // 🆕 Renomeado de celular
  kyu: number;
  location: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}
```

---

### **Fase 3: Integrar AdminDashboard - Alunos** 🔗

#### 3.1. Imports e Hooks
```typescript
import { studentsService } from '@/services';
import type { Student } from '@/types';
import { useToast } from '@/hooks/use-toast';
```

#### 3.2. Substituir Estado Local por Chamadas API

**Carregar alunos no mount:**
```typescript
const [students, setStudents] = useState<Student[]>([]);
const [loading, setLoading] = useState(true);
const { toast } = useToast();

useEffect(() => {
  loadStudents();
}, []);

const loadStudents = async () => {
  try {
    setLoading(true);
    const data = await studentsService.getAll();
    setStudents(data);
  } catch (error: any) {
    toast({
      title: "Erro ao carregar alunos",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
```

#### 3.3. Implementar Operações CRUD

**Adicionar Aluno:**
```typescript
const handleAddStudent = async () => {
  try {
    const newStudent = await studentsService.create({
      userId: user!.id, // Admin criando
      ...studentForm,
    });
    setStudents([...students, newStudent]);
    setIsAddStudentOpen(false);
    toast({ title: "Aluno adicionado com sucesso!" });
  } catch (error: any) {
    toast({
      title: "Erro ao adicionar aluno",
      description: error.message,
      variant: "destructive",
    });
  }
};
```

**Editar Aluno:**
```typescript
const handleEditStudent = async () => {
  if (!editingStudent) return;
  try {
    const updated = await studentsService.update(editingStudent.id, studentForm);
    setStudents(students.map(s => s.id === updated.id ? updated : s));
    setIsEditStudentOpen(false);
    toast({ title: "Aluno atualizado com sucesso!" });
  } catch (error: any) {
    toast({
      title: "Erro ao atualizar aluno",
      description: error.message,
      variant: "destructive",
    });
  }
};
```

**Deletar Aluno (NOVO):**
```typescript
const handleDeleteStudent = async (id: string) => {
  if (!confirm('Tem certeza que deseja remover este aluno?')) return;
  try {
    await studentsService.delete(id);
    setStudents(students.filter(s => s.id !== id));
    toast({ title: "Aluno removido com sucesso!" });
  } catch (error: any) {
    toast({
      title: "Erro ao remover aluno",
      description: error.message,
      variant: "destructive",
    });
  }
};
```

**Aprovar Aluno (NOVO):**
```typescript
const handleApproveStudent = async (id: string) => {
  try {
    const updated = await studentsService.approveStudent(id);
    setStudents(students.map(s => s.id === updated.id ? updated : s));
    toast({ title: "Aluno aprovado!" });
  } catch (error: any) {
    toast({
      title: "Erro ao aprovar aluno",
      description: error.message,
      variant: "destructive",
    });
  }
};
```

#### 3.4. Ajustar UI

**Adicionar coluna de Ações:**
```tsx
<TableCell>
  <div className="flex gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleEdit(student)}
    >
      Editar
    </Button>

    {student.status === 'pending' && (
      <Button
        variant="default"
        size="sm"
        onClick={() => handleApproveStudent(student.id)}
      >
        Aprovar
      </Button>
    )}

    <Button
      variant="destructive"
      size="sm"
      onClick={() => handleDeleteStudent(student.id)}
    >
      Remover
    </Button>
  </div>
</TableCell>
```

**Loading State:**
```tsx
{loading ? (
  <TableRow>
    <TableCell colSpan={6} className="text-center">
      Carregando alunos...
    </TableCell>
  </TableRow>
) : students.length === 0 ? (
  <TableRow>
    <TableCell colSpan={6} className="text-center">
      Nenhum aluno cadastrado
    </TableCell>
  </TableRow>
) : (
  students.map((student) => (
    // ... row content
  ))
)}
```

---

### **Fase 4: Melhorias UX** ✨

#### 4.1. Filtros
Adicionar tabs para filtrar alunos:
```tsx
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">Todos ({students.length})</TabsTrigger>
    <TabsTrigger value="active">
      Ativos ({students.filter(s => s.status === 'active').length})
    </TabsTrigger>
    <TabsTrigger value="pending">
      Pendentes ({students.filter(s => s.status === 'pending').length})
    </TabsTrigger>
  </TabsList>
</Tabs>
```

#### 4.2. Busca
```tsx
const [searchTerm, setSearchTerm] = useState('');
const filteredStudents = students.filter(s =>
  s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  s.email?.toLowerCase().includes(searchTerm.toLowerCase())
);
```

#### 4.3. Confirmações
- AlertDialog para deletar
- Toast para feedback de sucesso/erro

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### Backend
- [ ] Atualizar `Student` model (birthDate, phone)
- [ ] Atualizar seed com novos campos
- [ ] Testar endpoints com novos campos

### Frontend - Types
- [ ] Atualizar interface `Student` em `src/types/index.ts`
- [ ] Mudar `id` de `number` para `string`
- [ ] Renomear `celular` para `phone`

### Frontend - AdminDashboard
- [ ] Importar `studentsService` e types
- [ ] Implementar `loadStudents()` no useEffect
- [ ] Implementar `handleAddStudent()` com API
- [ ] Implementar `handleEditStudent()` com API
- [ ] Implementar `handleDeleteStudent()` (NOVO)
- [ ] Implementar `handleApproveStudent()` (NOVO)
- [ ] Adicionar loading states
- [ ] Adicionar error handling com toast
- [ ] Adicionar botão "Remover" na UI
- [ ] Adicionar botão "Aprovar" para pendentes
- [ ] Ajustar formulário (celular → phone)

### Melhorias (Opcional)
- [ ] Adicionar filtros (Todos/Ativos/Pendentes)
- [ ] Adicionar busca por nome/email
- [ ] Adicionar paginação (se muitos alunos)
- [ ] Adicionar AlertDialog para confirmação de delete

---

## 🧪 TESTES

### Cenários para Testar

1. **Listar Alunos**
   - ✓ Carregar alunos do banco
   - ✓ Exibir loading
   - ✓ Exibir mensagem se vazio

2. **Adicionar Aluno**
   - ✓ Criar novo aluno
   - ✓ Validar campos obrigatórios
   - ✓ Exibir toast de sucesso
   - ✓ Adicionar na lista local

3. **Editar Aluno**
   - ✓ Carregar dados no form
   - ✓ Atualizar no backend
   - ✓ Atualizar na lista local

4. **Aprovar Aluno**
   - ✓ Mudar status de pending → active
   - ✓ Atualizar UI
   - ✓ Exibir feedback

5. **Deletar Aluno**
   - ✓ Confirmar ação
   - ✓ Remover do banco
   - ✓ Remover da lista local

---

## 🚀 PRÓXIMAS ETAPAS

Após concluir Alunos, seguir mesma estratégia para:

1. **Materiais** (Fase 5)
2. **Locais** (Fase 6)
3. **Senseis** (já funciona com localStorage, baixa prioridade)

---

## 📚 Referências

- [Services Integration Guide](./docs/SERVICES_INTEGRATION.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [MongoDB Setup](./docs/MONGODB_SETUP.md)

---

**Tempo Estimado**: 2-3 horas
**Complexidade**: Média
**Impacto**: Alto (funcionalidade core do admin)
