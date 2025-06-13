const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

class ApiService {
  constructor() {
    // Simulamos um storage local para persistir dados entre sessões
    this.localHabits = [];
    this.nextId = 1;
    this.hasInitialized = false; // Flag para controlar inicialização
    this.useDefaultHabits = true; // Flag para controlar se deve usar hábitos padrão
  }

  // Simula buscar dados da API e mescla com dados locais
  async getTasks() {
    try {
      // Se já inicializou, sempre retorna apenas os hábitos locais atuais
      if (this.hasInitialized) {
        console.log('Retornando hábitos locais existentes:', this.localHabits.length);
        return [...this.localHabits];
      }

      // Primeira inicialização - verifica se já tem hábitos locais
      if (this.localHabits.length === 0) {
        console.log('Primeira inicialização - carregando hábitos iniciais');
        
        try {
          const response = await fetch(`${API_BASE_URL}/posts?_limit=5`);
          if (response.ok) {
            const apiData = await response.json();
            
            // Converte posts em hábitos fictícios apenas na primeira vez
            const apiHabits = apiData.map(post => ({
              id: `api_${post.id}`,
              title: this.generateHabitName(post.id),
              description: post.title.substring(0, 50) + '...',
              completed: Math.random() > 0.5,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              source: 'api'
            }));

            // Define os hábitos iniciais (não adiciona, substitui)
            this.localHabits = apiHabits;
            console.log('Hábitos iniciais carregados da API:', apiHabits.length);
          }
        } catch (apiError) {
          console.log('API indisponível, usando hábitos padrão');
          
          // Fallback: hábitos padrão apenas na primeira inicialização
          const defaultHabits = [
            {
              id: 'default_1',
              title: 'Meditar',
              description: 'Praticar meditação diária por 10 minutos',
              completed: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              source: 'default'
            },
            {
              id: 'default_2',
              title: 'Exercitar-se',
              description: 'Fazer exercícios físicos por 30 minutos',
              completed: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              source: 'default'
            },
            {
              id: 'default_3',
              title: 'Ler',
              description: 'Ler pelo menos 20 páginas de um livro',
              completed: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              source: 'default'
            }
          ];
          
          // Define os hábitos padrão (não adiciona, substitui)
          this.localHabits = defaultHabits;
        }
      }
      
      this.hasInitialized = true;
      console.log('Retornando todos os hábitos:', this.localHabits.length);
      return [...this.localHabits];
      
    } catch (error) {
      console.error('Erro ao buscar hábitos:', error);
      return [...this.localHabits];
    }
  }

  // Gera nomes de hábitos baseados no ID
  generateHabitName(id) {
    const habitNames = [
      'Beber água', 'Meditar', 'Exercitar-se', 'Ler', 'Estudar',
      'Praticar gratidão', 'Dormir cedo', 'Caminhar', 'Escrever',
      'Tocar instrumento', 'Praticar idioma', 'Fazer yoga'
    ];
    return habitNames[id % habitNames.length];
  }

  // Simula criação de hábito
  async createTask(task) {
    try {
      // Cria hábito local
      const newHabit = {
        id: `local_${this.nextId++}`,
        title: task.title,
        description: task.description || '',
        completed: task.completed || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'local'
      };

      // Adiciona aos hábitos locais
      this.localHabits.push(newHabit);
      this.useDefaultHabits = false; // Usuário está criando seus próprios hábitos
      
      console.log('Hábito criado:', newHabit);
      return newHabit;
      
    } catch (error) {
      console.error('Erro ao criar hábito:', error);
      throw error;
    }
  }

  // Simula atualização de hábito
  async updateTask(id, updates) {
    try {
      // Encontra e atualiza o hábito nos dados locais
      const habitIndex = this.localHabits.findIndex(h => h.id === id);
      if (habitIndex !== -1) {
        this.localHabits[habitIndex] = {
          ...this.localHabits[habitIndex],
          title: updates.title || this.localHabits[habitIndex].title,
          description: updates.description || this.localHabits[habitIndex].description,
          completed: updates.completed !== undefined ? updates.completed : this.localHabits[habitIndex].completed,
          updatedAt: new Date().toISOString(),
        };
        
        console.log('Hábito atualizado:', this.localHabits[habitIndex]);
        return this.localHabits[habitIndex];
      }

      throw new Error('Hábito não encontrado');
      
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error);
      throw error;
    }
  }

  // Simula deleção de hábito
  async deleteTask(id) {
    try {
      const initialLength = this.localHabits.length;
      
      // Remove dos hábitos locais
      this.localHabits = this.localHabits.filter(h => h.id !== id);
      
      const wasDeleted = this.localHabits.length < initialLength;
      
      if (wasDeleted) {
        console.log('Hábito deletado:', id, 'Restam:', this.localHabits.length);
        
        // Se não há mais hábitos, permite que fique vazio
        if (this.localHabits.length === 0) {
          this.useDefaultHabits = false;
          console.log('Todos os hábitos foram deletados - lista vazia permitida');
        }
        
        return { success: true };
      } else {
        throw new Error('Hábito não encontrado para deletar');
      }
      
    } catch (error) {
      console.error('Erro ao deletar hábito:', error);
      throw error;
    }
  }

  // Método para testar conectividade
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/1`);
      return response.ok;
    } catch (error) {
      console.error('Teste de conexão falhou:', error);
      return false;
    }
  }

  // Método para obter estatísticas BASEADAS NOS DADOS REAIS
  async getStatistics() {
    try {
      const habits = this.localHabits; // Usa dados locais reais
      const total = habits.length;
      const completed = habits.filter(h => h.completed).length;
      const pending = total - completed;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      // Calcula estatísticas baseadas nos dados reais
      const today = new Date();
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const habitsThisWeek = habits.filter(habit => {
        const habitDate = new Date(habit.updatedAt || habit.createdAt);
        return habitDate >= oneWeekAgo && habit.completed;
      }).length;

      // Calcula streak baseado nos hábitos completados
      let streak = 0;
      const completedHabits = habits.filter(h => h.completed);
      if (completedHabits.length > 0) {
        // Simula um streak baseado na proporção de hábitos completados
        streak = Math.floor(completionRate / 10); // 1 dia de streak para cada 10% de conclusão
      }

      const stats = {
        total,
        completed,
        pending,
        completionRate,
        habitsThisWeek,
        streak: Math.max(streak, completedHabits.length > 0 ? 1 : 0)
      };

      console.log('Estatísticas calculadas:', stats);
      return stats;
      
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        total: 0,
        completed: 0,
        pending: 0,
        completionRate: 0,
        habitsThisWeek: 0,
        streak: 0,
      };
    }
  }

  // Método para resetar todos os dados (útil para testes)
  resetData() {
    this.localHabits = [];
    this.hasInitialized = false;
    this.useDefaultHabits = true;
    this.nextId = 1;
    console.log('Dados do ApiService resetados');
  }
}

export default new ApiService();