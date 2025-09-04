import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'highlight',
    standalone: true
    })
    export class HighlightPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(text: string, query: string): SafeHtml {
        if (!text || !query) return text;

        const tokens = query
        .split(/\s+/)
        .map(t => t.trim())
        .filter(Boolean)
        .map(this.escapeRegExp);

        if (!tokens.length) return text;

        const regex = new RegExp(`(${tokens.join('|')})`, 'gi');
        const newText = text.replace(regex, '<mark>$1</mark>');

        return this.sanitizer.bypassSecurityTrustHtml(newText);
    }

    private escapeRegExp(str: string) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
