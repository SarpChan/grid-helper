import { Dimension, FromTo } from '../../../fields/src/models/grid-options.model';

function determine_dimension_css(elements: Dimension[], partitions: FromTo[]) {
    if (elements.length === 1) {
        return `${elements.map((element) => `${element.value}${element.unit}`)}`;

    }

    return partitions.map((partition) => {
        const element = elements[partition.from];
        if (partition.from === partition.to) {
            return `${element.value ?? 1}${element.unit ?? 'fr'}`;
        }
        return `repeat(${partition.to - partition.from + 1}, ${element.value ?? 1}${element.unit ?? 'fr'})`;
    }).join(' ');
}

export const create_template_dimension = (elements: Dimension[], optimized: boolean): string => {
    const partitions =
        optimized
            ? determine_partitions(elements, (a: Dimension, b: Dimension) => to_value_unit(a) === to_value_unit(b))
            : elements.map((element, index) => ({from: index, to: index}));
    return determine_dimension_css(elements, partitions);
};

export const to_value_unit = (dimension: Dimension): string => `${dimension.value}${dimension.unit}`;

/**
 * Determines if a collection can be partitioned by a comparator function
 *
 * @param arr Collection to partition
 * @param comparator Comparator function to determine if two elements are part of a partition
 */
export function is_partitionable<T>(arr: T[], comparator: (a: T, b: T) => boolean): boolean {
    return determine_partitions(arr, comparator).length > 1;
}

/**
 * Partitions a collection by a comparator function
 *
 * @param arr Collection to partition
 * @param comparator Comparator function to determine if two elements are part of a partition
 */
export function determine_partitions<T>(arr: T[], comparator: (a: T, b: T) => boolean): FromTo[] {
    const partitions: FromTo[] = [];
    let current_partition: FromTo | null = null;
    for (let index = 0; index < arr.length; index++) {
        if (index === arr.length - 1) {
            if (!current_partition) {
                partitions.push({from: index, to: index});
            } else {
                current_partition.to = index;
                partitions.push(current_partition);
            }
        } else if (!current_partition && comparator(arr[index], arr[index + 1])) {
            // start of a partition including next element
            current_partition = {from: index, to: index + 1};
        } else if (!current_partition && !comparator(arr[index], arr[index + 1])) {
            // start and end of a partition
            current_partition = {from: index, to: index};
            partitions.push(current_partition);
            current_partition = null;
        } else if (current_partition && !comparator(arr[index], arr[index + 1])) {
            // end of a partition
            current_partition.to = index;
            partitions.push(current_partition);
            current_partition = null;
        } else {
            // middle of a partition
            current_partition!.to = index + 1;
        }
    }
    return partitions;
}
