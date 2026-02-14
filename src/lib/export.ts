import { toPng } from 'html-to-image';

/**
 * Export a DOM element as a PNG image and trigger download.
 */
export async function exportAsImage(
    element: HTMLElement,
    filename: string = 'chaoshub-card.png'
): Promise<void> {
    try {
        const dataUrl = await toPng(element, {
            quality: 0.95,
            pixelRatio: 2,
            backgroundColor: '#1a1410',
        });
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Failed to export image:', err);
        throw new Error('Image export failed. Please try again.');
    }
}

/**
 * Copy text to clipboard with fallback.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        /* Fallback for older browsers */
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch {
            return false;
        }
    }
}
