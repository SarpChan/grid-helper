export interface Grid_Options{
    rows: Dimension[];
    columns: Dimension[];
    col_gap: Dimension;
    row_gap: Dimension;
}

export const default_options: Grid_Options = {
    columns: [
        {value: 1, unit: 'fr'},
        {value: 1, unit: 'fr'},
        {value: 1, unit: 'fr'},
        {value: 1, unit: 'fr'},
        ],
    rows: [
        {value: 1, unit: 'fr'},
        {value: 1, unit: 'fr'},
        {value: 1, unit: 'fr'},
        {value: 1, unit: 'fr'},
        ],
    col_gap: {value: 1, unit: 'rem'},
    row_gap: {value: 1, unit: 'rem'},
}

export const get_default_options = (): Grid_Options => {
    return {
        rows: default_options.rows.map((row) => ({...row})),
        columns: default_options.columns.map((column) => ({...column})),
        col_gap: {...default_options.col_gap},
        row_gap: {...default_options.row_gap}
    };

};

export interface Cell {
    width: number | string;
    height: number | string;
    c_index: number;
    r_index: number;
}

export interface Dimension {
    id?: string;
    value: number;
    unit: string;
}

export interface Tab {
    name: string;
    specifier: OptionalFromTo;
    grid_options: Grid_Options;
    sections?: Section[];
}

export interface FromTo {
    from: number;
    from_unit?: string;
    to: number;
    to_unit?: string;
}
export interface OptionalFromTo {
    from?: number;
    from_unit?: string;
    to?: number;
    to_unit?: string;
}

export interface Coordinates {
    x: number;
    y: number;
}

export interface Section {
    from: Coordinates;
    to: Coordinates;
}

export interface Generation extends Grid_Options {
    sections: Section[],
    specifier?: OptionalFromTo;
}
