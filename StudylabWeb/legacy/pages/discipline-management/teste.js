document.addEventListener('DOMContentLoaded', function() {
    const modalExc = document.getElementById("modal-excluir");
    const modalEditar = document.getElementById("modal-editar");
    const modalAdicionar = document.getElementById("modal-adicionar");
    const modalConfirmacao = document.getElementById("modalConfirmacao");
    const cadastrarBtn = document.getElementById('cadastrar-btn');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    let currentRow = null;
    let currentPage = 1;
    const itemsPerPage = 8;

    const disciplines = [
        {codigo: 'CC 1 de Lógica', nome: 'Lógica para computação', professor: 'Alicia Santos', curso: 'CC', alunos: 40},
        {codigo: 'CC 2 de Lógica', nome: 'Lógica para computação', professor: 'Alicia Santos', curso: 'CC', alunos: 40},
        {codigo: 'CC 3 de Lógica', nome: 'Lógica para computação', professor: 'Alicia Santos', curso: 'CC', alunos: 40},
        {codigo: 'CC 4 de Lógica', nome: 'Lógica para computação', professor: 'Alicia Santos', curso: 'CC', alunos: 40},
        {codigo: 'CC 5 de Lógica', nome: 'Lógica para computação', professor: 'Alicia Santos', curso: 'CC', alunos: 40},
        {codigo: 'CC 6 de Lógica', nome: 'Lógica para computação', professor: 'Alicia Santos', curso: 'CC', alunos: 40},
        {codigo: 'CC 7 de Lógica', nome: 'Lógica para computação', professor: 'Alicia Santos', curso: 'CC', alunos: 40},
        {codigo: 'CC 8 de Lógica', nome: 'Lógica para computação', professor: 'Alicia Santos', curso: 'CC', alunos: 40},
        {codigo: 'CC 9 de Lógica', nome: 'Lógica para computação', professor: 'Alicia Santos', curso: 'CC', alunos: 40},
        {codigo: 'CC 10 de Lógica', nome: 'Lógica para computação', professor: 'Alicia Santos', curso: 'CC', alunos: 40},
        {codigo: 'CC 11 de Lógica', nome: 'Lógica para computação', professor: 'Alicia Santos', curso: 'CC', alunos: 40},
        {codigo: 'Matemática 1', nome: 'Cálculo I', professor: 'Carlos Mendes', curso: 'Matemática', alunos: 35}
    ];

    function displayTable() {
        const tableBody = document.querySelector('.discipline-table tbody');
        tableBody.innerHTML = '';

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = disciplines.slice(start, end);

        pageItems.forEach((discipline, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" name="content"></td>
                <td>${discipline.codigo}</td>
                <td>${discipline.nome}</td>
                <td>${discipline.professor}</td>
                <td>${discipline.curso}</td>
                <td>${discipline.alunos}</td>
                <td>
                <button class="action-button editar"><img src="../../assets/img/icon-pencil.svg" alt="Editar"></button>
                <button class="action-button deletar"><img src="../../assets/img/icon-delete.svg" alt="Excluir"></button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        const totalPages = Math.ceil(disciplines.length / itemsPerPage);
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;

        document.querySelectorAll('.deletar').forEach(function(botao) {
            botao.addEventListener('click', function() {
                currentRow = this.closest('tr');
                openModal(modalExc);
            });
        });

        document.querySelectorAll('.editar').forEach(function(botao) {
            botao.addEventListener('click', function() {
                currentRow = this.closest('tr');
                openModal(modalEditar);
            });
        });
    }

    function openModal(elemento) {
        elemento.style.display = 'flex';
    }

    function closeModal(elemento) {
        elemento.style.display = 'none';
    }

    cadastrarBtn.addEventListener('click', function() {
        openModal(modalAdicionar);
    });

    document.querySelectorAll('.fechar').forEach(function(botao) {
        botao.addEventListener('click', function() {
            const modal = botao.closest('.modal-container');
            closeModal(modal);
        });
    });

    document.querySelectorAll('.cancelar').forEach(function(botao) {
        botao.addEventListener('click', function() {
            const modal = botao.closest('.modal-container');
            closeModal(modal);
        });
    });

    document.querySelectorAll('.confirmar').forEach(function(botao) {
        botao.addEventListener('click', function() {
            const modal = botao.closest('.modal-container');
            closeModal(modal);
            showModal();
        });
    });

    window.onclick = function(event) {
        if (event.target.classList.contains('modal-container')) {
            closeModal(event.target);
        }
    };

    function showModal() {
        modalConfirmacao.style.animationName = 'slideIn';
        modalConfirmacao.style.display = 'block';

        setTimeout(function() {
            modalConfirmacao.style.animationName = 'slideOf';
            setTimeout(function() {
                modalConfirmacao.style.display = 'none';
            }, 200);
        }, 5000);
    }

    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayTable();
        }
    });

    nextPageBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(disciplines.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayTable();
        }
    });

    displayTable();
});
