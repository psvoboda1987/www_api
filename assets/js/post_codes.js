const data = await fetch('assets/data/post_codes.json')
    .then(data => data.json())

let table = $('#myTable').DataTable({
    data: data,
    columns: [
        { data: 'city', searchable: true },
        { data: 'zip', searchable: true },
        { data: 'county' },
        { data: 'region' }
    ],
    fixedHeader: true,
    initComplete: function () {
        var select = $('#countyFilter');
        var column = this.api().column(2);
        column.data().unique().sort().each(function (d, j) {
            select.append('<option value="' + d + '">' + d + '</option>');
        });

        var select = $('#regionFilter');
        var column = this.api().column(3);
        column.data().unique().sort().each(function (d, j) {
            select.append('<option value="' + d + '">' + d + '</option>');
        });
    }
});

$('#factFilter').on('change', function () {
    var val = $(this).val();
    table.column(2)
        .search(val ? '^' + val + '$' : '', true, false)
        .draw();
});

$('#regionFilter').on('change', function () {
    var val = $(this).val();
    table.column(3)
        .search(val ? '^' + val + '$' : '', true, false)
        .draw();
});

$('#factFilter').on('click', function (e) {
    e.stopPropagation();
});

$('#regionFilter').on('click', function (e) {
    e.stopPropagation();
});