export const generate_color = (len: number) => {
    const initial_saturation = 80;
    const initial_lightness = 50;
    const hue_delta = 40;
    const alpha = 1;
    const colors: string[] = [];

    for (let i = 0; i < len; i++) {
        let hue = i * hue_delta;
        let saturation = initial_saturation;
        let lightness = initial_lightness;

        if (hue > 360) {
            if ((hue / 360) % 2 === 0) {
                saturation -= 20 * Math.floor(hue / 360);
            } else {
                lightness += 10 * Math.floor(hue / 360);

            }
        }
        colors.push(`hsla(${hue},${saturation}%,${lightness}%, ${alpha})`)
    }

    return colors;

}