export enum Units {
    PX = 'px',
    PERCENT = '%',
    EM = 'em',
    REM = 'rem',
    VW = 'vw',
    VH = 'vh',
    VMIN = 'vmin',
    VMAX = 'vmax',
    CM = 'cm',
    MM = 'mm',
    IN = 'in',
    PT = 'pt',
    PC = 'pc',
    EX = 'ex',
    CH = 'ch',
    FR = 'fr',
    AUTO = 'auto',
    IC = 'ic',
    LH = 'lh',
    RLH = 'rlh',
    VI = 'vi',
    VB = 'vb',
    CQW = 'cqw',
    CQH = 'cqh',
    CQI = 'cqi',
    CQB = 'cqb',
    CQMIN = 'cqmin',
    CQMAX = 'cqmax',
    Q = 'q',
}

export const font_units = [
    Units.EM,
    Units.REM,
    Units.CH,
    Units.EX,
    Units.IC,
    Units.LH,
    Units.RLH

];

export const absolute_units = [
    Units.PX,
    Units.CM,
    Units.MM,
    Units.IN,
    Units.PT,
    Units.PC

];

export const dynamic_units = [
    Units.FR,
    Units.AUTO,
    Units.PERCENT,
];

export const viewport_units = [
    Units.VW,
    Units.VH,
    Units.VMIN,
    Units.VMAX,
    Units.VB,
    Units.VI
];

export const container_units = [
    Units.CQW,
    Units.CQH,
    Units.CQI,
    Units.CQB,
    Units.CQMIN,
    Units.CQMAX
];