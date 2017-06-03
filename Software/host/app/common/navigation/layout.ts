/**
 * Макет
 */

export enum Layout
{
    None = 0,
    
    ShowHeader = 1 << 0,
    
    ShowFooter = 1 << 1,

    ShowLeftSide = 1 << 2,

    ShowRightSide = 1 << 3
}