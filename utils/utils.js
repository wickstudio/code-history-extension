/**
 * @param {string} timestamp
 * @returns {string}
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

/**
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
function truncateString(str, length) {
    if (str.length <= length) return str;
    return `${str.substring(0, length)}...`;
}

/**
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, match => {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escape[match];
    });
}

module.exports = {
    formatTimestamp,
    truncateString,
    escapeHTML
};
