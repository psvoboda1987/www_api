const data = await fetch('assets/data/animal_facts.json').then(data => data.json())

let table = $('#myTable').DataTable({
    data: data,
    columns: [
        { data: 'animal' },
        { data: 'fact' }
    ],
    fixedHeader: true,
    initComplete: function () {
        var select = $('#factFilter');
        var column = this.api().column(0);
        column.data().unique().sort().each(function (d, j) {
            select.append('<option value="' + d + '">' + d + '</option>');
        });
    }
});

$('#factFilter').on('change', function () {
    var val = $(this).val();
    table.column(0)
        .search(val ? '^' + val + '$' : '', true, false)
        .draw();
});

$('#factFilter').on('click', function (e) {
    e.stopPropagation();
});