
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

class ApiService {
  constructor() {
    // Simulamos um storage local para persistir dados entre sessões
    this.localHabits = [];
    this.nextId = 1;
  }

  // Simula buscar dados da API e mescla com dados locais
  async getTasks() {
    try {
      // Busca posts do JSONPlaceholder para simular hábitos
      const response = await fetch(`${API_BASE_URL}/posts?_limit=5`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData = await response.json();
      
      // Converte posts em hábitos fictícios
      const apiHabits = apiData.map(post => ({
        id: `api_${post.id}`,
        title: this.generateHabitName(post.id),
        description: post.title.substring(0, 50) + '...',
        completed: Math.random() > 0.5, // Status aleatório
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'api'
      }));

      // Mescla dados da API com dados locais
      const allHabits = [...apiHabits, ...this.localHabits];
      
      console.log('Hábitos carregados da API:', allHabits.length);
      return allHabits;
      
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      
      // Fallback: retorna dados locais + alguns hábitos padrão
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
      
      return [...defaultHabits, ...this.localHabits];
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
      // Simula chamada para API
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          title: task.title,
          body: task.description,
          userId: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      // Cria hábito local baseado na resposta
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
      
      console.log('Hábito criado:', newHabit);
      return newHabit;
      
    } catch (error) {
      console.error('Erro ao criar hábito:', error);
      
      // Fallback: cria localmente mesmo se a API falhar
      const newHabit = {
        id: `local_${this.nextId++}`,
        title: task.title,
        description: task.description || '',
        completed: task.completed || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'local'
      };

      this.localHabits.push(newHabit);
      return newHabit;
    }
  }

  // Simula atualização de hábito
  async updateTask(id, updates) {
    try {
      // Se for um hábito da API, simula a atualização
      if (id.startsWith('api_')) {
        const response = await fetch(`${API_BASE_URL}/posts/${id.replace('api_', '')}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            id: id.replace('api_', ''),
            title: updates.title,
            body: updates.description,
            userId: 1,
          }),
        });

        if (response.ok) {
          console.log('Hábito da API atualizado (simulado)');
        }
      }

      // Para hábitos locais, atualiza diretamente
      const habitIndex = this.localHabits.findIndex(h => h.id === id);
      if (habitIndex !== -1) {
        this.localHabits[habitIndex] = {
          ...this.localHabits[habitIndex],
          title: updates.title || this.localHabits[habitIndex].title,
          description: updates.description || this.localHabits[habitIndex].description,
          completed: updates.completed !== undefined ? updates.completed : this.localHabits[habitIndex].completed,
          updatedAt: new Date().toISOString(),
        };
        
        console.log('Hábito local atualizado:', this.localHabits[habitIndex]);
        return this.localHabits[habitIndex];
      }

      // Retorna dados atualizados
      const updatedHabit = {
        id,
        title: updates.title,
        description: updates.description,
        completed: updates.completed,
        updatedAt: new Date().toISOString(),
      };

      return updatedHabit;
      
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error);
      throw error;
    }
  }

  // Simula deleção de hábito
  async deleteTask(id) {
    try {
      // Se for um hábito da API, simula a deleção
      if (id.startsWith('api_')) {
        const response = await fetch(`${API_BASE_URL}/posts/${id.replace('api_', '')}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log('Hábito da API deletado (simulado)');
        }
      }

      // Remove dos hábitos locais se existir
      this.localHabits = this.localHabits.filter(h => h.id !== id);
      
      console.log('Hábito deletado:', id);
      return { success: true };
      
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

  // Método para obter estatísticas
  async getStatistics() {
    try {
      const habits = await this.getTasks();
      const total = habits.length;
      const completed = habits.filter(h => h.completed).length;
      const pending = total - completed;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        total,
        completed,
        pending,
        completionRate,
        habitsThisWeek: Math.min(total, 7), // Simula hábitos da semana
        streak: Math.floor(Math.random() * 10) + 1, // Streak simulado
      };
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
}

export default new ApiService();