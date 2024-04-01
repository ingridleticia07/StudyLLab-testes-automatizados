document.addEventListener('DOMContentLoaded', (event) => {
    // Selecionar todos os checkboxes quando o checkbox do cabeçalho é marcado
    const selectAllCheckbox = document.getElementById('select-all');
    selectAllCheckbox.addEventListener('change', function() {
      const userCheckboxes = document.querySelectorAll('.user-table tbody input[type="checkbox"]');
      userCheckboxes.forEach((checkbox) => {
        checkbox.checked = this.checked;
      });
    });
  });


