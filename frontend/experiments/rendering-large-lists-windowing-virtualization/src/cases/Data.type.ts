export type DataItem = {
    id: number;
    title: string;
    body: string;
};

export type Data = DataItem[];

export type RowData = {
    index: number;
    key: string;
    style: React.CSSProperties;
};
