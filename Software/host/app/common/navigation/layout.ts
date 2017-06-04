/**
 * Макет отображения
 */

export enum Layout
{
    None = 0,
    
    ShowHeader = 1,     // 1 << 0,
    
    ShowFooter = 2,     // 1 << 1,

    ShowLeftSide = 4,   // 1 << 2,

    ShowRightSide = 8,  // 1 << 3
}