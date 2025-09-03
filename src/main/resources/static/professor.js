document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://localhost:8080/professores';
  const tbody = document.getElementById('professor-tbody');
  const form = document.getElementById('professor-form');
  const professorId = document.getElementById('professor-id');
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const telefoneInput = document.getElementById('telefone');

  // Função para carregar professores
  function carregarprofessores() {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        tbody.innerHTML = '';
        data.forEach(professor => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${professor.nome}</td>
            <td>${professor.email}</td>
            <td>${professor.telefone}</td>
            <td>
              <button class="btn btn-warning btn-sm me-2"
                onclick="editarprofessor(${professor.id}, '${professor.nome}', '${professor.email}', '${professor.telefone}')">
                Editar
              </button>
              <button class="btn btn-danger btn-sm" onclick="excluirprofessor(${professor.id})">
                Excluir
              </button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error('Erro ao buscar professores:', err);
        alert('Erro ao carregar professores.');
      });
  }

  // Função salvar (cadastrar ou atualizar)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const professor = {
      nome: nomeInput.value,
      email: emailInput.value,
      telefone: telefoneInput.value
    };

    if (professorId.value) {
      // Atualizar
      fetch(`${apiUrl}/${professorId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(professor)
      })
      .then(() => {
        alert('professor atualizado com sucesso!');
        form.reset();
        professorId.value = '';
        carregarprofessores();
      });
    } else {
      // Criar
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(professor)
      })
      .then(() => {
        alert('professor cadastrado com sucesso!');
        form.reset();
        carregarprofessores();
      });
    }
  });

  // Expor funções globais
  window.editarprofessor = (id, nome, email, telefone) => {
    professorId.value = id;
    nomeInput.value = nome;
    emailInput.value = email;
    telefoneInput.value = telefone;
  };

  window.excluirprofessor = (id) => {
    if (confirm('Deseja excluir este professor?')) {
      fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
        .then(() => {
          alert('professor excluído!');
          carregarprofessores();
        });
    }
  };

  // Inicializar
  carregarprofessores();
});
