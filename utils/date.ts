export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);

    const formatterDate = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const formattedDate = formatterDate.format(date);

    return `${formattedDate}`;
};