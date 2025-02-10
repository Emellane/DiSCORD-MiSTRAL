export function splitMessage(message, maxLength = 2000) {
    if (!message) return ['Pas de réponse disponible'];
    
    const chunks = [];
    let start = 0;

    while (start < message.length) {
        let end = start + maxLength;

        // Éviter de couper un mot en plein milieu
        if (end < message.length) {
            // Chercher le dernier caractère de ponctuation ou espace
            const lastBreak = message.slice(start, end + 1).search(/[.!?]\s+[A-Z]|$/);
            if (lastBreak > 0) {
                end = start + lastBreak + 1;
            } else {
                const lastSpace = message.lastIndexOf(" ", end);
                if (lastSpace > start) {
                    end = lastSpace;
                }
            }
        }

        const chunk = message.slice(start, end).trim();
        if (chunk) chunks.push(chunk);
        start = end;
    }

    return chunks.length > 0 ? chunks : ['Pas de réponse disponible'];
}