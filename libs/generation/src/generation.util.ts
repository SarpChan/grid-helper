import { create_template_dimension } from '../../logic/src/lib/grid-to-css.util';
import { Generation, Section } from '../../fields/src/models/grid-options.model';
import { StoreEntity } from '../../../apps/grid-helper/src/app/+state/store.models';

function wrap_with_media_query(model: Generation, css_text: string) {
    if (!model.specifier) {
        return css_text;
    }

    css_text = css_text.split('\n').map(line => `    ${line}`).join('\n');

    if (model.specifier.from && model.specifier.to) {
        return `
    @media (min-width: ${model.specifier.from}${model.specifier.from_unit}) and (max-width: ${model.specifier.to}${model.specifier.to_unit}) {${css_text}
    }
    `;
    } else if (model.specifier.from) {
        return `
    @media (min-width: ${model.specifier.from}${model.specifier.from_unit}) {${css_text}
    }
    `;
    } else if (model.specifier.to) {
        return `
    @media (max-width: ${model.specifier.to}${model.specifier.to_unit}) {${css_text}
    }
    `;
    }

    return css_text;
}

export const generate_optimized = (model: Generation, fill_sections_up_to?: number, use_media_query = false) => {
    const [col_text, row_text, col_gap_text, row_gap_text] = generate_optimizable(model, true);

    const css_text = generate(col_text,
        row_text,
        col_gap_text,
        row_gap_text,
        model.sections,
        fill_sections_up_to);
    return use_media_query ? wrap_with_media_query(model, css_text) : css_text;
};

const generate = (col_text: string,
    row_text: string,
    col_gap_text: string,
    row_gap_text: string,
    sections: Section[],
    fill_sections_up_to?: number
) => {
    const col_flow_style = `grid-template-columns: ${col_text};`;
    const col_gap_style = `grid-column-gap: ${col_gap_text};`;
    const row_flow_style = `grid-template-rows: ${row_text};`;
    const row_gap_style = `grid-row-gap: ${row_gap_text};`;

    const grid = 'display: grid;';

    const grid_class = `
    .grid {
        ${grid}
        ${col_flow_style}
        ${row_flow_style}
        ${col_gap_style}
        ${row_gap_style}
    }
    `;

    const div_classes = sections.map((section, index) => `
    .div-${index} {
        grid-area: ${section.from.y + 1} / ${section.from.x + 1} / ${section.to.y + 2} / ${section.to.x + 2};
    }
    `);

    if (fill_sections_up_to && sections.length < fill_sections_up_to) {
        const remaining = fill_sections_up_to - sections.length;
        for (let i = 0; i < remaining; i++) {
            div_classes.push(`
    .div-${sections.length + i} {
        display: none;
    }
            `);
        }
    }

    return [grid_class, div_classes.join('')].join('');
};

export const generate_optimizable = (model: Generation, optimized: boolean): string[] => {
    const col_text = create_template_dimension(model.columns, optimized);
    const row_text = create_template_dimension(model.rows, optimized);

    const col_gap_text = `${model.col_gap.value ? model.col_gap.value + model.col_gap.unit : 0 + model.col_gap.unit}`;
    const row_gap_text = `${model.row_gap.value ? model.row_gap.value + model.row_gap.unit : 0 + model.row_gap.unit}`;
    console.log(model.col_gap.value);
    console.log(col_gap_text);
    return [
        col_text,
        row_text,
        col_gap_text,
        row_gap_text
    ];
};

export const generate_html = (model: Generation): string => {
    const grid_start = `
    <div class="grid">`;
    const closing_div = `</div>`;

    const children = model.sections.map((section, index) => `
        <div class="div-${index}"></div>`);

    return (
        `${grid_start}${children.join('')}
    ${closing_div}`);
};

export const generate_css_for_grid = (entity: StoreEntity,
    fill_sections_up_to?: number,
    use_media_query = false): string => {
    const columns = entity.tab.grid_options.columns;
    const rows = entity.tab.grid_options.rows;
    const col_gap = entity.tab.grid_options.col_gap;
    const row_gap = entity.tab.grid_options.row_gap;
    const sections = entity.tab.sections ?? [];
    const specifier = entity.tab.specifier;

    const generation_model = {columns, rows, col_gap, row_gap, sections, specifier};
    return generate_optimized(generation_model, fill_sections_up_to, use_media_query);

};
