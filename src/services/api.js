// CONFIGURAÇÃO JSONBIN.IO
const JSONBIN_CONFIG = {
  // SUBSTITUA PELOS SEUS DADOS:
  API_KEY: '$2a$10$Ank97z3FRd0EvxdVMMykNeNe3wcvSZANQCFnCV0s9KX66MjTxNIDa', // Sua Master Key da JSONBin.io
  BIN_ID: '684c3f258561e97a5023ad64', // ID do seu bin criado
  BASE_URL: 'https://api.jsonbin.io/v3'
};

class ApiService {
  constructor() {
    this.isOnline = true;
    this.localCache = [];
  }

  // Headers para requisições JSONBin.io
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_CONFIG.API_KEY,
      'X-Bin-Meta': 'false' // Remove metadados da resposta
    };
  }

  // Buscar todos os hábitos
  async getTasks() {
    try {
      console.log('🔄 Buscando hábitos da JSONBin.io...');
      
      const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/b/${JSONBIN_CONFIG.BIN_ID}/latest`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // JSONBin.io retorna os dados diretamente
      const habits = Array.isArray(data) ? data : data.habits || [];
      
      this.localCache = habits;
      this.isOnline = true;
      
      console.log('✅ Hábitos carregados da API:', habits.length);
      return habits;

    } catch (error) {
      console.error('❌ Erro ao buscar hábitos:', error);
      this.isOnline = false;
      
      // Retorna cache local se API falhar
      if (this.localCache.length > 0) {
        console.log('📱 Usando cache local:', this.localCache.length);
        return this.localCache;
      }
      
      // Fallback: dados iniciais
      const defaultHabits = [
        {
          id: '1',
          name: 'Meditar',
          description: 'Praticar meditação diária por 10 minutos',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Exercitar-se',
          description: 'Fazer exercícios físicos por 30 minutos',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Ler',
          description: 'Ler pelo menos 20 páginas de um livro',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      this.localCache = defaultHabits;
      return defaultHabits;
    }
  }

  // Salvar todos os hábitos (sobrescreve o bin)
  async saveAllTasks(habits) {
    try {
      console.log('💾 Salvando hábitos na JSONBin.io...');
      
      const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/b/${JSONBIN_CONFIG.BIN_ID}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(habits)
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      this.localCache = habits;
      this.isOnline = true;
      
      console.log('✅ Hábitos salvos na API com sucesso');
      return result;

    } catch (error) {
      console.error('❌ Erro ao salvar hábitos:', error);
      this.isOnline = false;
      throw error;
    }
  }

  // Criar novo hábito
  async createTask(taskData) {
    try {
      // Busca hábitos atuais
      const currentHabits = await this.getTasks();
      
      // Gera novo ID
      const newId = Date.now().toString();
      
      // Cria novo hábito
      const newHabit = {
        id: newId,
        name: taskData.title || taskData.name,
        description: taskData.description || '',
        completed: taskData.completed || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Adiciona à lista
      const updatedHabits = [...currentHabits, newHabit];
      
      // Salva na API
      await this.saveAllTasks(updatedHabits);
      
      console.log('✅ Hábito criado:', newHabit.name);
      return newHabit;

    } catch (error) {
      console.error('❌ Erro ao criar hábito:', error);
      throw error;
    }
  }

  // Atualizar hábito existente
  async updateTask(id, updates) {
    try {
      // Busca hábitos atuais
      const currentHabits = await this.getTasks();
      
      // Encontra o hábito
      const habitIndex = currentHabits.findIndex(h => h.id === id);
      if (habitIndex === -1) {
        throw new Error('Hábito não encontrado');
      }

      // Atualiza o hábito
      const updatedHabit = {
        ...currentHabits[habitIndex],
        name: updates.name || updates.title || currentHabits[habitIndex].name,
        description: updates.description || currentHabits[habitIndex].description,
        completed: updates.completed !== undefined ? updates.completed : currentHabits[habitIndex].completed,
        updatedAt: new Date().toISOString()
      };

      // Substitui na lista
      const updatedHabits = [...currentHabits];
      updatedHabits[habitIndex] = updatedHabit;
      
      // Salva na API
      await this.saveAllTasks(updatedHabits);
      
      console.log('✅ Hábito atualizado:', updatedHabit.name);
      return updatedHabit;

    } catch (error) {
      console.error('❌ Erro ao atualizar hábito:', error);
      throw error;
    }
  }

  // Deletar hábito
  async deleteTask(id) {
    try {
      // Busca hábitos atuais
      const currentHabits = await this.getTasks();
      
      // Remove o hábito
      const updatedHabits = currentHabits.filter(h => h.id !== id);
      
      if (updatedHabits.length === currentHabits.length) {
        throw new Error('Hábito não encontrado');
      }
      
      // Salva na API
      await this.saveAllTasks(updatedHabits);
      
      console.log('✅ Hábito deletado:', id);
      return { success: true };

    } catch (error) {
      console.error('❌ Erro ao deletar hábito:', error);
      throw error;
    }
  }

  // Obter estatísticas
  async getStatistics() {
    try {
      const habits = await this.getTasks();
      const total = habits.length;
      const completed = habits.filter(h => h.completed).length;
      const pending = total - completed;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      // Calcula hábitos da semana
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const habitsThisWeek = habits.filter(habit => {
        const habitDate = new Date(habit.updatedAt || habit.createdAt);
        return habitDate >= oneWeekAgo && habit.completed;
      }).length;

      // Calcula streak simples
      const streak = completed > 0 ? Math.floor(completionRate / 20) || 1 : 0;

      return {
        total,
        completed,
        pending,
        completionRate,
        habitsThisWeek,
        streak
      };

    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      return {
        total: 0,
        completed: 0,
        pending: 0,
        completionRate: 0,
        habitsThisWeek: 0,
        streak: 0
      };
    }
  }

  // Testar conexão
  async testConnection() {
    try {
      const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/b/${JSONBIN_CONFIG.BIN_ID}/latest`, {
        method: 'HEAD',
        headers: this.getHeaders()
      });
      
      this.isOnline = response.ok;
      return response.ok;
    } catch (error) {
      this.isOnline = false;
      return false;
    }
  }

  // Status da conexão
  getConnectionStatus() {
    return {
      isOnline: this.isOnline,
      hasCache: this.localCache.length > 0
    };
  }
}

export default new ApiService();