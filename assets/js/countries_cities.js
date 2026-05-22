const data = await fetch('assets/data/countries.json')
    .then(data => data.json())

let table = $('#myTable').DataTable({
    data: data,
    columns: [
        { data: 'country' },
        { data: 'capital' }
    ],
    fixedHeader: true,
});
