const data = [
    {
        uid: 'uid1',
        name: 'Item 1',
        email: 'item1@example.com',
    },
    {
        uid: 'uid2',
        name: 'Item 2',
        email: 'item2@example.com',
    },
    {
        uid: 'uid3',
        name: 'Item 3',
        email: 'item3@example.com',
    },
    {
        uid: 'uid4',
        name: 'Item 4',
        email: 'item4@example.com',
    },
    {
        uid: 'uid5',
        name: 'Item 5',
        email: 'item5@example.com',
    },
];

const App = () => {
    const saveAsExcel = async () => {
        const { Workbook } = await import('exceljs');
        const { saveAs } = await import('file-saver');

        const wb = new Workbook();

        const ws = wb.addWorksheet('my-worksheet');

        ws.columns = Object.keys(data[0]).map((key) => ({
            header: key,
            key,
            width: 20,
        }));

        data.forEach((row) => {
            ws.addRow(row);
        });

        const buf = await wb.xlsx.writeBuffer();

        saveAs(new Blob([buf]), 'abc.xlsx');
    };

    return (
        <main>
            <section className="container">
                <h3>JSON to Excel</h3>
                <button onClick={saveAsExcel}>Save as Excel</button>
            </section>
        </main>
    );
};

export default App;
