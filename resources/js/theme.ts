import { create } from 'zustand'
import { createTheme } from "@mantine/core";

const theme_grayish = createTheme({
    colors: {
        primary: [
            '#f4f4f6',
            '#e6e6e6',
            '#cbcbcb',
            '#afafb0',
            '#95969a',
            '#85878c',
            '#7c7f87',
            '#6a6d75',
            '#5d6169',
            '#4f535f',],
    },
    defaultGradient: {
        // degrees: 90,
        deg: 90,
        // from: '#47a077',
        // to: '#96d0b6',
    },
    primaryColor: 'primary',
})


const theme_bluish = createTheme({
    colors: {
        primary: [
            '#f0f4ff',
            '#e2e6ef',
            '#c3cad7',
            '#a3acc0',
            '#8793ab',
            '#7583a1',
            '#6d7c9c',
            '#5b6a88',
            '#505e7b',
            '#40516f',

        ],
    },
    defaultGradient: {
        // degrees: 90,
        deg: 90,
        from: '#40516f',
        to: '#8793ab',
    },
    primaryColor: 'primary',
})

function generateColorPalette(baseColor: string): string[] {
    // Helper function to convert hex to RGB
    function hexToRgb(hex: string): [number, number, number] {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    // Helper function to convert RGB to hex
    function rgbToHex(r: number, g: number, b: number): string {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }

    // Generate lighter shades
    function getLighterShades(rgb: [number, number, number], count: number): string[] {
        const shades: string[] = [];
        for (let i = 0; i < count; i++) {
            const factor = 1 - (i / count) * 0.6;
            const shade = rgb.map(c => Math.round(255 - (255 - c) * factor));
            shades.push(rgbToHex(...shade as [number, number, number]));
        }
        return shades.reverse();
    }

    // Generate darker shades
    function getDarkerShades(rgb: [number, number, number], count: number): string[] {
        const shades: string[] = [];
        for (let i = 0; i < count; i++) {
            const factor = 1 - (i / count) * 0.6;
            const shade = rgb.map(c => Math.round(c * factor));
            shades.push(rgbToHex(...shade as [number, number, number]));
        }
        return shades;
    }

    const rgb = hexToRgb(baseColor);
    const lighterShades = getLighterShades(rgb, 5);
    const darkerShades = getDarkerShades(rgb, 4);

    return [...lighterShades, baseColor, ...darkerShades];
}




const genTheme = (color: string) => {
    return createTheme({
        colors: {
            primary: generateColorPalette(color) as any,
        },
        defaultGradient: {
            deg: 90,
            from: '#40516f',
            to: '#8793ab',
        },
        primaryColor: 'primary',
    })
}

const useThemeStore = create((set) => ({
    currentTheme: theme_bluish,
    setTheme: (color: string) => {
        return set((_: any) => ({ currentTheme: genTheme(color) }))
    }
}))

export default useThemeStore;